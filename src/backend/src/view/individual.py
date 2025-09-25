from sqlmodel import select
from src.database import SessionDep
from src.models import Individual

from src import app


@app.get("/individuals/")
def read_individuals(session: SessionDep) -> list[Individual]:
    individuals = session.exec(select(Individual)).all()
    return list(individuals)
