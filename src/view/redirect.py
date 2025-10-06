from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from src.app import app

templates = Jinja2Templates(directory="templates")

# Import helper functions from welcome.py
from src.view.welcome import t, i18n_block, language_name, UrlSet, uri_encode, interp, random_pick

# Register globals
templates.env.globals.update(
    t=t,
    i18n_block=lambda opts: i18n_block(opts),
    language_name=language_name,
    url_set=UrlSet(),
    uri_encode=uri_encode,
    interp=interp,
    random_pick=random_pick,
)


@app.get("/redirect", response_class=HTMLResponse)
async def redirect_page(request: Request, link: str) -> HTMLResponse:
    """Page indicating service address has changed"""
    ctx = {
        "request": request,
        "lang": "fr",
        "images_prefix": "/static/img/",
        "link": link,
        "query_time": ""
    }
    return templates.TemplateResponse("redirect.html.j2", ctx)


@app.get("/moved", response_class=HTMLResponse)
async def moved_page(request: Request, bname: str, moved_url: str) -> HTMLResponse:
    """Page indicating database has moved"""
    ctx = {
        "request": request,
        "lang": "fr",
        "images_prefix": "/static/img/",
        "bname": bname,
        "b": {"moved": moved_url},
        "query_time": ""
    }
    return templates.TemplateResponse("moved.html.j2", ctx)


@app.get("/renamed", response_class=HTMLResponse)
async def renamed_page(request: Request, old: str, new: str, link: str) -> HTMLResponse:
    """Page indicating database has been renamed"""
    ctx = {
        "request": request,
        "lang": "fr",
        "images_prefix": "/static/img/",
        "old": old,
        "new": new,
        "link": link,
        "query_time": ""
    }
    return templates.TemplateResponse("renamed.html.j2", ctx)
