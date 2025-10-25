from fastapi import Request
from fastapi.responses import HTMLResponse
from src import app
from src.apps.base import BaseAppDep
from .templates import templates

# Example data you render under "available genealogies"
BASES = [
    {"slug": "smith_family", "label": "Smith Family"},
    {"slug": "dupont_arbre", "label": "Dupont"},
    {"slug": "ivanov_tree", "label": "Ivanov"},
]


@app.get("/", response_class=HTMLResponse)
async def index(
    request: Request,
    bases: BaseAppDep,
    lang: str = "en",
) -> HTMLResponse:
    dto = bases.index()
    ctx = {
        "request": request,
        "lang": lang,
        "bases": dto.bases,

    }

    return templates.TemplateResponse("index.html.j2", ctx)
