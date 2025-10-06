from pydantic import BaseModel


class RedirectDto(BaseModel):
    """Data for redirect page"""
    link: str


class MovedDto(BaseModel):
    """Data for moved database page"""
    bname: str
    moved: str


class RenamedDto(BaseModel):
    """Data for renamed database page"""
    old: str
    new: str
    link: str
