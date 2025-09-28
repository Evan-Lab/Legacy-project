from sqlmodel import select

from src import app
from src.apps.book import BookAppDep
from src.database import SessionDep
from src.models import Individual


@app.get("/individuals/{base}")
def read_individuals(session: SessionDep) -> list[Individual]:
    individuals = session.exec(select(Individual)).all()
    return list(individuals)

@app.get("/individual/{base}/count")
def count_individuals(book: BookAppDep) -> int:
    return book.individuals_count()
