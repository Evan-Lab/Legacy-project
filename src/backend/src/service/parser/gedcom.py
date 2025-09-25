from pathlib import Path
from gedcom.parser import Parser
from gedcom.element.individual import IndividualElement

from src.models import Individual

def parse_gedcom(path: Path) -> list[Individual]:
    parser = Parser()

    parser.parse_file(path)

    e = parser.get_element_list()

    individuals: list[Individual] = []

    for elem in e:
        if isinstance(elem, IndividualElement):
            name, surname = elem.get_name()
            is_individual = elem.is_individual()
            if not is_individual:
                print(f"wtf {name} {surname} is not individual")
                continue
            individual = Individual(name=name, surname=surname)
            individuals.append(individual)

    return individuals
