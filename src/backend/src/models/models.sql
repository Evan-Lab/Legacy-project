-- All cross-ref IDs (e.g., @I1@, @F3@). Ensures uniqueness inside a document.
CREATE TABLE xref (
  id           TEXT PRIMARY KEY,     -- e.g., '@I1@'
  record_type  TEXT NOT NULL         -- 'INDI','FAM','SOUR','OBJE','REPO','SUBM','SNOTE','HEAD','TRLR'
);

-- A GEDCOM document boundary, with HEAD/TRLR presence
CREATE TABLE document (
  doc_id       BIGSERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Link each xref to a document (most files have one doc; table supports many)
CREATE TABLE document_xref (
  doc_id       BIGINT REFERENCES document(doc_id) ON DELETE CASCADE,
  xref_id      TEXT   REFERENCES xref(id) ON DELETE CASCADE,
  PRIMARY KEY (doc_id, xref_id)
);

-- Header metadata (HEAD)
CREATE TABLE head (
  doc_id       BIGINT PRIMARY KEY REFERENCES document(doc_id) ON DELETE CASCADE,
  gedc_vers    TEXT NOT NULL,      -- GEDC.VERS (e.g., '7.0.0')
  src_name     TEXT,               -- SOUR.NAME
  src_vers     TEXT,               -- SOUR.VERS
  src_corp     TEXT,               -- SOUR.CORP
  src_data     TEXT,               -- SOUR.DATA
  src_data_date TIMESTAMPTZ,       -- SOUR.DATA.DATE [TIME]
  dest         TEXT,               -- DEST
  head_date    TIMESTAMPTZ,        -- HEAD.DATE [TIME]
  default_lang TEXT,               -- LANG
  plac_form    TEXT                -- PLAC.FORM (comma-separated list syntax preserved)
);

-- Header schema for documented extension tags (SCHMA/TAG)
CREATE TABLE head_schema_tag (
  doc_id       BIGINT REFERENCES document(doc_id) ON DELETE CASCADE,
  ext_tag      TEXT NOT NULL,      -- e.g., '_SKYPEID'
  uri          TEXT NOT NULL,      -- e.g., 'http://xmlns.com/foaf/0.1/skypeID'
  PRIMARY KEY (doc_id, ext_tag)
);

-- Identifier structure (REFN, UID, EXID)
CREATE TABLE identifier (
  id           BIGSERIAL PRIMARY KEY,
  owner_xref   TEXT NOT NULL REFERENCES xref(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,        -- 'REFN','UID','EXID'
  value        TEXT NOT NULL,
  type_text    TEXT                  -- optional TYPE text where applicable
  -- (For EXID, you can add authority, etc., if you want to model it further.)
);

-- Simple comment (COMM) vs Note (NOTE) (NOTE supports citations; COMM does not)
CREATE TABLE note (
  id           BIGSERIAL PRIMARY KEY,
  owner_xref   TEXT NOT NULL REFERENCES xref(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  mime         TEXT,
  lang         TEXT
);

-- A shared note record (SNOTE) is its own record with its own xref
CREATE TABLE s_note (
  s_note_xref  TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  mime         TEXT,
  lang         TEXT
);
-- Attach SNOTE pointers from other records
CREATE TABLE s_note_link (
  owner_xref   TEXT REFERENCES xref(id) ON DELETE CASCADE,
  s_note_xref  TEXT REFERENCES s_note(s_note_xref) ON DELETE CASCADE,
  PRIMARY KEY (owner_xref, s_note_xref)
);

-- CHANGE/CREATION dates on any record
CREATE TABLE audit_stamp (
  id           BIGSERIAL PRIMARY KEY,
  owner_xref   TEXT NOT NULL REFERENCES xref(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,            -- 'CHAN' or 'CREA'
  instant      TIMESTAMPTZ NOT NULL,     -- DATE [TIME]
  comment      TEXT                      -- COMMENT_STRUCTURE text (COMM under CHAN)
);

-- INDI record
CREATE TABLE indi (
  indi_xref    TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  sex_enum     TEXT,                -- SEX as Enum tag text (including possible extension)
  resn_list    TEXT                 -- RESN list raw (preserve order). Optional.
);

-- Personal name(s) with surname slash semantics preserved in raw form
CREATE TABLE indi_name (
  id           BIGSERIAL PRIMARY KEY,
  indi_xref    TEXT NOT NULL REFERENCES indi(indi_xref) ON DELETE CASCADE,
  raw          TEXT NOT NULL,       -- full NamePersonal string (with /.../ surname)
  preferred    BOOLEAN NOT NULL DEFAULT FALSE, -- first is preferred per RFC
  order_index  INT NOT NULL         -- stable display order (0-based)
);

-- Associations (ASSO) at the record level (you can also link at event level; see events)
CREATE TABLE association (
  id           BIGSERIAL PRIMARY KEY,
  owner_xref   TEXT NOT NULL REFERENCES xref(id) ON DELETE CASCADE, -- INDI or FAM, etc.
  target_xref  TEXT,                -- may be NULL for @VOID@
  phrase       TEXT,                -- optional PHRASE
  role_enum    TEXT NOT NULL,       -- ROLE enum value (including extension value)
  role_phrase  TEXT                 -- ROLE.PHRASE
);

-- FAM record
CREATE TABLE fam (
  fam_xref     TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  resn_list    TEXT
);

-- Partners (HUSB/WIFE) are layout hints; do not infer gender. Store both.
CREATE TABLE fam_partner (
  fam_xref     TEXT REFERENCES fam(fam_xref) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('HUSB','WIFE')),
  indi_xref    TEXT REFERENCES indi(indi_xref),
  phrase       TEXT,
  PRIMARY KEY (fam_xref, role)
);

-- Children list with birth-order preference; allow @VOID@ placeholders
CREATE TABLE fam_child (
  id           BIGSERIAL PRIMARY KEY,
  fam_xref     TEXT NOT NULL REFERENCES fam(fam_xref) ON DELETE CASCADE,
  indi_xref    TEXT,                -- NULL means @VOID@
  phrase       TEXT,
  order_index  INT NOT NULL         -- birth-order as stored (0-based)
);

-- Bi-directional links in INDI (FAMC/FAMS) with PEDI, STAT, notes
CREATE TABLE indi_family_link (
  id           BIGSERIAL PRIMARY KEY,
  indi_xref    TEXT NOT NULL REFERENCES indi(indi_xref) ON DELETE CASCADE,
  fam_xref     TEXT NOT NULL REFERENCES fam(fam_xref) ON DELETE CASCADE,
  link_type    TEXT NOT NULL CHECK (link_type IN ('FAMC','FAMS')),
  pedi_enum    TEXT,        -- PEDI enum + optional PHRASE
  pedi_phrase  TEXT,
  stat_enum    TEXT,
  stat_phrase  TEXT
);

-- Address structure (ADDR payload + structured bits; ADDR wins if disagreement)
CREATE TABLE address (
  id           BIGSERIAL PRIMARY KEY,
  owner_type   TEXT NOT NULL,       -- e.g., 'INDI','FAM','EVENT','REPO','SUBM','SOUR','SNOTE','HEAD'
  owner_id     BIGINT,              -- link to specific table row if not an xref-based owner (events)
  owner_xref   TEXT,                -- for xref-based owners
  addr         TEXT NOT NULL,       -- full formatted address payload (with line breaks)
  adr1         TEXT,
  adr2         TEXT,
  adr3         TEXT,
  city         TEXT,
  stae         TEXT,
  post         TEXT,
  ctry         TEXT
);

-- Place structure (PLAC) — store text + optional normalized pieces if desired
CREATE TABLE place (
  id           BIGSERIAL PRIMARY KEY,
  owner_type   TEXT NOT NULL,       -- typically 'EVENT' (also allowed under HEAD.PLAC for default form)
  owner_id     BIGINT NOT NULL,
  raw          TEXT,                -- as in file
  -- you can add columns for a split hierarchy if you maintain one
  -- plus map to a gazetteer table if you have one
);

-- A reusable typed value for DateValue / DateExact / Time / Age with raw preservation
CREATE TABLE chrono_value (
  id           BIGSERIAL PRIMARY KEY,
  raw_date     TEXT,         -- full GEDCOM DateValue or DateExact string (as serialized)
  raw_time     TEXT,         -- Time string (e.g., '14:03:00Z' or '14:03')
  raw_phrase   TEXT,         -- PHRASE under DATE/SDATE/Role ages
  -- Optional normalized fields (nullable):
  iso_start    TIMESTAMPTZ,  -- derived (FROM x, BET x AND y, etc.)
  iso_end      TIMESTAMPTZ,  -- derived
  calendar     TEXT          -- calendar tag (e.g., GREGORIAN / extTag)
);

-- A reusable Age container
CREATE TABLE age_value (
  id           BIGSERIAL PRIMARY KEY,
  raw_age      TEXT NOT NULL,  -- store the exact serialized Age per RFC
  phrase       TEXT
);

-- Generic event/attribute master: applies to INDI or FAM; tag holds standard or extension event/attr tag
CREATE TABLE event (
  id           BIGSERIAL PRIMARY KEY,
  owner_kind   TEXT NOT NULL CHECK (owner_kind IN ('INDI','FAM')),
  owner_xref   TEXT NOT NULL REFERENCES xref(id) ON DELETE CASCADE,
  tag          TEXT NOT NULL,      -- e.g., 'BIRT','DEAT','MARR','BAPM','RESI','FACT','NCHI', or ext tag
  type_text    TEXT,               -- TYPE (when applicable, e.g., FACT/RESI/NCHI/…)
  resn_list    TEXT,               -- RESN list
  -- Detail
  date_id      BIGINT REFERENCES chrono_value(id),
  sdate_id     BIGINT REFERENCES chrono_value(id),  -- SDATE (secondary date)
  address_id   BIGINT REFERENCES address(id),
  agnc         TEXT,
  reli         TEXT,
  caus         TEXT
);

-- Event phones/emails/fax/www (EVENT_DETAIL allows 0:M for each)
CREATE TABLE event_contact (
  id           BIGSERIAL PRIMARY KEY,
  event_id     BIGINT NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('PHON','EMAIL','FAX','WWW')),
  value        TEXT NOT NULL
);

-- Event PLACE
ALTER TABLE place
  ADD CONSTRAINT place_event_fk
  FOREIGN KEY (owner_id)
  REFERENCES event(id)
  DEFERRABLE INITIALLY DEFERRED;

-- Event participants: ASSO under event, with ROLE and PHRASE
CREATE TABLE event_association (
  id           BIGSERIAL PRIMARY KEY,
  event_id     BIGINT NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  target_xref  TEXT,         -- may be NULL for @VOID@
  phrase       TEXT,
  role_enum    TEXT NOT NULL,
  role_phrase  TEXT
);

-- Spouse ages in family events (FAMILY_EVENT_DETAIL HUSB/WIFE.AGE)
CREATE TABLE event_spouse_age (
  id           BIGSERIAL PRIMARY KEY,
  event_id     BIGINT NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  spouse_role  TEXT NOT NULL CHECK (spouse_role IN ('HUSB','WIFE')),
  age_id       BIGINT NOT NULL REFERENCES age_value(id) ON DELETE CASCADE
);

-- SOURCE record
CREATE TABLE source (
  sour_xref     TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  auth          TEXT,
  titl          TEXT,
  abbr          TEXT,
  publ          TEXT,
  text          TEXT,
  text_mime     TEXT,
  text_lang     TEXT
);

-- SOURCE.DATA (events, date period, place, agency, notes)
CREATE TABLE source_data (
  id            BIGSERIAL PRIMARY KEY,
  sour_xref     TEXT NOT NULL REFERENCES source(sour_xref) ON DELETE CASCADE,
  events_list   TEXT,                 -- EVEN <List:Enum> (store as raw list)
  date_id       BIGINT REFERENCES chrono_value(id),   -- DatePeriod via raw_date/raw_phrase
  place_id      BIGINT REFERENCES place(id),
  agnc          TEXT
);

-- REPOSITORY record
CREATE TABLE repo (
  repo_xref     TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  name          TEXT
);

-- Repository contact info
CREATE TABLE repo_contact (
  id            BIGSERIAL PRIMARY KEY,
  repo_xref     TEXT REFERENCES repo(repo_xref) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('PHON','EMAIL','FAX','WWW')),
  value         TEXT NOT NULL
);
-- Optional address for repo
CREATE TABLE repo_address_link (
  repo_xref     TEXT PRIMARY KEY REFERENCES repo(repo_xref) ON DELETE CASCADE,
  address_id    BIGINT REFERENCES address(id)
);

-- Source ↔ Repository citation (call number, etc.)
CREATE TABLE source_repo_citation (
  id            BIGSERIAL PRIMARY KEY,
  sour_xref     TEXT NOT NULL REFERENCES source(sour_xref) ON DELETE CASCADE,
  repo_xref     TEXT NOT NULL REFERENCES repo(repo_xref) ON DELETE CASCADE,
  call_number   TEXT,
  media_enum    TEXT,      -- MEDI enumeration (with optional PHRASE if needed separately)
  media_phrase  TEXT
);

-- Source citations attach to many things (events, notes, records). We normalize via a polymorphic link.
CREATE TABLE citation (
  id            BIGSERIAL PRIMARY KEY,
  owner_kind    TEXT NOT NULL,   -- 'INDI','FAM','EVENT','NOTE','OBJE','SNOTE','REPO','SOUR','SUBM'...
  owner_id      BIGINT,          -- used when owner_kind='EVENT' or other non-xref table
  owner_xref    TEXT,            -- used when owner_kind is xref-based
  sour_xref     TEXT NOT NULL REFERENCES source(sour_xref) ON DELETE CASCADE,
  page          TEXT,            -- e.g., PAGE, QUAY, DATA/EVEN...
  text          TEXT             -- TEXT under citation (if present in your chosen model)
);

-- OBJE record with grouped FILEs
CREATE TABLE obje (
  obje_xref     TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE
);

CREATE TABLE obje_file (
  id            BIGSERIAL PRIMARY KEY,
  obje_xref     TEXT NOT NULL REFERENCES obje(obje_xref) ON DELETE CASCADE,
  file_ref      TEXT NOT NULL,  -- FILE payload (path/URI)
  form          TEXT NOT NULL,  -- FORM
  medi_enum     TEXT,           -- MEDI enum
  medi_phrase   TEXT,           -- MEDI.PHRASE
  titl          TEXT            -- TITL
);

CREATE TABLE subm (
  subm_xref     TEXT PRIMARY KEY REFERENCES xref(id) ON DELETE CASCADE,
  name          TEXT,
  lang          TEXT
);

CREATE TABLE subm_contact (
  id            BIGSERIAL PRIMARY KEY,
  subm_xref     TEXT REFERENCES subm(subm_xref) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('PHON','EMAIL','FAX','WWW')),
  value         TEXT NOT NULL
);

CREATE TABLE subm_address_link (
  subm_xref     TEXT PRIMARY KEY REFERENCES subm(subm_xref) ON DELETE CASCADE,
  address_id    BIGINT REFERENCES address(id)
);
