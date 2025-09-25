from pathlib import Path
from src.models.models import Individual
from .gedcom import parse_gedcom

class ParserService:
    def parse_gedcom(self, file_path: Path) -> list[Individual]:
        return parse_gedcom(file_path)
