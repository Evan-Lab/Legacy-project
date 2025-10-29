from src import app
from .root import root_router
from .base import base_router

def register():
    app.include_router(root_router)
    app.include_router(base_router)
