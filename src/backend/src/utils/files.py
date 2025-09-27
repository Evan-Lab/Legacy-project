import uuid
from enum import Enum
from pathlib import Path
from typing import IO, Any, BinaryIO

from src.config import get_settings
from src.models import Base


class Format(str, Enum):
    GEDCOM = "ged"


def tmp_path(file_id: uuid.UUID, format: Format) -> Path:
    return Path(get_settings().imports.tmp_dir) / f"{file_id}.{format.value}"


class ImportedFile:
    _id: uuid.UUID
    _format: Format
    _path: Path
    _auto_delete: bool

    @property
    def id(self) -> uuid.UUID:
        return self._id

    @property
    def format(self) -> Format:
        return self._format

    @property
    def path(self) -> Path:
        return self._path

    def __init__(
        self,
        format: Format,
        id: uuid.UUID | None = None,
        path: Path | None = None,
        create_if_missing: bool = True,
    ) -> None:
        self._format = format
        self._id = id or uuid.uuid4()
        self._path = path or tmp_path(self._id, format)
        if create_if_missing:
            self.create()
        self._auto_delete = False

    def create(self) -> None:
        if not self._path.exists():
            self._path.parent.mkdir(parents=True, exist_ok=True)
            self._path.touch()

    def tmp(self, delete: bool = True) -> "ImportedFile":
        self._auto_delete = delete
        return self

    def __enter__(self) -> "ImportedFile":
        self.create()
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        if self._auto_delete:
            self.delete()

    def open(self, mode: str = "r") -> IO[Any]:
        return open(self._path, mode)

    def delete(self) -> None:
        if self._path.exists():
            self._path.unlink()
