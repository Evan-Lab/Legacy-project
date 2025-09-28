from functools import lru_cache
from typing import Annotated

from fastapi import Depends
from pydantic import BaseModel, Field
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)

class ImportsSettings(BaseModel):
    tmp_dir: str = "/tmp"

class DatabaseSettings(BaseModel):
    url: str = "sqlite:///database.db"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_nested_delimiter="__",
        case_sensitive=True,
    )

    app_name: str = "LegacyProject"
    debug: bool = False
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    imports: ImportsSettings = Field(default_factory=ImportsSettings)



@lru_cache
def get_settings() -> Settings:
    return Settings()


SettingsDep = Annotated[Settings, Depends(get_settings)]
