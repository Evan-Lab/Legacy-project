from urllib.parse import quote

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from .templates import templates

from src.app import app
from src.apps.book import BookAppDep

# app.mount("/static", StaticFiles(directory="static"), name="static")




# ---- helpers (very small examples) ----
def t(path: str, idx: int):
    # "a/b/c" with idx 0.. -> "a","b","c"
    if path.startswith('*'):
        # allow direct tokens like "*history"
        return path.lstrip('*')
    parts = path.split('/')
    try:
        return parts[idx]
    except Exception:
        return path

def i18n_block(options: dict, lang='en', default_lang='en'):
    return options.get(lang) or options.get(default_lang) or next(iter(options.values()), '')

def language_name(code: str) -> str:
    names = {'en':'English','fr':'Français','pt-br':'Português (Brasil)'}  # extend as needed
    return names.get(code, code)

class UrlSet:
    def lang_file(self, code: str | None = None) -> str:
        return f"?lang={code}" if code else "?lang="
    def w(self, mode: str) -> str:
        return f"?w={mode}"

def uri_encode(s: str) -> str:
    return quote(s, safe='')

def interp(s: str) -> str:
    # pass-through or expand your tokens here
    return s

def random_pick(kind: str):
    # plug your own RNG / db query
    return 42

templates.env.globals.update(
    t=t,
    i18n_block=lambda opts: i18n_block(opts),  # lang pulled from context in your wrapper if you prefer
    language_name=language_name,
    url_set=UrlSet(),
    uri_encode=uri_encode,
    interp=interp,
    random_pick=random_pick,
)


# class WelcomeData(BaseModel):
#     class BaseData(BaseModel):
#         name: str
#         real_nb_persons: str
#         has_notes: bool

#     lang: str
#     default_lang: str
#     prefix: str
#     action: str
#     body_prop: str
#     hidden: str
#     query_time: str
#     start_date: str
#     roglo: bool
#     cgi: bool
#     wizard: bool
#     friend: bool
#     predictable_mode: bool
#     browsing_with_sosa_ref: bool
#     has_history: bool
#     has_misc_notes: bool
#     base: BaseData
#     nb_accesses: int

#     nb_accesses_to_welcome: int



@app.get("/{base}/welcome", response_class=HTMLResponse)
async def welcome(request: Request, book: BookAppDep) -> HTMLResponse:
    dto = book.welcome()
    ctx = {
        "request": request,
        "lang": "fr",
        "default_lang": "en",
        "images_prefix": "/static/img/",
        "prefix": "/gw?",
        "action": "/gw",
        "body_prop": "",
        "hidden": "",
        "roglo": False,
        "cgi": False,
        "wizard": False,
        "friend": False,
        "predictable_mode": False,
        "browsing_with_sosa_ref": False,
        "has_history": True,
        "has_misc_notes": False,
        "base": {"name": dto.base.name, "real_nb_persons": dto.base.real_nb_persons, "has_notes": False},
        "b": {"default_lang":"en","propose_titles":"yes","history":"yes","counter":"yes"},
        "user": {"name":"", "ident":"guest", "key":""},
        "e": {"i":"", "p":"", "n":"", "pn":"", "oc":""},
        "sosa_ref": {"access":"i=1", "value":"1"},
        "nb_persons": {"v": dto.nb_persons},
        "plugin": {"forum": True},
        "env_binding": [],
        "nb_accesses": 1000,
        "nb_accesses_to_welcome": 120,
        "start_date": "2020-01-01",
        "query_time": ""
    }
    return templates.TemplateResponse("welcome.html.j2", ctx)
