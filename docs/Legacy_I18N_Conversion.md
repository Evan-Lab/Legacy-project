# Legacy Translation Conversion

The legacy GeneWeb dictionary files in `legacy/geneweb/hd/lang/*.txt` use a custom block
structure (`msgid` lines preceded by four spaces, followed by `lang: value` pairs). The
`tools/legacy_i18n_converter.py` utility flattens those files into per-language JSON
catalogs that are easier to consume from modern i18n tooling (Jinja, gettext wrappers,
front-end bundles, etc.).

## Usage

```bash
python tools/legacy_i18n_converter.py \
  --input-dir legacy/geneweb/hd/lang \
  --output-dir locales \
  --skip-empty \
  --verbose
```

- `--skip-empty` keeps missing translations out of the generated catalogs.
- `--include` lets you restrict the conversion to specific files (e.g. `lexicon.txt`).
- `--indent` controls JSON formatting (`-1` writes compact JSON).
- `--verbose` reports collisions when the same `msgid` has diverging translations across files.

The command above produces one JSON file per language (e.g. `locales/fr.json`) where
each entry is keyed by the original English `msgid`. This mirrors the gettext workflow;
Jinja templates can call `gettext("you must first merge")` and fall back to the `msgid`
if a translation is not available.

## Wiring with Jinja

```python
from contextvars import ContextVar
from fastapi.templating import Jinja2Templates
from src.i18n.catalog import translate

templates = Jinja2Templates(directory="templates")
_current_lang = ContextVar("_current_lang", default="en")

templates.env.add_extension("jinja2.ext.i18n")
templates.env.install_gettext_callables(
    lambda msgid: translate(_current_lang.get(), msgid),
    lambda singular, plural, n: translate(_current_lang.get(), singular if n == 1 else plural),
)

def render(request, template_name, context):
    lang = context.get("lang", "en")
    _current_lang.set(lang)
    return templates.TemplateResponse(template_name, context)
```

With this setup both `{{ _("you must first merge") }}` and `{% trans %}` blocks use the
JSON catalogs; each request sets `_current_lang` from the negotiated language before
rendering.

## Next Steps

1. Provide missing translations in the `missing-*.txt` files to reduce fallbacks.
2. Consider enforcing placeholder numbering (e.g. `%1$s`) before importing into other
   i18n systems that expect positional arguments.
3. Wire the converter into your build or release pipeline so catalogs stay in sync with
   the legacy source files.
