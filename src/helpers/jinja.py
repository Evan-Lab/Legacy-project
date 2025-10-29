import hashlib
from templates.templates import templates
from urllib.parse import quote
import random

print("Registering Jinja2 template globals from src/helpers/jinja.py")

def nth(text: str, index: int, sep: str = "/"):
    index = int(index) - 1
    parts = text.split(sep)
    print(f"nth: text='{text}', index={index}, sep='{sep}' -> parts={parts}")
    try:
        return parts[index]
    except IndexError:
        return ""  # or None, depending on your preference
templates.env.globals.update(
    nth=nth,
)

# Minimal i18n + asset hash helpers for templates using _() and hash()
def _noop_translate(s: str, **kwargs) -> str:
    return s
templates.env.globals.update(
    _=_noop_translate,
)

def asset_hash(value) -> str:
    # Stable short hash for cache-busting query params
    data = str(value).encode("utf-8")
    return hashlib.md5(data).hexdigest()[:8]
templates.env.globals.update(
    hash=asset_hash,
)

class RandomHelper:
    def __init__(self):
        self.counter = 0

    @property
    def init(self):
        pass

    def __getitem__(self, key):
        key = int(key)
        return random.randint(0, key - 1) if key > 0 else 0

    def __call__(self, key):
        return self[key]

templates.env.globals.update(
    random=RandomHelper(),
)

def uri_encode(value: str) -> str:
    return quote(value)
templates.env.globals.update(
    uri_encode=uri_encode,
)

class UrlSet:
    def __init__(self):
        self.urls = {}

    def __getattribute__(self, name: str) -> str:
        return ""
templates.env.globals.update(
    url_set=UrlSet(),
)