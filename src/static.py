from fastapi.staticfiles import StaticFiles
from src import app

app.mount("/static", StaticFiles(directory="static"), name="static")
