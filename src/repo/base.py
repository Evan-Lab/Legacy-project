from sqlmodel import Session, or_, select
from src.errors import ConflictError
from src.models import Base


class BaseRepo:
    def __init__(self, session: Session):
        self.session = session

    def exist(self, base: Base) -> bool:
        statement = select(Base).where(or_(Base.id == base.id, Base.name == base.name))
        return self.session.exec(statement).one_or_none() is not None

    def imports(self, base: Base) -> None:
        if self.exist(base):
            raise ConflictError(f"Base with name {base.name} already exists")
        self.session.add_all(base.individuals)
        self.session.add(base)

    def get(self, base_id: int) -> Base | None:
        return self.session.get_one(Base, base_id)

    def get_by_name(self, name: str) -> Base | None:
        statement = select(Base).where(Base.name == name)
        return self.session.exec(statement).one_or_none()

    def get_all(self) -> list[Base]:
        statement = select(Base)
        return list(self.session.exec(statement).all())
