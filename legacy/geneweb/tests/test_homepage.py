import re

from playwright.sync_api import expect


def _lang_locator(page, label_regex):
    """Return a robust locator for a language button/link."""
    loc = page.get_by_role("button", name=label_regex)
    if loc.count() == 0:
        loc = page.get_by_role("link", name=label_regex)
    return loc


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


def test_submit_redirects_to_base(page):
    """Expected: after submitting 'base', the URL contains the parameter b=base (redirection occurs even if the base does not exist)."""
    page.goto("/")
    page.get_by_role("textbox").fill("base")
    page.get_by_role("button", name=re.compile(r"^Ok$", re.I)).click()
    page.wait_for_load_state("domcontentloaded")

    url = page.url
    assert "b=base" in url, f"The parameter b=base is missing in the URL: {url}"


def test_submit_non_existing_base_shows_404(page):
    """Expected: submitting 'base' (which does not exist) shows a 404 error message in the page content."""
    page.goto("/")
    page.get_by_role("textbox").fill("base")
    page.get_by_role("button", name=re.compile(r"^Ok$", re.I)).click()
    page.wait_for_load_state("domcontentloaded")

    body_text = page.locator("body").inner_text().lower()
    assert "404" in body_text or "error 404" in body_text or "not found" in body_text, (
        "The page does not show a 404 error even though the base does not exist.\n"
        f"Body excerpt: {body_text[:300]}"
    )
