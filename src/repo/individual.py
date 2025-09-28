from sqlmodel import Session, select
from src.models import Base, Individual


class IndividualRepo:
    def __init__(self, session: Session, base: Base):
        self.session = session
        self.base = base

    def add_all(self, individuals: list[Individual]) -> None:
        for individual in individuals:
            individual.base = self.base
        self.session.add_all(individuals)

    def get_all_sorted_by_first_name(self) -> list[Individual]:
        statement = (
            select(Individual).where(Individual.base_id == self.base.id).order_by(Individual.name)
        )
        return list(self.session.exec(statement).all())

    def count(self) -> int:
        statement = select(Individual).where(Individual.base_id == self.base.id)
        return len(self.session.exec(statement).all())
