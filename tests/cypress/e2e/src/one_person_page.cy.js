describe('One Person Page', () => {
    const base = Cypress.env('BASE_URL') || Cypress.config('baseUrl') || 'http://localhost:8000';

    beforeEach(() => {
        cy.visit('/555SAMPLE?p=robert+eugene&n=williams');
    });

    context('Page structure', () => {
        it('should load correctly with a valid title', () => {
            cy.title().should('include', 'Robert Eugene Williams');
            cy.get('nav.navbar').should('exist');
        });

        it('should have meta tags and favicon', () => {
            cy.get('meta[name="robots"]').should('have.attr', 'content', 'none');
            cy.get('link[rel="icon"]').should('exist');
        });
    });

    context('Menubar interactions', () => {
        it('should toggle module dropdown and validate form presence', () => {
            cy.get('#load_once_p_mod').click();
            cy.get('form[name="upd_url"]').should('exist');
            cy.get('#p_mod').should('have.attr', 'placeholder', 'Select personalized modules');
            cy.get('#p_mod_clear').should('have.attr', 'title', 'Delete');
        });

        it('should display main navigation links', () => {
            const navItems = ['#add_par', '#mod_ind', '#mod_fam_1', '#mod_fam_2'];
            navItems.forEach(id => cy.get(id).should('exist'));
        });
    });

    context('Tools and actions', () => {
        it('should open Tools individual dropdown and validate links', () => {
            cy.get('#load_once_copylink').click();
            cy.contains('Visibility').should('exist');
            cy.contains('Merge individuals').should('exist');
            cy.contains('Delete individual').should('exist');
        });

        // it('should verify that external links are safe (noopener, noreferrer)', () => {
        //     cy.get('a[target="_blank"]').each(link => {
        //         cy.wrap(link).should('have.attr', 'rel').and('include', 'noreferrer');
        //     });
        // });
    });

    context('Accessibility and content', () => {
        it('should have aria and sr-only labels', () => {
            cy.get('.sr-only').should('exist');
            cy.get('[aria-hidden]').should('exist');
        });

        it('should contain a link to Geneanet', () => {
            cy.contains('Search Robert Eugene Williams on Geneanet')
                .should('have.attr', 'href')
                .and('include', 'geneanet.org');
        });
    });
});
