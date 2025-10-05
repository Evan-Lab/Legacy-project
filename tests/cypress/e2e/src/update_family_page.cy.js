describe('Update Family Page', () => {
    const base = Cypress.env('BASE_URL') || Cypress.config('baseUrl') || 'http://localhost:8000';
    beforeEach(() => {
        cy.visit('/555SAMPLE?m=MOD_FAM&i=0&ip=0');
    });

    context('Initial load', () => {
        it('should load with the correct title and header', () => {
            cy.title().should('include', 'Update family');
            cy.get('h1').should('contain', 'Update family');
        });

        it('should contain hidden inputs with correct names', () => {
            ['digest', 'ip', 'i', 'm'].forEach(name => {
                cy.get(`input[name="${name}"]`).should('exist');
            });
        });
    });

    context('Navigation tabs', () => {
        it('should contain all family editing sections', () => {
            const sections = ['Parents', 'Events', 'Children', 'Sources', 'Comment'];
            sections.forEach(sec => cy.get('#banner').contains(sec).should('exist'));
        });
    });

    context('Dropdown menus', () => {
        it('should open modules dropdown and display form', () => {
            cy.get('#load_once_p_mod').click();
            cy.get('#p_mod').should('exist');
            cy.get('#p_mod_clear').should('exist');
        });

        it('should open Tools family dropdown', () => {
            cy.contains('Tools families').click({ force: true });
            cy.contains('Add family').should('exist');
            cy.contains('Delete family').should('exist');
        });
    });

    context('Accessibility and external links', () => {
        it('should have alt text for images', () => {
            cy.get('img').each(img => cy.wrap(img).should('have.attr', 'alt'));
        });

        // it('should verify that all external links are safe', () => {
        //     cy.get('a[target="_blank"]').each(link => {
        //         cy.wrap(link).should('have.attr', 'rel').and('include', 'noreferrer');
        //     });
        // });
    });
});
