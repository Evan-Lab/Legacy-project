from enum import Enum

from sqlmodel import Field, Relationship, SQLModel


class PartnerRole(str, Enum):
    HUSB = "HUSB"
    WIFE = "WIFE"


class Base(SQLModel, table=True):
    __tablename__ = "base"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(nullable=False, unique=True, index=True)

    individuals: list['Individual'] = Relationship(back_populates="base")


class Individual(SQLModel, table=True):
    __tablename__ = "individual"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    base_id: int | None = Field(default=None, foreign_key="base.id", nullable=False)
    base: Base | None = Relationship(back_populates="individuals")
    name: str | None = Field(default=None, nullable=True)
    given_name: str | None = Field(default=None, nullable=True)
    surname: str | None = Field(default=None, nullable=True)
