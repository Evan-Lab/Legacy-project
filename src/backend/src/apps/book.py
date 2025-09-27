from typing import Annotated

from fastapi.params import Depends

from src.database import SessionDep


class BookApp:
    def __init__(self, session):
        self.session = session



def get_book_app(session: SessionDep) -> BookApp:
    return BookApp(session)


BookAppDep = Annotated[BookApp, Depends(get_book_app)]
