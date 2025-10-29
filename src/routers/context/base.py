import datetime

from fastapi import Request

from src.service.base import BaseDep, BasesDep

async def base_context(
    request: Request,
    base: BaseDep,
    bases: BasesDep,
):
    print("building common context")

    # base context
    t = base.name if base else None
    f = t if t else ""
    g = f
    s = f + "?"


    # numbers context
    n = bases.count_persons(base)
    c = 0
    q = 0
    d = datetime.datetime.now().isoformat()

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

    def capitalize(s: str) -> str:
        if not s:
            return s
        return s[0].upper() + s[1:]

    context = {
        # base context
        "t": t,
        "f": f,
        "g": g,
        "s": s,

        # numbers context
        "n": n,
        "c": c,
        "q": q,
        "d": d,

        # conditional context
        "I": I,

        # evars
        "body_prop": body_prop,
        "lang": lang,

        "base": base,

        "user": {
            "name": "",
            "ident": "guest",
            "key": "",
        },

        "capitalize": capitalize,

        "plugin": {}
    }

    if hasattr(request.state, "common_context"):
        request.state.common_context.update(context)
    else:
        request.state.common_context = context