from typing import Annotated

from fastapi import Depends
from src.database.database import SessionDep
from src.models.models import Base
from src.repo.individual import IndividualRepo
from src.service.base import BaseDep


class BookService:
    def __init__(self, session: SessionDep, base: Base):
        self.session = session
        self.base = base
        self.individual_repo = IndividualRepo(self.session, self.base)

    def individuals_count(self) -> int:
        return self.individual_repo.count()


def get_book_service(session: SessionDep, base: BaseDep) -> BookService:
    return BookService(session, base)

BookDep = Annotated[BookService, Depends(get_book_service)]
