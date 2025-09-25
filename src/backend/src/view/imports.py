from fastapi import UploadFile
from sqlmodel import select
from src.database import SessionDep
from src.models import Individual

from src import app
from src.service.imports import ImportsService, Format
from src.service.individual import IndividualService
from src.service.parser import ParserService

@app.get("/import/gedcom")
def import_gedcom(file: UploadFile, session: SessionDep):
    imports_service = ImportsService()
    parser_service = ParserService()
    individual_service = IndividualService(session)

    path = imports_service.import_gedcom(file.file)

    individuals = parser_service.parse_gedcom(path)

    individual_service.create_bulk_individuals(individuals)
    return {"status": "ok"}
    
