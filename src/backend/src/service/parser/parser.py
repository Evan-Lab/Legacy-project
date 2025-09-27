from typing import Protocol

from src.models.models import Base
from src.utils.files import ImportedFile


class ParserService(Protocol):
    def parse(self) -> Base: ...


def get_parser(file: ImportedFile, name: str) -> ParserService:
    match file.format:
        case "ged":
            from src.service.parser.gedcom import GEDCOMParser

            return GEDCOMParser(file, name)
        case _:
            raise ValueError(f"Unsupported format: {file.format}")
    return None
