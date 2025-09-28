from pathlib import Path
from gedcom.parser import Parser
from gedcom.element.individual import IndividualElement

from src.models import Base, Individual
from src.utils.files import ImportedFile



class GEDCOMParser:
    def __init__(self, file: ImportedFile, name: str) -> None:
        self.file = file
        self.parser = Parser()
        self.base = Base(name=name)

    def parse_individual(self, elem: IndividualElement) -> None:
        name, surname = elem.get_name()
        is_individual = elem.is_individual()
        if not is_individual:
            print(f"wtf {name} {surname} is not individual")
            return
        individual = Individual(name=name, surname=surname)
        self.base.individuals.append(individual)

    def parse(self) -> Base:
        self.parser.parse_file(self.file.path)
        for elem in self.parser.get_element_list():
            if isinstance(elem, IndividualElement):
                self.parse_individual(elem)
        return self.base
