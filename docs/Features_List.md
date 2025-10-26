## List of all fonctionalities on the project LEGACY

## GeneWeb LegacyImportant Fonctionnalities
## Executive Summary

This document presents a comprehensive fonctionnalities audit of the GeneWeb repository, analyzing the important features of the legacy OCaml codebase (1995-2008).
---

## 1. Navigation and access
- Access via an integrated web server.
- Home page by genealogical database.
- Common navigation bar with:
  - Quick search.
  - Access to trees (ancestry, descendants, cousins).
  - Alphabetical indexes.
  - Location pages.
  - Birthdays.
  - Statistics.
  - Notes and media.
  - Administration section (depending on role).
- Integrated language selector.

---

## 2. Search and index
- Simple search by first name, surname, alias or SOSA number.
- Advanced search with multiple criteria (dates, places, events, notes).
- Auto-complete and search tolerant of spelling variations.
- Alphabetical indexes of surnames and first names.
- Results presented in sortable and filterable tables.

---

## 3. Person and Family Records
### Person
- Identity information (surnames, first names, aliases, gender).
- Personal events (birth, baptism, death, burial, etc.).
- Associated notes and sources.
- Related media (images, documents).
- Navigation links to parents, spouses, children and siblings.

### Family
- Information about the couple or union.
- List of children with links to their records.
- Family events (marriage, divorce, contract, etc.).
- Notes and sources at the household level.

---



## 4. Trees and graphical representations
- **Ancestry**: family tree of ancestors.
- **Descendants**: tree of descendants.
- **Cousins**: representation of common cousins.
- **DAG** (Directed Acyclic Graph): clickable relational graph.
- **Fan chart**: circular fan-shaped tree.
- Controls: generation depth, father/mother inversion, display options, zoom, HTML/SVG export.

---

## 5. Places and sources
- Hierarchical pages for places (countries, regions, cities).
- Filters to find people or events related to a place.
- Management and display of related sources and files.

---

## 6. Notes and editorial content
- Global notes and notes related to individuals or families.
- Wikitext-type syntax with internal links.
- Ability to add images or rich content.
- Notes organised into indexed auxiliary pages.

---

## 7. Statistics and anniversaries
- Lists of today's or upcoming anniversaries (births, marriages, deaths).
- General statistics:
  - Male/female distribution.
  - Oldest individuals.
  - Recent events.
  - Basic size and growth indicators.

---

## 8. History, differences and checks
- History of changes.
- Comparison between two versions (diff).
- Consistency checks (impossible dates, duplicates, inconsistencies).
- Automatic repair or correction tools.

---


## 9. Merging and managing duplicates
- Merge interfaces for individuals and families.
- Data presented in comparative columns.
- Field-by-field selection via radio buttons.
- Confirm, cancel and preview buttons.

---

## 10. Import, export and backup
- Import GEDCOM files to an internal database.
- Export a database to GEDCOM (standard 5.5.1).
- Export a database in `.gw` text format.
- Data backup and restore tools.

---

## 11. Role management and security
- **Visitor** role: basic read access.
- **Friend** role: extended access to certain data.
- **Wizard** role: full access, data editing and management.
- Authentication via user file and passwords.
- Filtering of HTML tags allowed in notes.
- HTTP authorisation management.

---

## 12. Administration and configuration
- Installation and configuration portal (setup).
- Management of available databases, creation, deletion.
- Server configuration (port, addresses, paths).
- Activation and management of plugins.
- Can be run in CGI or Windows service mode.
- Multi-platform (Unix/Linux, Windows, macOS).


---

## 13. Command line utilities and tools
- **gwd**: web server.
- **gwsetup**: configuration interface.
- **gwc**: database creation from an export.
- **ged2gwb**: GEDCOM import.
- **gwb2ged**: GEDCOM export.
- **gwu**: export to `.gw` format.
- **gwdiff**: database comparison.
- **fixbase**: consistency checking and correction.
- **update_nldb**: note index update.
- **consang** / **connex**: consanguinity and connectedness calculations.

---