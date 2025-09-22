# AWKWARD LEGACY - End-to-End Test Plan

## About GeneWeb Legacy System

GeneWeb is free, open source genealogy software written in OCaml by Daniel de Rauglaudre that provides comprehensive genealogical database management with web interface capabilities. The legacy system includes:

- **Core Features:** Unlimited individuals, families, and events management
- **Key Functionality:** Relationship and consanguinity rate calculator, to help understand inbreeding in families
- **Data Formats:** Import and export genealogical database in its own GW format or in GEDCOM file format
- **Security:** Passwords secure databases with accounts for both "friends" (to access private data) and "wizards" (to update permissions)

---

## End-to-End Test Strategy

### Critical Success Factors
1. **Data Integrity Preservation:** All genealogical relationships must remain intact
2. **Heir Calculation Accuracy:** Relationship and consanguinity rate calculator results must match original OCaml output exactly
3. **Format Compatibility:** Support for both GW format or in GEDCOM file format
4. **Performance Standards:** Handle databases with unlimited individuals without degradation

---

## E2E Test Scenarios

### Test Scenario 1: Complete Genealogy Data Processing
**Test ID:** E2E-GW-001  
**Priority:** Critical  
**Objective:** Validate full data import, processing, and heir identification workflow

#### Pre-Conditions
- Legacy GeneWeb database in .gw format available
- Historical family data with known inheritance outcomes (1995-2008 period)
- Python conversion environment ready
- Original OCaml GeneWeb results for baseline comparison

#### Test Steps

**Phase 1: Data Import Validation**
```
1. Load legacy .gw format genealogical database
2. Import GEDCOM files from original system
3. Verify all individual records preserved:
   - Personal information (birth, death, marriage dates)
   - Family relationships (parents, children, spouses)
   - Historical notes and sources
   - Event witnesses and documentation
```

**Phase 2: Relationship Calculation Engine**
```
1. Execute relationship calculator for complex family trees
2. Calculate consanguinity rates for inheritance law compliance
3. Process multiple marriage scenarios and step-relationships
4. Handle noble titles and inheritance precedence
5. Validate inbreeding coefficients for legal heir determination
```

**Phase 3: Heir Identification Process**
```
1. Identify all potential heirs for deceased individuals
2. Calculate inheritance distribution based on relationship proximity
3. Apply legal precedence rules (primogeniture, gender preferences)
4. Generate ranked heir lists with supporting documentation
5. Flag potential inheritance conflicts or disputed claims
```

#### Expected Results
- **Data Fidelity:** 100% preservation of all genealogical data
- **Calculation Accuracy:** Relationship calculations match OCaml baseline within ±0.001%
- **Processing Speed:** Complete analysis under 60 seconds for databases <10K individuals
- **Output Format:** Compatible heir reports in both text and structured formats

#### Acceptance Criteria
```
✅ All individual records imported without data loss
✅ Family relationships correctly preserved and queryable
✅ Consanguinity calculations match original OCaml precision
✅ Heir identification produces identical results to legacy system
✅ Performance meets or exceeds original system benchmarks
```

---

### Test Scenario 2: Complex Inheritance Resolution
**Test ID:** E2E-GW-002  
**Priority:** High  
**Objective:** Validate system handling of complex inheritance scenarios

#### Test Cases

**Case 2A: Multi-Generational Noble Lineage**
- Test inheritance through multiple noble title holders
- Validate precedence rules for titles and estates
- Confirm proper handling of gender-based inheritance laws
- Expected: Accurate heir ranking with supporting legal documentation

**Case 2B: Adoptions and Legitimizations**
- Process adopted children and their inheritance rights
- Handle legitimized offspring from historical periods
- Validate step-parent and step-child relationship impacts
- Expected: Correct legal standing determination for all parties

**Case 2C: Missing or Disputed Records**
- Handle incomplete genealogical data gracefully
- Process conflicting birth/death dates
- Manage disputed parentage claims
- Expected: Clear documentation of uncertainties with confidence ratings

#### Validation Methods
```python
def test_complex_inheritance():
    # Load test dataset with known complex scenarios
    family_tree = load_test_genealogy("noble_lineage_1650_1950.gw")
    
    # Execute heir identification
    heir_results = python_geneweb.identify_heirs(deceased_person_id)
    ocaml_baseline = load_baseline_results("expected_heirs.json")
    
    # Validate results match baseline
    assert heir_results.primary_heirs == ocaml_baseline.primary_heirs
    assert heir_results.inheritance_percentages == ocaml_baseline.percentages
    assert heir_results.legal_precedence == ocaml_baseline.precedence
```

---

### Test Scenario 3: Data Format Compatibility
**Test ID:** E2E-GW-003  
**Priority:** Medium  
**Objective:** Ensure seamless import/export functionality

#### Test Coverage
- **GW Format Import:** Native GeneWeb format processing
- **GEDCOM Import:** Standard genealogy format compatibility  
- **Data Export:** Generate reports in multiple formats for client delivery
- **Encoding Support:** Handle international character sets and historical naming conventions

#### Performance Benchmarks
```
Database Size    | Import Time | Processing Time | Export Time
Small (<1K)      | <5 seconds  | <10 seconds    | <3 seconds
Medium (1K-10K)  | <30 seconds | <60 seconds    | <15 seconds  
Large (10K+)     | <2 minutes  | <5 minutes     | <1 minute
```

---

## Test Environment Setup

### Required Components
1. **Legacy Data Sources**
   - Historical GeneWeb databases (1995-2008)
   - Sample GEDCOM files with known results
   - Baseline OCaml calculation outputs

2. **Python Test Environment**
   - Python 3.8+ with genealogy processing libraries
   - Test data fixtures and mock datasets
   - Automated test execution framework

3. **Validation Tools**
   - Data comparison utilities
   - Performance monitoring tools
   - Security audit scanners

## Quality Assurance Checklist

### Data Integrity ✅
- [ ] All individual records preserved during conversion
- [ ] Family relationships maintained accurately
- [ ] Historical dates and events correctly formatted
- [ ] Source documentation and notes transferred intact

### Functional Accuracy ✅
- [ ] Heir identification matches OCaml baseline results
- [ ] Consanguinity calculations achieve required precision
- [ ] Relationship degrees calculated correctly
- [ ] Inheritance precedence rules properly applied

### Performance Standards ✅
- [ ] Processing time within acceptable limits
- [ ] Memory usage optimized for large databases
- [ ] Concurrent user access supported
- [ ] System stability under load testing

### Security Compliance ✅
- [ ] Data privacy protection maintained
- [ ] Access control systems functional
- [ ] Audit logging implemented
- [ ] GDPR compliance validated

---

## Risk Mitigation

### Critical Risks
1. **Data Loss Risk:** Comprehensive backup strategy before any conversion
2. **Calculation Errors:** Parallel processing with OCaml system for validation
3. **Performance Degradation:** Incremental testing with increasing dataset sizes
4. **Security Vulnerabilities:** Regular security audits throughout development

### Mitigation Strategies
- **Rollback Plan:** Maintain original OCaml system as fallback
- **Incremental Validation:** Test each component against known baselines
- **Stakeholder Communication:** Regular updates to CoinLegacy Inc. management
- **Documentation:** Complete audit trail of all changes and validations

---

## Success Metrics

The project will be considered successful when:
- ✅ **100% Data Fidelity:** No genealogical information lost or corrupted
- ✅ **Calculation Accuracy:** <0.001% variance from OCaml baseline results  
- ✅ **Performance Standards:** Processing times meet or exceed legacy system
- ✅ **Client Approval:** CoinLegacy Inc. validates heir identification accuracy
- ✅ **Deployment Ready:** System passes all security and compliance audits

**Mission Critical:** Preserve the historical value and accuracy of genealogical data while enabling modern deployment and maintenance practices.
