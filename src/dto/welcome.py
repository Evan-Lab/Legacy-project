from pydantic import BaseModel


class WelcomeDto(BaseModel):
    class BaseDto(BaseModel):
        name: str
        real_nb_persons: int
        has_notes: bool
    base: BaseDto
    nb_persons: int
