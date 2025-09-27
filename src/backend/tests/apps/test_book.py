from src.models import Base, Individual
from src.service.book import BookService
from src.apps.book import BookApp


def test_book_app_individuals_count_reflects_database_changes(session):
    base = Base(name="dynasty")
    session.add(base)
    session.commit()
    session.refresh(base)

    book_app = BookApp(session, BookService(session, base))

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

    book_app = BookApp(session, BookService(session, target))

    assert book_app.individuals_count() == 1
