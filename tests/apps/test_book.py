from src.dto.first_name import FirstNameDto
from src.models import Base, Individual
from src.service.book import BookService
from src.apps.book import BookApp


def test_book_app_individuals_count_reflects_database_changes(session):
    base = Base(name="dynasty")
    session.add(base)
    session.commit()
    session.refresh(base)

    book_app = BookApp(session, BookService(session, base), base)

    assert book_app.individuals_count() == 0

    session.add(Individual(name="Alice", base=base))
    session.commit()

    assert book_app.individuals_count() == 1


def test_book_app_individuals_count_scoped_by_base(session):
    target = Base(name="target")
    target.individuals = [Individual(name="Target")]
    other = Base(name="other")
    other.individuals = [Individual(name="Other")]

    session.add(target)
    session.add(other)
    session.commit()
    session.refresh(target)

    book_app = BookApp(session, BookService(session, target), target)

    assert book_app.individuals_count() == 1


def test_book_app_first_name_alphabetical_groups_and_sorts_names(session):
    base = Base(name="grouped")
    base.individuals = [
        Individual(name="alice"),
        Individual(name="Aaron"),
        Individual(name="bob"),
        Individual(name="Charlie"),
        Individual(name="carol"),
    ]
    session.add(base)
    session.commit()
    session.refresh(base)

    app = BookApp(session, BookService(session, base), base)

    result = app.first_name_alphabetical()

    assert result.total == 5
    assert [FirstNameDto(name="Aaron"), FirstNameDto(name="alice")] == result.A
    assert [FirstNameDto(name="bob")] == result.B
    assert [FirstNameDto(name="Charlie"), FirstNameDto(name="carol")] == result.C
