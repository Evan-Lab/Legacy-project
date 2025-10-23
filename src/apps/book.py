from typing import Annotated

from fastapi.params import Depends
from sqlmodel import Session

from src.database import SessionDep
from src.dto.first_name import AlphabeticalFirstNameDto
from src.dto.welcome import WelcomeDto
from src.models.models import Base
from src.service.base import BaseDep
from src.service.book import BookDep, BookService


class BookApp:
    def __init__(self, session: Session, book_service: BookService, base: Base):
        self.session = session
        self.book_service = book_service
        self.base = base

    def individuals_count(self) -> int:
        return self.book_service.individuals_count()

    def welcome(self) -> WelcomeDto:
        count = self.individuals_count()
        return WelcomeDto(
            nb_persons=count,
            base=WelcomeDto.BaseDto(name=self.base.name, real_nb_persons=count, has_notes=True),
        )

    def first_name_alphabetical(self) -> AlphabeticalFirstNameDto:
        return self.book_service.first_name_alphabetical()


def get_book_app(session: SessionDep, book_service: BookDep, base: BaseDep) -> BookApp:
    return BookApp(session, book_service, base)


BookAppDep = Annotated[BookApp, Depends(get_book_app)]
