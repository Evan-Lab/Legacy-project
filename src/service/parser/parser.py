from typing import Protocol

from src.models.models import Base
from src.service.parser.gedcom import GEDCOMParser
from src.utils.files import Format, ImportedFile


class ParserService(Protocol):
    def parse(self) -> Base: ...


def get_parser(file: ImportedFile, name: str) -> ParserService:
    match file.format:
        case Format.GEDCOM:
            return GEDCOMParser(file, name)
        case _:
            raise ValueError(f"Unsupported format: {file.format}")
    return None
