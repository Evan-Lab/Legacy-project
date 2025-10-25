from src import app
from src.database import init_db

@app.on_event("startup")
def on_startup():
    init_db()