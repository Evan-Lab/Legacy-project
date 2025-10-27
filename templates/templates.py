from fastapi import Request
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

# templates.env.globals.update(
#     _=_noop_translate,
#     hash=asset_hash,
# )

def render(request: Request, template_name: str, ctx: dict | None = None, status_code: int = 200, **kwargs):
    base = getattr(request.state, "common_context", {})  # set by the dependency above
    context = {"request": request, **base, **(ctx or {})}

    print("Rendering template:", template_name)
    print("With context:", context)
    print("Status code:", status_code)
    print("Globals in template env:", templates.env.globals.keys())

    return templates.TemplateResponse(template_name, context, status_code=status_code, **kwargs)
