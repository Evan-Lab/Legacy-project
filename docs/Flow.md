# GeneWeb - Use cases and OCaml → Python migration

## 📋 Overview

This document details the main use cases of GeneWeb and analyzes what the OCaml code does to facilitate the migration to Python. It does not details the HOW as it is the purpose of the project.

Based on the official repository: https://github.com/geneweb/geneweb

🎯 Objective

Provide a comprehensive functional understanding of GeneWeb OCaml through 10 essential use cases, enabling you to:

- Understand which features to implement in Python
- Identify the business logic of each OCaml module
- Define the operation flows for transposition
- Serve as specifications for migration


🔄 Features covered

Database creation, GEDCOM import/export, Search, Editing, Tree viewing, Authentication, Multilingual, Administration, Maintenance, API

---

## 🏗 UC-001 : Creation of a new genealogical database

**👤 Actors:** Administrator / Advanced user  
**🎯 Objective:** Allow creating a new empty genealogical database with its metadata

### 🔄 Main flow

1. **User request** → New database via interface
2. **Metadata input** → Name, location, language, data model
3. **Structure initialization** → Creation directories and system files
4. **Database registration** → Persistence of parameters
5. **Confirmation** → Success return to user

### 🔧 What OCaml does

- **File management:** Creation of folders/files .gwb
- **Metadata writing:** Header with base configuration
- **Language configuration:** i18n support by default
- **Permission validation:** Verification of system write rights
- **Index initialization:** Fast access structures



---

## 📥 UC-002 : GEDCOM data import

**👤 Actors:** User  
**🎯 Objective:** Import a GEDCOM file to populate an existing database

### 🔄 Main flow

1. **Database selection** → Choice of destination database
2. **File upload** → Selection of GEDCOM file (.ged)
3. **GEDCOM parsing** → Syntactic analysis of file
4. **Data validation** → Format and coherence verification
5. **Database insertion** → Creation of people and families
6. **Error management** → Report of encountered problems
7. **Index update** → Reconstruction of internal structures

### 🔧 What OCaml does

- **GEDCOM parser:** Conversion to internal objects
- **Error management:** Log of problematic lines
- **Data structures:** Update of family graphs
- **Internal identifiers:** Attribution of unique IDs
- **Coherence validation:** Verification of family links
- **Optimizations:** Reconstruction of search indexes



---

## 🔍 UC-003 : Person search

**👤 Actors:** User  
**🎯 Objective:** Search for a person and display their family relationships

### 🔄 Main flow

1. **Criteria input** → Web interface with search fields
2. **Request sending** → Transmission to server
3. **Data filtering** → Search in database
4. **Entity retrieval** → Person + family relationships
5. **Results formatting** → Preparation for display
6. **Response sending** → Transmission to front-end
7. **Display** → Presentation of results

### 🔧 What OCaml does

- **Search engine:** Efficient filtering functions
- **Optimized indexes:** Structures for fast search by name/date
- **Graph navigation:** Traversal of kinship links
- **Serialization:** Conversion to HTML/JSON for web
- **Performance management:** Results limitation, pagination



---

## ✏ UC-004 : Person editing

**👤 Actors:** Authenticated user  
**🎯 Objective:** Modify person data (personal information and family links)

### 🔄 Main flow

1. **Visualization** → Display current person file
2. **Edition mode** → Activation of modifiable fields
3. **Modification input** → New fields/values
4. **Changes sending** → Form submission
5. **OCaml validation** → Data coherence verification
6. **Database update** → Persistence of modifications
7. **Index reconstruction** → Update of search structures
8. **Confirmation** → Success return to user

### 🔧 What OCaml does

- **Business validation:** Field and date coherence verification
- **Conflict management:** Detection of concurrent modifications
- **Atomic writing:** Transactional persistence
- **Relations recalculation:** Update of trees and family links
- **History:** Traceability of modifications
- **Access controls:** User permission verification


---

## 🌳 UC-005 : Genealogical tree visualization

**👤 Actors:** User  
**🎯 Objective:** Graphically display a genealogical tree

### 🔄 Main flow

1. **Root choice** → Selection of starting person
2. **View parameterization** → Tree type (ascending/descending), depth
3. **Tree construction** → Calculation of relationships to display
4. **Limits application** → Respect of size/depth constraints
5. **View generation** → Creation of graphic representation
6. **Client sending** → Transmission of display data
7. **Graphic rendering** → Display in browser

### 🔧 What OCaml does

- **Traversal algorithms:** Recursion/iteration on family graph
- **Cycle detection:** Prevention of infinite loops (consanguineous marriages)
- **Memory optimization:** Progressive loading of data
- **Graphic rendering:** HTML/SVG generation for web display
- **Layout:** Intelligent positioning of elements
- **Performance management:** Automatic limitation according to size



---

## 📤 UC-006 : Database export

**👤 Actors:** User  
**🎯 Objective:** Export all or part of the database to standard formats (GEDCOM, etc.)

### 🔄 Main flow

1. **Data selection** → Choice of complete database or subset
2. **Format choice** → GEDCOM, JSON, CSV, etc.
3. **Extraction** → Retrieval of selected data
4. **Standard formatting** → Conversion to output format
5. **File generation** → Creation of export file
6. **Download** → Making available to user

### 🔧 What OCaml does

- **Correct serialization:** Strict respect of standard formats
- **Encoding management:** UTF-8, Latin-1 support according to format
- **Data filtering:** Exclusion of sensitive/private information
- **Memory optimization:** Export by blocks for large databases
- **File creation:** Secure temporary generation
- **Output validation:** Format compliance verification



## 🔐 UC-007 : Authentication and authorizations

**👤 Actors:** User / Administrator  
**🎯 Objective:** Manage different permission levels according to user

### 🔄 Main flow

1. **Connection** → User credentials input
2. **Verification** → Control of credentials against user database
3. **Role attribution** → Determination of access level
4. **Permission control** → Rights verification for each action
5. **Authorization/Refusal** → Resource access decision

### 🔧 What OCaml does

- **User database:** Storage of accounts and roles
- **Security middleware:** Rights verification at each request
- **Session management:** Secure cookies, expiration
- **Admin interface:** Account and permission management
- **Audit trail:** Log of user actions
- **Database securing:** Restricted access according to user


---

## 🌍 UC-008 : Multilingual management

**👤 Actors:** User / Administrator  
**🎯 Objective:** Interface and data in multiple languages

### 🔄 Main flow

1. **Language selection** → Choice of user interface language
2. **Translation loading** → Retrieval of i18n files
3. **Multilingual display** → Interface in chosen language
4. **Localized data** → Display adapted according to locale

### 🔧 What OCaml does

- **Translation structure:** Organized language files
- **UTF-8 support:** Complete management of international characters
- **Automatic fallback:** Default language if translation missing
- **Date formatting:** Adaptation according to local conventions
- **Alphabetical sorting:** Respect of classification rules by language



---

## 🔧 UC-009 : Administration and maintenance

**👤 Actors:** Administrator  
**🎯 Objective:** Maintenance operations (backup, purge, repair)

### 🔄 Main flow

1. **Operation request** → Selection of maintenance type
2. **Processing execution** → System operation launch
3. **Progress monitoring** → Real-time monitoring
4. **Results report** → Success/failure with details
5. **Log archiving** → Historical backup of operations

### 🔧 What OCaml does

- **Internal scripts:** Automated maintenance commands
- **Coherence verification:** Data integrity control
- **File management:** Locks, backups, cleanup
- **System monitoring:** Disk space surveillance, performance
- **Automatic repair:** Correction of detected errors


---

## 🔌 UC-010 : API / RPC Interface

**👤 Actors:** External application / Script  
**🎯 Objective:** Programmatic interaction via REST/RPC API

### 🔄 Main flow

1. **Request sending** → Client formulates API call
2. **Request parsing** → Server analyzes parameters
3. **Rights verification** → Authentication/permissions control
4. **Logic execution** → Requested business processing
5. **Response formatting** → JSON/XML serialization
6. **Client return** → Result transmission

### 🔧 What OCaml does

- **Serialization:** Objects ↔ JSON/XML conversion
- **Error management:** Standardized HTTP status codes
- **Securing:** Authentication, rate limiting
- **HTTP server:** CGI/FastCGI support for deployment
- **API documentation:** Automatic generation of endpoints
- **Versioning:** Backward compatibility management