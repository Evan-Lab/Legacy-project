from typing import Annotated

from fastapi import Depends
from sqlalchemy import Engine
from sqlmodel import Session, SQLModel, create_engine
from src.config import get_settings

engine: Engine


def init_db(migrate: bool = True):
    global engine
    settings = get_settings()

    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.database.url, connect_args=connect_args)

    if migrate:
        create_db_and_tables()


def create_db_and_tables():
    import src.models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
