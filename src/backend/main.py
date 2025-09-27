#!/usr/bin/env python3

from src.database import init_db

from src import (
    app,
    api,  # noqa: F401
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
