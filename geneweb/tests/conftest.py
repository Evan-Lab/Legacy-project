import pathlib

import pytest
from playwright.sync_api import Page


@pytest.fixture(autouse=True)
def fail_on_network_errors(page: Page):
    """Fail the test on serious network issues (5xx responses or hard request failures).
    Benign 404s (e.g., /favicon.ico) are ignored by design.
    """
    bad = []

    def on_response(resp):
        status = resp.status
        url = resp.url
        if status >= 500:
            bad.append((status, url))

    def on_request_failed(req):
        bad.append((0, req.url))

    page.on("response", on_response)
    page.on("requestfailed", on_request_failed)
    yield
    assert not bad, "Network errors detected (5xx or request failures):\n" + "\n".join(
        f"{s} {u}" for s, u in bad
    )


@pytest.fixture(autouse=True)
def trace_each_test(page: Page, request: pytest.FixtureRequest):
    """Capture Playwright tracing (screenshots, snapshots, sources) for each test."""
    ctx = page.context
    ctx.tracing.start(screenshots=True, snapshots=True, sources=True)
    yield
    out_file = pathlib.Path("traces") / f"{request.node.name}.zip"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    ctx.tracing.stop(path=out_file.as_posix())
