from pydantic import BaseModel


class IndexDto(BaseModel):
    class BaseDto(BaseModel):
        slug: str
        label: str
    bases: list[BaseDto]
