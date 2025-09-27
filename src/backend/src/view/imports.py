from fastapi import UploadFile

from src import app
from src.apps.imports import ImportsAppDep


@app.post("/import/gedcom")
def import_gedcom(file: UploadFile, name: str, imports_app: ImportsAppDep):
    imports_app.import_gedcom(file.file, name)
    return {"status": "ok"}
