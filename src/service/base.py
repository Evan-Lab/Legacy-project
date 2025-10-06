from typing import Annotated

from fastapi import Depends, Path
from src.database import SessionDep
from src.models import Base
from src.repo.base import BaseRepo
from src.errors import NotFoundError


class BaseService:
    def __init__(self, session):
        self.session = session
        self.repo = BaseRepo(session)

    @staticmethod
    def default(session: SessionDep, base: str = Path(...)) -> Base:
        self = BaseService(session)
        db_base = self.repo.get_by_name(base)
        if db_base is None:
            raise NotFoundError(f"Base with name {base} not found")
        return db_base

def get_bases_service(session: SessionDep) -> BaseService:
    return BaseService(session)

BaseDep = Annotated[Base, Depends(BaseService.default)]

BasesDep = Annotated[BaseService, Depends(get_bases_service)]