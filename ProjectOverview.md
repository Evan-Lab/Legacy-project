# AWKWARD LEGACY
**Legacy Code Modernization & Genealogy Heir Discovery System**

---

## Project Overview

**Client:** CoinLegacy Inc.  
**Mission:** Modernize legacy OCaml genealogy software (1995-2008) to Python while preserving critical heir identification functionality  
**Value Proposition:** Uncover rightful heirs of powerful lineages and generate revenue through genealogical consulting services

### The Challenge
CoinLegacy Inc. has acquired ancient code from a genealogy software suite that could be worth its weight in gold. This legacy system, based on the renowned **GeneWeb** OCaml software by Daniel de Rauglaudre, contains sophisticated algorithms for:
- Calculating complex family relationships and inheritance rights
- Processing genealogical databases with unlimited individuals
- Identifying rightful heirs through consanguinity rate calculations
- Managing noble titles and inheritance precedence rules

**⚠️ CRITICAL REQUIREMENT:** This is a piece of history that must be restored without altering its core functionality, or risk the collapse of the entire infrastructure.

---

## Project Architecture

```
AWKWARD LEGACY/
├── 📁 legacy-source/           # Original OCaml GeneWeb codebase
├── 📁 tests/                   # Comprehensive testing suites
├── 📁 docs/                    # Project documentation
│   ├── EndToEnd_TestPlan.md    # E2E Test Plan
│   ├── Accessibility.md        # Accessibility Implementation
│   └── Security.md             # Security Implementation
|   └── Unit_TestPlan.md        # Unit Test Plan 
├── 📁 deployment/              # Infrastructure and deployment configs
├── 📁 security/                # Security audits and compliance
└── README.md                   # This file
```

---

## Core Functionality

### Genealogy Processing Engine
- **Data Import:** Support for GW format and GEDCOM files from legacy systems
- **Relationship Calculator:** Advanced algorithms for determining family connections
- **Consanguinity Analysis:** Precise calculation of inbreeding coefficients for inheritance law
- **Heir Identification:** Automated discovery of rightful heirs with legal precedence ranking

### Web Interface
- **Interactive Family Trees:** Navigate complex genealogical relationships
- **Search & Filter:** Find individuals across historical databases
- **Report Generation:** Professional heir identification documentation
- **Security Controls:** Multi-level access for "friends" and "wizards"

---

## Quality Assurance Framework

This project follows rigorous quality standards to ensure the historical value and functionality of the genealogical data is preserved throughout modernization.

### 🧪 Testing Strategy
Comprehensive validation ensures Python implementation matches OCaml baseline results exactly.

**📖 [Complete End-to-End Test Plan →](docs/EndToEnd_TestPlan.md)**

Our end-to-end testing strategy validates complete workflows:

- **Complete Genealogy Data Processing**: Full import, processing, and heir identification workflow
- **Complex Inheritance Resolution**: Multi-generational noble lineages and adoption scenarios
- **Data Format Compatibility**: GW format and GEDCOM import/export functionality
- **Performance Benchmarks**: Processing times for databases up to 10K+ individuals
- **Security Compliance**: GDPR validation and access control verification

**📖 [Complete Unit Test Plan →](docs/Unit_TestPlan.md)**

Our unit testing strategy covers critical OCaml modules to ensure functional parity:

- **Wiki Module**: Link parsing and bold/italic syntax conversion validation
- **Util Module**: String utilities, UTF-8 handling, and HTML/translation functions
- **Place Module**: Geographic location formatting and normalization
- **Calendar Module**: Date conversions across different calendar systems
- **SOSA Module**: Genealogical numbering system validation
- **Merge Module**: Ancestor-descendant relationship verification

## **Key testing coverage**:
- **Unit Testing:** Individual module validation with automated logging
- **Integration Testing:** System component interaction verification
- **Performance Testing:** Database processing under load (up to 10K+ individuals)
- **Security Testing:** Data protection and access control validation
- **Regression Testing:** Continuous validation against OCaml baseline results

### ♿ Accessibility Compliance
Full WCAG 2.1 AA compliance ensures the software is accessible to all users, including those with visual impairments.

**📖 [Accessibility Implementation Guide →](docs/Accessibilitymd)**

Accessibility features:
- **Keyboard Navigation:** Full interface accessibility without mouse dependency
- **High Contrast:** WCAG AA color contrast compliance (4.5:1 minimum)
- **Alternative Formats:** Multiple output formats for diverse user needs

### 📋 Documentation & Standards
Rigorous documentation standards ensure project maintainability and compliance.

**📖 [Documentation Standards & Coding Conventions →](docs/Standards_Covention.md)**

Standards coverage:
- **Code Documentation:** Comprehensive inline and API documentation
- **Version Control:** Git workflow and commit conventions


---

## Technology Stack

### Legacy System (Baseline)
- **Language:** OCaml
- **Core Engine:** GeneWeb genealogy software
- **Data Formats:** Native .gw format, GEDCOM compatibility
- **Features:** Relationship calculator, consanguinity analysis, web interface

### Modern Implementation (Target)
- **Language:** Python 3.8+
- **Database:** PostgreSQL for genealogical data storage
- **Testing:**: pytest, cypress, accessibility testing tools
- **Deployment:** Docker containers, CI/CD pipeline


## Success Metrics

### Technical Excellence
- ✅ **Functional Parity:** All OCaml features preserved in Python implementation
- ✅ **Data Integrity:** Zero loss of genealogical information during conversion
- ✅ **Performance Standards:** Processing times meet or exceed legacy system benchmarks
- ✅ **Security Compliance:** Full GDPR compliance and vulnerability mitigation

---

## Risk Management

### Critical Risks & Mitigation
- **🚨 Data Loss Risk:** Comprehensive backup strategy and parallel OCaml validation
- **⚠️ Calculation Errors:** Continuous baseline comparison during development
- **🔒 Security Vulnerabilities:** Regular security audits and penetration testing
- **📉 Performance Degradation:** Load testing with incrementally larger datasets

### Rollback Strategy
Original OCaml system maintained as fallback with complete restoration procedures documented.

---

## Team & Responsibilities

### Development Team
- **Evan LABOURDETTE:** :Tests
- **Maxime SENARD** : CI/CD & Functional Code Simple
- **Baptiste PERARD:** : Tests
- **Edouard BELHOMME:** : Tests
- **Julia TRAN:**: Documentation 


---
### Quick Start
```bash
# Clone the repository
git clone https://github.com/coinlegacy/awkward-legacy.git
cd awkward-legacy

#How to launch the project in ocaml
opam init
opam switch create 5.3.0
opam switch set 5.3.0
eval $(opam env)
opam install . --deps-only
ocaml ./configure.ml
make clean distrib
```

### Documentation Access
All project documentation is centralized in the `/docs` directory with comprehensive cross-references and implementation guides.

---

## Contributing

### Development Workflow
1. **Branch Strategy:** Feature branches from `dev` branch
2. **Code Review:** Mandatory peer review for all genealogy calculation logic
3. **Testing:** Automated test execution on all commits
4. **Documentation:** Update relevant docs with all functional changes

### Quality Gates
- ✅ All tests passing (unit, integration, accessibility)
- ✅ Code coverage >95% for core genealogy functions
- ✅ Security scan clean (no critical vulnerabilities)
- ✅ Accessibility audit passing (WCAG 2.1 AA)
- ✅ Performance benchmarks met
- ✅ Documentation updated and reviewed

---

### External Resources
- **GeneWeb Documentation:** [Official GeneWeb Wiki](https://geneweb.tuxfamily.org/wiki/)
- **Python Genealogy Libraries:** Research and integration documentation
- **Accessibility Guidelines:** [WCAG 2.1 Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---
## Legal & Compliance 

[📄 Documentation](./legal-compliance.md)
### Data Protection
- **GDPR Compliance:** Full data protection regulation adherence
- **Privacy by Design:** Privacy considerations integrated throughout development
- **Data Retention:** Historical data preservation with modern privacy controls
- **Audit Trail:** Complete logging for legal and compliance requirements

### Open Source Compliance
- **GeneWeb License:** GNU General Public License compliance
- **Attribution:** Proper credit to original OCaml developers
- **Distribution:** License compatibility for commercial deployment
