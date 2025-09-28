from typing import Annotated, BinaryIO

from fastapi.params import Depends
from sqlmodel import Session

from src.config import get_settings
from src.database.database import SessionDep
from src.repo.base import BaseRepo
from src.service.parser import get_parser
from src.utils.files import Format, ImportedFile


class ImportsApp:
    settings = get_settings()

    def __init__(self, session: Session) -> None:
        self.session = session

    def _import_data(self, data: BinaryIO, name: str, format: Format):
        file = ImportedFile(format)
        with file.open("wb") as f:
            f.write(data.read())
        with file.tmp():
            parser = get_parser(file, name)
            base = parser.parse()
        base_repo = BaseRepo(self.session)
        base_repo.imports(base)
        self.session.commit()
        self.session.refresh(base)

    def import_gedcom(self, data: BinaryIO, name: str):
        self._import_data(data, name, Format.GEDCOM)

def get_imports_app(session: SessionDep) -> ImportsApp:
    return ImportsApp(session)

ImportsAppDep = Annotated[ImportsApp, Depends(get_imports_app)]
