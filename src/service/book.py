from typing import Annotated

from fastapi import Depends
from sqlmodel import Session
from src.database.database import SessionDep
from src.models.models import Base
from src.repo.individual import IndividualRepo
from src.service.base import BaseDep
from src.dto.first_name import AlphabeticalFirstNameDto, FirstNameDto


class BookService:
    def __init__(self, session: Session, base: Base):
        self.session = session
        self.base = base
        self.individual_repo = IndividualRepo(self.session, self.base)

    def individuals_count(self) -> int:
        return self.individual_repo.count()

    def first_name_alphabetical(self) -> AlphabeticalFirstNameDto:
        individuals = self.individual_repo.get_all_sorted_by_first_name()
        total = len(individuals)
        grouped = {}
        for individual in individuals:
            first_letter = individual.name[0].upper() if individual.name else "others"
            if first_letter not in grouped:
                grouped[first_letter] = []
            grouped[first_letter].append(FirstNameDto(name=individual.name or ""))
        return AlphabeticalFirstNameDto(total=total, **grouped)


def get_book_service(session: SessionDep, base: BaseDep) -> BookService:
    return BookService(session, base)

BookDep = Annotated[BookService, Depends(get_book_service)]
