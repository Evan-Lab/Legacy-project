from typing import Annotated

from fastapi.params import Depends
from sqlmodel import Session

from src.database import SessionDep
from src.dto.index import IndexDto
from src.service.base import BaseService, BasesDep


class BaseApp:
    def __init__(self, session: Session, base_service: BaseService):
        self.session = session
        self.base_service = base_service

    def index(self) -> IndexDto:
        return IndexDto(
            bases=[
                IndexDto.BaseDto(slug="smith_family", label="Smith Family"),
                IndexDto.BaseDto(slug="dupont_arbre", label="Dupont"),
                IndexDto.BaseDto(slug="ivanov_tree", label="Ivanov"),
            ]
        )


def get_base_app(session: SessionDep, bases_service: BasesDep) -> BaseApp:
    return BaseApp(session, bases_service)


BaseAppDep = Annotated[BaseApp, Depends(get_base_app)]
