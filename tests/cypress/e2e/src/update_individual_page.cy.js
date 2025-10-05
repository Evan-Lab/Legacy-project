describe('Update Individual Page', () => {
    const base = Cypress.env('BASE_URL') || Cypress.config('baseUrl') || 'http://localhost:8000';
    beforeEach(() => {
        cy.visit('/555SAMPLE?m=MOD_IND&i=0');
    });

    context('Page load and structure', () => {
        it('should have a valid title and update form', () => {
            cy.title().should('include', 'Update individual');
            cy.get('form[name="upd"]').should('exist');
        });

        it('should pre-fill the form with existing data', () => {
            cy.get('#first_name').should('have.value', 'Robert Eugene');
            cy.get('#surname').should('have.value', 'Williams');
            cy.get('#sexM').should('be.checked');
        });
    });

    context('Form interactions', () => {
        it('should allow editing of individual fields', () => {
            cy.get('#first_name').clear().type('Robert');
            cy.get('#surname').clear().type('Williamson');
            cy.get('#occ').clear().type('1');
        });

        it('should allow changing sex selection', () => {
            cy.get('#sexF').check().should('be.checked');
            cy.get('#sexM').should('not.be.checked');
        });

        it('should submit the form', () => {
            cy.get('form[name="upd"]').submit();
        });
    });

    context('Navigation bar', () => {
        it('should contain all navigation tabs', () => {
            const tabs = ['Individual', 'Birth', 'Baptism', 'Death', 'Burial', 'Events', 'Relationships', 'Titles', 'Notes'];
            tabs.forEach(tab => cy.get('#banner').contains(tab).should('exist'));
        });

        it('should allow opening the search modal', () => {
            cy.get('[data-target="#searchmodal"]').click();
            cy.get('#searchmodal').should('be.visible');
        });
    });

    context('Accessibility and consistency', () => {
        it('should have aria attributes and labels', () => {
            cy.get('label').should('exist');
            cy.get('[aria-hidden]').should('exist');
        });

        // it('should verify external link safety', () => {
        //     cy.get('a[target="_blank"]').each(link => {
        //         cy.wrap(link).should('have.attr', 'rel').and('include', 'noreferrer');
        //     });
        // });
    });
});
