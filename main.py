#!/usr/bin/env python3

from src import (
    app,
    startup, # noqa: F401
    static, # noqa: F401
    view,  # noqa: F401
    api,  # noqa: F401
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
