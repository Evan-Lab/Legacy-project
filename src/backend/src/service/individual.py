from sqlmodel import Session, select

from src.models import Individual


class IndividualService:
    def __init__(self, session: Session):
        self.session = session

    def create_bulk_individuals(self, individuals: list[Individual]) -> None:
        self.session.add_all(individuals)
        self.session.commit()

    def create_individual(self, individual: Individual) -> Individual:
        self.session.add(individual)
        self.session.commit()
        self.session.refresh(individual)
        return individual

    def get_individual(self, individual_id: int) -> Individual | None:
        return self.session.get(Individual, individual_id)

    def update_individual(self, individual: Individual) -> Individual:
        self.session.merge(individual)
        self.session.commit()
        return individual

    def delete_individual(self, individual: Individual) -> None:
        self.session.delete(individual)
        self.session.commit()

    def list_individuals(self) -> list[Individual]:
        return list(self.session.exec(select(Individual)).all())
