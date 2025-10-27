from typing import Annotated

from fastapi import Depends, Path
from src.database import SessionDep
from src.dto.index import IndexDto
from src.models import Base
from src.repo.base import BaseRepo
from src.errors import NotFoundError
from urllib.parse import quote


class BaseService:
    def __init__(self, session):
        self.session = session
        self.repo = BaseRepo(session)

    def get_bases_list(self) -> list[IndexDto.BaseDto]:
        bases = self.repo.get_all()
        return [IndexDto.BaseDto(slug=quote(base.name), label=base.name) for base in bases]
    
    def count_persons(self, base: Base) -> int:
        return self.repo.count_persons(base)

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