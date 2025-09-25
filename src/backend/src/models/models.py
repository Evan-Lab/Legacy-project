from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum

from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import Enum as SAEnum
from sqlmodel import Field, SQLModel


class PartnerRole(str, Enum):
    HUSB = "HUSB"
    WIFE = "WIFE"

class Individual(SQLModel, table=True):
    __tablename__ = "individual" # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    name: str | None = Field(default=None, nullable=True)
    given_name: str | None = Field(default=None, nullable=True)
    surname: str | None = Field(default=None, nullable=True)
