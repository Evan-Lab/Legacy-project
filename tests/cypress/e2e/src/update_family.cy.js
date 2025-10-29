describe('Family Form - Elements Presence Verification', () => {
  
  beforeEach(() => {
    cy.visit('AlexClark?m=MOD_FAM&i=41&ip=227');
    cy.get('#updfam').should('exist');
  });

  context('Parents Section - Person 1 (Male)', () => {
    it('should have all Person 1 labels', () => {
      cy.contains('label', 'First name').should('be.visible');
      cy.contains('label', 'Surname').should('be.visible');
    });

    it('should have all Person 1 basic inputs', () => {
      cy.get('#pa1_fn').should('exist');
      cy.get('#pa1_sn').should('exist');
      cy.get('#pa1_occ').should('exist').should('have.attr', 'type', 'number');
      cy.get('#pa1_p_selct').should('exist');
    });

    it('should have pa1_p select options', () => {
      cy.get('#pa1_p_selct option[value="create"]').should('exist');
      cy.get('#pa1_p_selct option[value="link"]').should('exist');
    });

    it('should have birth conditional fields', () => {
      cy.get('#pa1b_mm').should('exist');
      cy.get('#pa1b_dd').should('exist');
      cy.get('#pa1b_yyyy').should('exist');
      cy.get('#pa1b_pl').should('exist');
    });

    it('should have death conditional fields', () => {
      cy.get('#pa1d_mm').should('exist');
      cy.get('#pa1d_dd').should('exist');
      cy.get('#pa1d_yyyy').should('exist');
      cy.get('#pa1d_pl').should('exist');
    });

    it('should have occupation field', () => {
      cy.get('#pa1_occu').should('exist');
    });
  });

  context('Parents Section - Person 2 (Female)', () => {
    it('should have all Person 2 labels', () => {
      cy.get('label[for="pa2_fn"]').should('exist');
      cy.get('label[for="pa2_sn"]').should('exist');
    });

    it('should have all Person 2 basic inputs', () => {
      cy.get('#pa2_fn').should('exist');
      cy.get('#pa2_sn').should('exist');
      cy.get('#pa2_occ').should('exist').should('have.attr', 'type', 'number');
      cy.get('#pa2_p_selct').should('exist');
    });

    it('should have birth conditional fields', () => {
      cy.get('#pa2b_mm').should('exist');
      cy.get('#pa2b_dd').should('exist');
      cy.get('#pa2b_yyyy').should('exist');
      cy.get('#pa2b_pl').should('exist');
    });

    it('should have death conditional fields', () => {
      cy.get('#pa2d_mm').should('exist');
      cy.get('#pa2d_dd').should('exist');
      cy.get('#pa2d_yyyy').should('exist');
      cy.get('#pa2d_pl').should('exist');
    });

    it('should have occupation field', () => {
      cy.get('#pa2_occu').should('exist');
    });
  });

  it('should have "Same sex couple" checkbox', () => {
    cy.get('#nsck').should('exist').should('have.attr', 'type', 'checkbox');
    cy.contains('label', 'Same sex couple').should('exist');
  });

  context('Events Section - Event 1', () => {
    it('should have event 1 label and select', () => {
      cy.get('label[for="e_name1"]').should('exist');
      cy.get('#fevent_select1').should('exist');
    });

    it('should have main event select options', () => {
      cy.get('#fevent_select1 option[value="#marr"]').should('exist');
      cy.get('#fevent_select1 option[value="#nmar"]').should('exist');
      cy.get('#fevent_select1 option[value="#enga"]').should('exist');
      cy.get('#fevent_select1 option[value="#div"]').should('exist');
    });

    it('should have e_name1 input field', () => {
      cy.get('#e_name1').should('exist');
    });

    it('should have place fields', () => {
      cy.get('label[for="e_place1"]').should('exist');
      cy.get('#e_place1').should('exist');
    });

    it('should have date fields', () => {
      cy.get('input[name="e_date1_mm"]').should('exist');
      cy.get('input[name="e_date1_dd"]').should('exist');
      cy.get('input[name="e_date1_yyyy"]').should('exist');
    });

    it('should have alternative date fields', () => {
      cy.get('input[name="e_date1_ormonth"]').should('exist');
      cy.get('input[name="e_date1_orday"]').should('exist');
      cy.get('input[name="e_date1_oryear"]').should('exist');
    });

    it('should have precision and calendar selects', () => {
      cy.get('#e_date1_prec').should('exist');
      cy.get('#e_date1_cal').should('exist');
    });

    it('should have alternative text date field', () => {
      cy.get('#e_date1_text').should('exist');
    });

    it('should have notes and source fields', () => {
      cy.get('label[for="e_note1"]').should('exist');
      cy.get('#e_note1').should('exist');
      cy.get('label[for="e_src1"]').should('exist');
      cy.get('#e_src1').should('exist');
    });

    it('should have witness add control', () => {
      cy.get('#e1_ins_witn0_n').should('exist');
      cy.get('input[name="e1_ins_witn0"]').should('exist').should('have.attr', 'type', 'checkbox');
    });

    it('should have event add control', () => {
      cy.get('#ins_event1_n').should('exist');
      cy.get('input[name="ins_event1"]').should('exist').should('have.attr', 'type', 'checkbox');
    });
  });

  context('Children Section - General Controls', () => {
    it('should have child add control before 1st child', () => {
      cy.get('#ins_ch0_n').should('exist');
      cy.get('input[name="ins_ch0"]').should('exist').should('have.attr', 'type', 'checkbox');
    });
  });

  context('Children Section - 1st Child', () => {
    it('should have link/create select for child 1', () => {
      cy.get('#ch1_p_selct').should('exist');
      cy.get('#ch1_p_selct option[value="link"]').should('exist');
      cy.get('#ch1_p_selct option[value="create"]').should('exist');
    });

    it('should have child 1 basic fields', () => {
      cy.get('label[for="ch1_fn"]').should('exist');
      cy.get('#ch1_fn').should('exist');
      cy.get('label[for="ch1_sn"]').should('exist');
      cy.get('#ch1_sn').should('exist');
      cy.get('label[for="ch1_occ"]').should('exist');
      cy.get('#ch1_occ').should('exist');
    });

    it('should have birth conditional fields', () => {
      cy.get('#ch1b_mm').should('exist');
      cy.get('#ch1b_dd').should('exist');
      cy.get('#ch1b_yyyy').should('exist');
      cy.get('#ch1b_pl').should('exist');
    });

    it('should have death conditional fields', () => {
      cy.get('#ch1d_mm').should('exist');
      cy.get('#ch1d_dd').should('exist');
      cy.get('#ch1d_yyyy').should('exist');
      cy.get('#ch1d_pl').should('exist');
    });

    it('should have occupation field', () => {
      cy.get('label[for="ch1_occu"]').should('exist');
      cy.get('#ch1_occu').should('exist');
    });

    it('should have sex radio buttons', () => {
      cy.get('input[name="ch1_sex"][value="M"]').should('exist');
      cy.get('input[name="ch1_sex"][value="N"]').should('exist');
      cy.get('input[name="ch1_sex"][value="F"]').should('exist');
    });

    it('should have child add control after child 1', () => {
      cy.get('#ins_ch1_n').should('exist');
      cy.get('input[name="ins_ch1"]').should('exist');
    });

    it('should have swap button 1-2', () => {
      cy.get('button[name="inv_ch2"]').should('exist');
    });
  });

  context('Children Section - Child 2 Sample', () => {
    it('should have all child 2 fields', () => {
      cy.get('#ch2_p_selct').should('exist');
      cy.get('#ch2_fn').should('exist');
      cy.get('#ch2_sn').should('exist');
      cy.get('#ch2_occ').should('exist');
      cy.get('#ch2b_mm').should('exist');
      cy.get('#ch2b_yyyy').should('exist');
      cy.get('#ch2d_mm').should('exist');
      cy.get('#ch2d_yyyy').should('exist');
      cy.get('#ch2_occu').should('exist');
    });

    it('should have add control after child 2', () => {
      cy.get('#ins_ch2_n').should('exist');
      cy.get('input[name="ins_ch2"]').should('exist');
    });

    it('should have swap button 2-3', () => {
      cy.get('button[name="inv_ch3"]').should('exist');
    });
  });

  context('Sources Section', () => {
    it('should have individuals source field', () => {
      cy.get('label[for="psrc"]').should('exist');
      cy.get('#psrc').should('exist');
    });

    it('should have family source field', () => {
      cy.get('label[for="src"]').should('exist');
      cy.get('#src').should('exist');
    });

    it('should have rdsrc checkbox', () => {
      cy.get('input[name="rdsrc"]').should('exist').should('have.attr', 'type', 'checkbox');
    });
  });

  context('Comment Section', () => {
    it('should have comment textarea', () => {
      cy.get('#notes_comments').should('exist');
      cy.get('textarea[name="comment"]').should('exist');
    });

    it('should have formatting toolbar', () => {
      cy.get('#nav-note').should('exist');
      cy.contains('a', '<HTML>').should('exist');
      cy.contains('a', 'h1').should('exist');
      cy.contains('a', 'Format').should('exist');
    });

    it('should have special characters panel', () => {
      cy.get('.ch.text-monospace').should('exist');
      cy.get('.ch.text-monospace a').should('have.length.greaterThan', 50);
    });
  });

  context('Navigation and Submission', () => {
    it('should have section navigation', () => {
      cy.get('a[href="#family"]').should('exist');
      cy.get('a[href="#events"]').should('exist');
      cy.get('a[href="#children"]').should('exist');
      cy.get('a[href="#sources"]').should('exist');
      cy.get('a[href="#comments"]').should('exist');
    });

    it('should have submit buttons', () => {
      cy.get('button[type="submit"]').should('have.length.greaterThan', 0);
    });
  });

  context('HTML5 Validation Patterns', () => {
    it('should have correct pattern for months', () => {
      cy.get('#pa1b_mm').should('have.attr', 'pattern');
    });

    it('should have correct pattern for days', () => {
      cy.get('#pa1b_dd').should('have.attr', 'pattern');
    });

    it('should have correct pattern for years', () => {
      cy.get('#pa1b_yyyy').should('have.attr', 'pattern');
    });
  });


  context('Field Attributes', () => {
    it('should have correct min attribute for occurrence numbers', () => {
      cy.get('#pa1_occ').should('have.attr', 'min');
      cy.get('#pa2_occ').should('have.attr', 'min');
    });

    it('should have correct maxlength attributes', () => {
      cy.get('#pa1b_mm').should('have.attr', 'maxlength');
      cy.get('#pa1b_dd').should('have.attr', 'maxlength');
      cy.get('#pa1b_yyyy').should('have.attr', 'maxlength');
    });

    it('should have appropriate datalist attributes', () => {
      cy.get('#pa1_fn').should('have.attr', 'list');
      cy.get('#pa1_sn').should('have.attr', 'list');
      cy.get('#pa1b_pl').should('have.attr', 'list');
    });
  });

  /**
   * TEST 14: Form structure verification
   */
  it('should have form structure with correct attributes', () => {
    cy.get('form#updfam')
      .should('exist')
      .should('have.attr', 'method');
  });
});