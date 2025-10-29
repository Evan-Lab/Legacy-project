#!/usr/bin/env python3
"""
Utility to convert the legacy GeneWeb translation text files into
per-language JSON catalogs that are easier to consume from modern i18n tooling
(e.g. Jinja environments with gettext-style lookups).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Set, Tuple

LANG_CODE_PATTERN = re.compile(r"^[a-z]{2}(?:[-_][a-z0-9]+)?$")


@dataclass
class Entry:
    """One logical message extracted from a legacy `.txt` translation file."""

    msgid: str
    translations: Dict[str, str]
    source_file: Path
    source_line: int


def is_language_line(line: str) -> bool:
    """Return True when the line looks like `xx: value`."""
    stripped = line.lstrip()
    if ":" not in stripped:
        return False
    prefix, _ = stripped.split(":", 1)
    prefix = prefix.strip()
    if not prefix:
        return False
    # Accept language tags like `pt-br` or `zh`.
    if prefix != prefix.lower():
        return False
    return LANG_CODE_PATTERN.fullmatch(prefix) is not None


def parse_translation_file(path: Path) -> Iterator[Entry]:
    """
    Yield `Entry` objects for a legacy translation file.

    File format recap:
        - Blocks are separated by blank lines.
        - A block starts with an indented identifier line (the "message id").
        - The following lines contain translations in the form `lang: value`.
    """
    with path.open("r", encoding="utf-8") as handle:
        msgid: Optional[str] = None
        msg_line: Optional[int] = None
        translations: Dict[str, str] = {}

        def flush():
            nonlocal msgid, msg_line, translations
            if msgid is None and translations:
                raise ValueError(
                    f"Encountered translations without msgid in {path}"
                )
            if msgid:
                yield_entry = Entry(
                    msgid=msgid,
                    translations=translations,
                    source_file=path,
                    source_line=msg_line or 0,
                )
                yield yield_entry
            msgid = None
            msg_line = None
            translations = {}

        for lineno, raw_line in enumerate(handle, 1):
            line = raw_line.rstrip("\n")
            if not line.strip():
                if msgid or translations:
                    yield from flush()
                continue

            if is_language_line(line):
                if msgid is None:
                    raise ValueError(
                        f"Found language line before msgid "
                        f"in {path}:{lineno}: {line}"
                    )
                stripped = line.lstrip()
                lang_code, value = stripped.split(":", 1)
                translations[lang_code.strip().lower()] = value.lstrip()
                continue

            # Starting a new msgid; flush the previous block first.
            if msgid or translations:
                yield from flush()

            msgid = line.strip()
            msg_line = lineno

        if msgid or translations:
            yield from flush()


def collect_entries(files: Iterable[Path]) -> List[Entry]:
    entries: List[Entry] = []
    for path in files:
        entries.extend(parse_translation_file(path))
    return entries


def build_catalog(
    entries: Iterable[Entry], skip_empty: bool
) -> Tuple[Dict[str, Dict[str, str]], List[Tuple[str, str, str, str, Path, int]]]:
    catalog: Dict[str, Dict[str, str]] = {}
    conflicts: List[Tuple[str, str, str, str, Path, int]] = []

    for entry in entries:
        bucket = catalog.setdefault(entry.msgid, {})
        for lang, value in entry.translations.items():
            if skip_empty and not value:
                continue
            previous = bucket.get(lang)
            if previous and previous != value:
                conflicts.append(
                    (
                        entry.msgid,
                        lang,
                        previous,
                        value,
                        entry.source_file,
                        entry.source_line,
                    )
                )
                continue
            bucket[lang] = value
    return catalog, conflicts


def export_json_catalogs(
    catalog: Dict[str, Dict[str, str]],
    output_dir: Path,
    indent: int,
    include_empty: bool,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    languages: Set[str] = {
        lang for translations in catalog.values() for lang in translations
    }

    for lang in sorted(languages):
        lang_entries = {
            msgid: translations.get(lang, "")
            for msgid, translations in catalog.items()
            if include_empty or translations.get(lang)
        }
        if not lang_entries:
            continue
        target = output_dir / f"{lang}.json"
        with target.open("w", encoding="utf-8") as out:
            json.dump(
                lang_entries,
                out,
                ensure_ascii=False,
                sort_keys=True,
                indent=indent if indent >= 0 else None,
            )


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Convert legacy GeneWeb translation text files into per-language "
            "JSON catalogs"
        )
    )
    parser.add_argument(
        "--input-dir",
        default="legacy/geneweb/hd/lang",
        help="Directory containing the legacy *.txt translation files.",
    )
    parser.add_argument(
        "--output-dir",
        default="locales",
        help="Destination directory for the generated catalogs.",
    )
    parser.add_argument(
        "--include",
        nargs="*",
        default=None,
        help=(
            "Optional list of file basenames (within input-dir) to process. "
            "Defaults to all *.txt files."
        ),
    )
    parser.add_argument(
        "--skip-empty",
        action="store_true",
        help="Ignore empty translations when building the catalog.",
    )
    parser.add_argument(
        "--indent",
        type=int,
        default=2,
        help="Indentation to use for generated JSON (set to -1 for compact).",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print diagnostics such as conflicts to stderr.",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)

    input_dir = Path(args.input_dir)
    if not input_dir.is_dir():
        print(f"[error] input directory missing: {input_dir}", file=sys.stderr)
        return 1

    if args.include:
        files = [input_dir / name for name in args.include]
    else:
        files = sorted(input_dir.glob("*.txt"))

    files = [path for path in files if path.exists()]
    if not files:
        print("[error] no translation files found", file=sys.stderr)
        return 1

    entries = collect_entries(files)

    catalog, conflicts = build_catalog(entries, skip_empty=args.skip_empty)

    if conflicts and args.verbose:
        for msgid, lang, old, new, path, line in conflicts:
            print(
                f"[warn] conflict for {lang} in {path}:{line}: "
                f"{msgid!r} -> {old!r} / {new!r}",
                file=sys.stderr,
            )

    export_json_catalogs(
        catalog=catalog,
        output_dir=Path(args.output_dir),
        indent=args.indent,
        include_empty=not args.skip_empty,
    )

    if args.verbose:
        total_msgs = len(catalog)
        langs = sorted(
            {lang for translations in catalog.values() for lang in translations}
        )
        print(
            f"[info] exported {total_msgs} messages for {len(langs)} languages "
            f"to {args.output_dir}",
            file=sys.stderr,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
