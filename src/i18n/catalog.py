# src/i18n/catalog.py
import json
from pathlib import Path

_catalogs = {}

def load_catalog(lang: str) -> dict[str, str]:
    lang = lang.lower()
    if lang not in _catalogs:
        path = Path("locales") / f"{lang}.json"
        fallback = Path("locales/en.json")
        data = json.loads(path.read_text("utf-8")) if path.exists() else {}
        fallback_data = (
            json.loads(fallback.read_text("utf-8")) if fallback.exists() else {}
        )
        catalog = {**fallback_data, **data}
        _catalogs[lang] = catalog
    return _catalogs[lang]

def translate(lang: str, msgid: str) -> str:
    return load_catalog(lang).get(msgid, msgid)
