import datetime

from fastapi import Request

from src.service.base import BasesDep


async def common_context(
    request: Request,
):
    print("building common context")

    # conditional context
    I = {}  # noqa: E741
    I["f"] = False
    I["w"] = False
    I["j"] = False
    I["c"] = False
    I["I"] = False
    I["n"] = False
    I["t"] = False
    I["z"] = False
    I["a"] = False

    # evars
    body_prop = ""

    lang = request.query_params.get("lang", "en")
    templ = request.query_params.get("templ", "")

    context = {
        # conditional context
        "I": I,

        # evars
        "body_prop": body_prop,
        "lang": lang,

        # defaults used by generated templates
        "e": {"m": "", "t": ""},
        "b": {"css_prop": ""},
        "bvar": {"use_cdn": "no", "css_prop": ""},
        "etc_prefix": "",
        "evar": {"lang": lang, "templ": templ},

        "connections": {
            "total": 0,
            "friends": 0,
            "wizards": 0,
        }
    }

    if hasattr(request.state, "common_context"):
        request.state.common_context.update(context)
    else:
        request.state.common_context = context
