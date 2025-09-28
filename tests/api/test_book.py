from http import HTTPStatus

from src.models import Base, Individual


def test_list_individuals_returns_all_records_despite_base_path(session, client):
    base = Base(name="alpha")
    base.individuals = [Individual(name="Alice"), Individual(name="Bob")]
    other = Base(name="beta")
    other.individuals = [Individual(name="Charlie")]

    session.add(base)
    session.add(other)
    session.commit()

    response = client.get("/individuals/alpha")

    assert response.status_code == HTTPStatus.OK
    payload = response.json()
    assert len(payload) == 3
    returned_names = {item["name"] for item in payload}
    assert returned_names == {"Alice", "Bob", "Charlie"}


def test_count_individuals_returns_base_specific_count(session, client):
    base = Base(name="gamma")
    base.individuals = [Individual(name="Alice"), Individual(name="Bob")]
    session.add(base)
    session.commit()
    session.refresh(base)

    response = client.get(f"/individual/{base.name}/count")

    assert response.status_code == HTTPStatus.OK
    assert response.json() == len(base.individuals)


def test_count_individuals_missing_base_returns_404(client):
    response = client.get("/individual/unknown/count")

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()["detail"] == "Base with name unknown not found"
