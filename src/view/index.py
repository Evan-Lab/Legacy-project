from fastapi import Request
from fastapi.responses import HTMLResponse
from src.apps.base import BaseAppDep
from . import render
from src.routers import root_router


# Example data you render under "available genealogies"
BASES = [
    {"slug": "smith_family", "label": "Smith Family"},
    {"slug": "dupont_arbre", "label": "Dupont"},
    {"slug": "ivanov_tree", "label": "Ivanov"},
]

@root_router.get("/", response_class=HTMLResponse)
async def index(
    request: Request,
    bases: BaseAppDep
) -> HTMLResponse:
    print("handling /index request")

    dto = bases.index()

    ctx = {
        "bases": dto.bases
    }

    print(f"Rendering index with context: {ctx}")

    return render(request, "index.html.j2", ctx)
