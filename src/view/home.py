import random as random_module

from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from src import app
from src.apps.book import BookAppDep

from . import render

from src.routers import base_router


@base_router.get("/", response_class=HTMLResponse)
async def home(request: Request, book: BookAppDep) -> HTMLResponse:
    dto = book.welcome()


    # ctx = {
    #     "request": request,
    #     "lang": "fr",
    #     "default_lang": "en",
    #     "images_prefix": "/static/img/",
    #     "prefix": "/gw?",
    #     "action": "/gw",
    #     "body_prop": "",
    #     "hidden": "",
    #     "roglo": False,
    #     "cgi": False,
    #     "wizard": False,
    #     "friend": False,
    #     "predictable_mode": False,
    #     "browsing_with_sosa_ref": False,
    #     "has_history": True,
    #     "has_misc_notes": False,
    #     "cancel_links": False,
    #     "referer": request.headers.get("referer", ""),
    #     "base": {
    #         "name": dto.base.name,
    #         "real_nb_persons": dto.base.real_nb_persons,
    #         "has_notes": dto.base.has_notes,
    #     },
    #     "b": {
    #         "default_lang": "en",
    #         "propose_titles": "yes",
    #         "history": "yes",
    #         "counter": "yes",
    #         "hide_querytime_bugs": "no",
    #         "alt_serv_base": "",
    #         "alt_serv_adr": "",
    #     },
    #     "user": {"name": "", "ident": "guest", "key": ""},
    #     "e": {"i": "", "p": "", "n": "", "pn": "", "oc": "", "m": "", "templ": ""},
    #     "sosa_ref": {"access": "i=1", "value": "1"},
    #     "nb_persons": {"v": dto.nb_persons},
    #     "plugin": {"forum": True},
    #     "env_binding": [],
    #     "nb_accesses": 1000,
    #     "nb_accesses_to_welcome": 120,
    #     "start_date": "2020-01-01",
    #     "query_time": "",
    #     "random": random_helper,
    #     "url_set": url_set,
    # }

    ctx = {
        "nb_persons": {"v": dto.nb_persons},
        "e": {"i": "", "p": "", "n": "", "pn": "", "oc": "", "m": "", "templ": ""},
        "b": {
            "default_lang": "en",
            "propose_titles": "yes",
            "history": "yes",
            "counter": "yes",
            "hide_querytime_bugs": "no",
            "alt_serv_base": "",
            "alt_serv_adr": "",
        },
        "cancel_links": False,
    }

    return render(request, "welcome.html.j2", ctx)
