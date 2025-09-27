from fastapi import HTTPException

from src import app


class ConflictError(Exception):
    pass

@app.exception_handler(ConflictError)
async def conflict_exception_handler(request, exc: ConflictError):
    raise HTTPException(status_code=409, detail=str(exc))
