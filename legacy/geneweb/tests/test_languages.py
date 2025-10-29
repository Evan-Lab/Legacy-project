import re
import urllib.parse

import pytest
from playwright.sync_api import expect


def _lang_locator(page, label_regex):
    """Return a robust locator for a language button/link."""
    loc = page.get_by_role("button", name=label_regex)
    if loc.count() == 0:
        loc = page.get_by_role("link", name=label_regex)
    return loc


def _lang_locator_exact(page, label_text: str):
    """Try exact match first (button or link). Return locator if exactly 1 match, else None."""
    for role in ("button", "link"):
        loc = page.get_by_role(role, name=label_text, exact=True)
        try:
            if loc.count() == 1:
                return loc
        except Exception:
            pass
    return None


def test_homepage_elements_are_visible(page):
    """Expected: the homepage displays a heading, an input box, an 'Ok' button, and language options (English, Français)."""
    page.goto("/")
    heading = page.get_by_role("heading", level=1)
    expect(heading).to_be_visible()
    expect(heading).to_have_text(re.compile(r".+"))

    textbox = page.get_by_role("textbox")
    ok_button = page.get_by_role("button", name=re.compile(r"^Ok$", re.I))
    expect(textbox).to_be_visible()
    expect(ok_button).to_be_enabled()

    expect(_lang_locator(page, re.compile(r"English", re.I))).to_be_visible()
    expect(_lang_locator(page, re.compile(r"fran.?ais", re.I))).to_be_visible()


def _lang_locator_regex(page, label_regex):
    """Fallback: regex match, prefer button, else link; if multiple, take first."""
    loc = page.get_by_role("button", name=label_regex)
    if loc.count() == 0:
        loc = page.get_by_role("link", name=label_regex)
    return loc.first


def _click_language(page, label_pattern):
    """Click a language option using exact match when possible, otherwise regex-first."""
    literal = None
    if isinstance(label_pattern, re.Pattern):
        if re.escape(label_pattern.pattern) == label_pattern.pattern:
            literal = label_pattern.pattern
    elif isinstance(label_pattern, str):
        literal = label_pattern

    if literal:
        exact = _lang_locator_exact(page, literal)
        if exact:
            exact.click()
            return

    regex = (
        label_pattern if isinstance(label_pattern, re.Pattern) else re.compile(label_pattern, re.I)
    )
    _lang_locator_regex(page, regex).click()


def _get_lang_code(url: str) -> str | None:
    """Extract the 'lang' query parameter from a URL."""
    parsed = urllib.parse.urlparse(url)
    q = urllib.parse.parse_qs(parsed.query)
    vals = q.get("lang")
    return vals[0] if vals else None


LANG_LABELS = [
    r"Afrikaans",
    r"العربية",
    r"български",
    r"brezhoneg",
    r"català",
    r"corsu",
    r"čeština",
    r"dansk",
    r"Deutsch",
    r"English",
    r"esperanto",
    r"Español",
    r"eesti",
    r"suomi",
    r"fran.?ais",
    r"עברית",
    r"íslenska",
    r"italiano",
    r"Latviešu",
    r"Lietuvių",
    r"Nederlands",
    r"norsk",
    r"occitan",
    r"polski",
    r"Português",
    r"Português-do-Brasil",
    r"romaneste",
    r"русский",
    r"slovenčina",
    r"slovenščina",
    r"svenska",
    r"turkish",
    r"中文",
]


@pytest.mark.parametrize("label_pattern", [re.compile(pat, re.I) for pat in LANG_LABELS])
def test_each_language_sets_lang_param_or_changes_heading(page, label_pattern):
    """
    Expected: clicking any language should EITHER
    - change the 'lang' query parameter compared to the initial page, OR
    - change the main heading text (if the site was initially in another language).
    This covers the 'English' case where the heading may stay the same but '?lang=en' appears.
    """
    page.goto("/")

    h1 = page.get_by_role("heading", level=1)
    expect(h1).to_be_visible()
    initial_heading = h1.inner_text().strip()
    initial_lang = _get_lang_code(page.url)

    _click_language(page, label_pattern)
    page.wait_for_load_state("domcontentloaded")

    url = page.url
    new_heading = h1.inner_text().strip()
    new_lang = _get_lang_code(url)

    assert new_lang is not None and new_lang != "", (
        f"'lang' parameter missing or empty after selecting {label_pattern.pattern!r}: {url}"
    )

    assert (new_heading != initial_heading) or (new_lang != initial_lang), (
        f"No visible change detected after selecting {label_pattern.pattern!r}: "
        f"heading stayed {new_heading!r}, lang stayed {new_lang!r}. URL: {url}"
    )


def test_arabic_switch_sets_rtl_if_supported(page):
    """Expected: selecting Arabic sets '?lang=...' and, if supported, switches document direction to RTL (soft check)."""
    page.goto("/")
    _click_language(page, re.compile(r"العربية", re.I))
    page.wait_for_load_state("domcontentloaded")

    url = page.url
    lang = _get_lang_code(url)
    assert lang, f"'lang' missing or empty for Arabic: {url}"

    html_dir = (page.locator("html").get_attribute("dir") or "").lower()
    body_dir = (page.locator("body").get_attribute("dir") or "").lower()
    if not (html_dir == "rtl" or body_dir == "rtl"):
        print("NOTE: No dir='rtl' found; acceptable if the theme doesn't toggle direction.")
