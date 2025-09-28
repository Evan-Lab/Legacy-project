from fastapi import HTTPException

from src import app


class ConflictError(Exception):
    pass


@app.exception_handler(ConflictError)
async def conflict_exception_handler(request, exc: ConflictError):
    raise HTTPException(status_code=409, detail=str(exc))


class NotFoundError(Exception):
    pass


@app.exception_handler(NotFoundError)
async def not_found_exception_handler(request, exc: NotFoundError):
    raise HTTPException(status_code=404, detail=str(exc))
