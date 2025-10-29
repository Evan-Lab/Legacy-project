from contextvars import ContextVar

from fastapi import Request
from fastapi.templating import Jinja2Templates
from jinja2 import pass_context

from src.i18n.catalog import translate

templates = Jinja2Templates(directory="templates")

_current_lang = ContextVar("_current_lang", default="en")


def _gettext_impl(msgid: str) -> str:
    lang = _current_lang.get()
    return translate(lang, msgid)


def _ngettext_impl(singular: str, plural: str, n: int) -> str:
    lang = _current_lang.get()
    msgid = singular if n == 1 else plural
    return translate(lang, msgid)


templates.env.add_extension("jinja2.ext.i18n")
templates.env.install_gettext_callables(
    _gettext_impl,
    _ngettext_impl,
    newstyle=False,
)


@pass_context
def _gettext(context, msgid: str, **variables):
    text = _gettext_impl(msgid)
    if variables:
        try:
            text = text % variables
        except (TypeError, ValueError):
            text = text.format(**variables)
    return text


templates.env.globals["_"] = _gettext

# templates.env.globals.update(
#     _=_noop_translate,
#     hash=asset_hash,
# )

def render(request: Request, template_name: str, ctx: dict | None = None, status_code: int = 200, **kwargs):
    base = getattr(request.state, "common_context", {})  # set by the dependency above
    context = {"request": request, **base, **(ctx or {})}
    lang = context.get("lang", "en") or "en"
    _current_lang.set(lang)
    context["_"] = _gettext

    print("Rendering template:", template_name)
    print("With context:", context)
    print("Status code:", status_code)
    print("Globals in template env:", templates.env.globals.keys())

    return templates.TemplateResponse(template_name, context, status_code=status_code, **kwargs)
