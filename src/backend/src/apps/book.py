from typing import Annotated

from fastapi.params import Depends
from sqlmodel import Session

from src.database import SessionDep
from src.service.book import BookDep, BookService


class BookApp:
    def __init__(self, session: Session, book_service: BookService):
        self.session = session
        self.book_service = book_service

    def individuals_count(self) -> int:
        return self.book_service.individuals_count()

def get_book_app(session: SessionDep, book_service: BookDep) -> BookApp:
    return BookApp(session, book_service)


BookAppDep = Annotated[BookApp, Depends(get_book_app)]
