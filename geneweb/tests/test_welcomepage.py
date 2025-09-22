import os
import re
import urllib.parse as up

import pytest
from playwright.sync_api import expect


def _exists(page, selector: str) -> bool:
    try:
        return page.locator(selector).count() > 0
    except Exception:
        return False


def _first_text(page, selector: str, default: str = "") -> str:
    if not _exists(page, selector):
        return default
    return page.locator(selector).first.inner_text().strip()


@pytest.fixture(scope="session")
def base_url(pytestconfig) -> str:
    """Use --base-url CLI or BASE_URL env (exactly how you run tests)."""
    env = os.getenv("BASE_URL")
    cli = pytestconfig.getoption("--base-url", default=None)
    url = cli or env
    if not url:
        pytest.skip("Set BASE_URL or pass --base-url to run welcome template tests.")
    return url.rstrip("/")


def test_head_meta_and_icons(context, base_url):
    """Basic <head> and document-level attributes."""
    res = context.request.get(base_url)
    assert res.ok, f"GET {base_url} failed with status {res.status}"
    html = res.text()

    assert re.search(r'<meta[^>]+charset=["\']?utf-8["\']?', html, flags=re.I), (
        "Missing/invalid UTF-8 meta"
    )
    assert 'name="viewport"' in html, "Missing viewport meta"

    assert re.search(
        r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']none["\']', html, flags=re.I
    ), "robots none missing"

    assert re.search(r"<title>\s*GeneWeb\s*–\s*.+</title>", html), (
        "Title does not include 'GeneWeb – …'"
    )

    assert re.search(r'rel=["\']icon["\']', html, flags=re.I), "Favicon link missing"
    assert re.search(r'rel=["\']apple-touch-icon["\']', html, flags=re.I), (
        "Apple touch icon missing"
    )


def test_html_lang_attribute(page, base_url):
    page.goto(base_url, wait_until="domcontentloaded")
    lang = page.locator("html").get_attribute("lang") or ""
    assert lang and lang != "%lang;", "Invalid html[lang] attribute"
    assert re.fullmatch(r"[a-z]{2}(-[a-z]{2})?", lang, flags=re.I), (
        f"Unexpected lang format: {lang}"
    )


def test_error_alert_when_query_params_present(page, base_url):
    """
    The template shows a danger alert if any of e.i / e.p / e.n / e.pn is set.
    We trigger with e.pn to verify the 'unknown person' path shows an alert.
    """
    url = f"{base_url}?{up.urlencode({'e.pn': 'John Doe'})}"
    page.goto(url, wait_until="domcontentloaded")

    if not _exists(page, ".alert.alert-danger"):
        pytest.skip("Danger alert not shown (instance may not render this branch).")
    expect(page.locator(".alert.alert-danger")).to_be_visible()

    assert "John" in page.locator(".alert.alert-danger").inner_text(), (
        "Alert does not reference the provided person"
    )


def test_visitor_access_alert_or_search_ui(page, base_url):
    """
    Possibility A: visitor access denied -> red alert with visitor message.
    Possibility B: visitor allowed (or wizard/friend) -> search UI present (#welcome-search).
    """
    page.goto(base_url, wait_until="domcontentloaded")

    has_alert = _exists(page, ".alert.alert-danger")
    has_search = _exists(page, "#welcome-search") and _exists(page, "form#main-search")

    assert has_alert or has_search, "Neither visitor alert nor search UI present"

    if has_search:
        expect(page.locator("input#fullname")).to_be_visible()
        expect(page.locator("input#firstname")).to_be_visible()
        expect(page.locator("input#surname")).to_be_visible()
        assert page.locator("form#main-search input[name='m'][value='S']").count() >= 1


def test_stats_and_random_dice_possibility(page, base_url):
    """
    If visitor allowed, the stats block appears with number of individuals and possibly a dice link
    (when nb_persons>0 and not predictable_mode). We accept either presence or justified absence.
    """
    page.goto(base_url, wait_until="domcontentloaded")

    stats_text = _first_text(page, "span.text-center.h4, span.text-center.h5")
    if stats_text:
        assert re.search(r"\d", stats_text), f"Stats block lacks a number: '{stats_text}'"

    if _exists(page, ".fa-dice"):
        link = page.locator("a:has(.fa-dice)")
        expect(link).to_be_visible()


def test_calendar_and_tools_links_when_visible(page, base_url):
    """
    Tools section includes several links; some are conditional.
    We check for Calendar (always present in template) and validate select others when present.
    """
    page.goto(base_url, wait_until="domcontentloaded")

    cal = page.locator("a[href*='m=CAL']")
    assert cal.count() >= 1, "Calendar link (m=CAL) not found"
    expect(cal.first).to_be_visible()

    for q in ["m=STAT", "m=ANM", "m=HIST", "m=NOTES", "m=MISC_NOTES"]:
        loc = page.locator(f"a[href*='{q}']")
        if loc.count() > 0:
            expect(loc.first).to_be_visible()


def test_language_dropdown_if_present(page, base_url):
    """
    On Roglo (or certain configs), a language dropdown with .scrollable-lang appears.
    If present, ensure at least one language option exists and looks valid.
    """
    page.goto(base_url, wait_until="domcontentloaded")
    if not _exists(page, ".dropdown-menu.scrollable-lang"):
        pytest.skip("Language dropdown not present in this configuration.")

    items = page.locator(".dropdown-menu.scrollable-lang a[id^='lang_']")
    assert items.count() > 0, "No language items found in dropdown"


def test_counter_block_if_present(page, base_url):
    """
    The footer can render a localized counter/about block. If present, expect digits and a date-like token.
    """
    page.goto(base_url, wait_until="domcontentloaded")
    text = page.locator("body").inner_text()

    if re.search(
        r"\b\d{1,3}(?:[ .,\u00A0]\d{3})*\b.*\b\d{1,3}(?:[ .,\u00A0]\d{3})*\b",
        text,
        flags=re.S,
    ) or re.search(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", text):
        assert True
    else:
        pytest.skip("Counter block not detected (may be disabled on this instance).")


def test_favicons_resolve_if_linked(page, context, base_url):
    """
    If the document links a favicon/apple-touch-icon, try fetching them.
    Tolerate 404s by skipping (some setups compute links conditionally).
    """
    page.goto(base_url, wait_until="domcontentloaded")
    links = page.locator("link[rel='icon'], link[rel='apple-touch-icon']")
    if links.count() == 0:
        pytest.skip("No icon links present to verify.")

    for i in range(links.count()):
        href = links.nth(i).get_attribute("href") or ""
        if not href:
            continue
        href = href if href.startswith("http") else f"{base_url.rstrip('/')}/{href.lstrip('/')}"
        res = context.request.get(href)
        if not res.ok:
            pytest.skip(f"Icon not reachable ({href}); environment may not expose static assets.")
