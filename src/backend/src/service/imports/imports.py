import uuid

from typing import BinaryIO

from src.config import get_settings
from pathlib import Path
from enum import Enum

class Format(str, Enum):
    GEDCOM = "ged"


class ImportsService:
    settings = get_settings()

    def __init__(self) -> None:
        pass

    def _tmp_path(self, file_id: uuid.UUID, format: Format) -> Path:
        return Path(self.settings.imports.tmp_dir) / f"{file_id}.{format.value}"

    def import_gedcom(self, file: BinaryIO) -> Path:
        file_id = uuid.uuid4()
        tmp_path = self._tmp_path(file_id, Format.GEDCOM)
        with open(tmp_path, "wb") as f:
            f.write(file.read())
        return tmp_path
