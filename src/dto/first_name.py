from pydantic import BaseModel

class FirstNameDto(BaseModel):
    name: str
    link: str | None = None

class AlphabeticalFirstNameDto(BaseModel):
    total: int
    A: list[FirstNameDto] = []
    B: list[FirstNameDto] = []
    C: list[FirstNameDto] = []
    D: list[FirstNameDto] = []
    E: list[FirstNameDto] = []
    F: list[FirstNameDto] = []
    G: list[FirstNameDto] = []
    H: list[FirstNameDto] = []
    I: list[FirstNameDto] = []  # noqa: E741
    J: list[FirstNameDto] = []
    K: list[FirstNameDto] = []
    L: list[FirstNameDto] = []
    M: list[FirstNameDto] = []
    N: list[FirstNameDto] = []
    O: list[FirstNameDto] = []  # noqa: E741
    P: list[FirstNameDto] = []
    Q: list[FirstNameDto] = []
    R: list[FirstNameDto] = []
    S: list[FirstNameDto] = []
    T: list[FirstNameDto] = []
    U: list[FirstNameDto] = []
    V: list[FirstNameDto] = []
    W: list[FirstNameDto] = []
    X: list[FirstNameDto] = []
    Y: list[FirstNameDto] = []
    Z: list[FirstNameDto] = []
    others: list[FirstNameDto] = []
