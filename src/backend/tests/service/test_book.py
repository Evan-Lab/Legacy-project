from src.models import Base, Individual
from src.service.book import BookService


def test_individuals_count_returns_number_of_individuals(session):
    base = Base(name="family")
    base.individuals = [
        Individual(name="Alice"),
        Individual(name="Bob"),
    ]
    session.add(base)
    session.commit()
    session.refresh(base)

    service = BookService(session, base)

    assert service.individuals_count() == 2


def test_individuals_count_handles_empty_base(session):
    base = Base(name="empty")
    session.add(base)
    session.commit()
    session.refresh(base)

    service = BookService(session, base)

    assert service.individuals_count() == 0


def test_individuals_count_is_scoped_to_base(session):
    base = Base(name="target")
    base.individuals = [Individual(name="Target")]
    other_base = Base(name="other")
    other_base.individuals = [Individual(name="Other")]

    session.add(base)
    session.add(other_base)
    session.commit()
    session.refresh(base)

    service = BookService(session, base)

    assert service.individuals_count() == 1
