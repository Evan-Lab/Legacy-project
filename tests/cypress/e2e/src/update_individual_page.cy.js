describe("Update Individual Page", () => {
    const base =
        Cypress.env("BASE_URL") ||
        Cypress.config("baseUrl") ||
        "http://localhost:8000";
    beforeEach(() => {
        cy.visit("/555SAMPLE?m=MOD_IND&i=0");
    });

    context("Page load and structure: Update Individual", () => {
        it("should have a valid title and update form", () => {
            cy.title().should("include", "Update individual");
            cy.get('form[name="upd"]').should("exist");
        });

        it("should contain input with correct labels: First name", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .first()
                        .find('label')
                        .first()
                        .should("contain.text", "First name");

                    cy.get('div.row')
                        .first()
                        .find('input')
                        .first()
                        .should("have.attr", "id", "first_name")
                        .should("be.visible");
                });
        });

        it("should contain input with correct labels: Surname", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(1)
                        .find('label')
                        .first()
                        .should("contain.text", "Surname");

                    cy.get('div.row')
                        .eq(1)
                        .find('input')
                        .first()
                        .should("have.attr", "id", "surname")
                        .should("be.visible");
                });
        });

        it("should contain input with correct labels: Number", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .first()
                        .find('label')
                        .eq(1)
                        .should("contain.text", "Number");

                    cy.get('div.row')
                        .first()
                        .find('input')
                        .eq(1)
                        .should('have.attr', 'type', 'number')
                        .should("be.visible");
                });
        });

        it("should contain input group for Sex with correct radio buttons", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(1)
                        .within(() => {
                            cy.contains('span.col-form-label', 'Sex').should('exist');

                            cy.get('input[type="radio"][name="sex"]').should('have.length', 3);

                            cy.get('#sexM')
                                .should('exist')
                                .and('have.attr', 'value', 'M');

                            cy.get('#sexU')
                                .should('exist')
                                .and('have.attr', 'value', 'N');

                            cy.get('#sexF')
                                .should('exist')
                                .and('have.attr', 'value', 'F');

                            cy.get('#sexM').should('be.checked');

                            cy.get('#sexU').should('not.be.checked');
                            cy.get('#sexF').should('not.be.checked');
                        });
                });
        });

        it("should contain input for Public name", () => {
            cy.get('div.form-group')
                .eq(2) // Ajuste l'index si nécessaire
                .within(() => {
                    cy.get('div.row').eq(2).within(() => {
                        cy.get('label[for="public_name"]')
                            .should('contain.text', 'Public name');
                        cy.get('input#public_name')
                            .should('exist')
                            .and('be.visible');
                    });
                });
        });

        it("should contain input for Picture", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.row').eq(2).within(() => {
                        cy.get('label[for="image"]')
                            .should('contain.text', 'Picture');
                        cy.get('input#image')
                            .should('exist')
                            .and('be.visible');
                    });
                });
        });

        it("should contain radio buttons for Access", () => {
            cy.get('div.form-group')
                .eq(2)
                .within(() => {
                    cy.get('div.col-4').within(() => {
                        cy.contains('span.col-form-label', 'Access').should('exist');

                        cy.get('input[type="radio"][name="access"]')
                            .should('have.length', 3);

                        cy.get('#IfTitles')
                            .should('exist')
                            .and('have.attr', 'value', 'IfTitles')
                            .and('be.checked');

                        cy.get('#Public')
                            .should('exist')
                            .and('have.attr', 'value', 'Public')
                            .and('not.be.checked');

                        cy.get('#Private')
                            .should('exist')
                            .and('have.attr', 'value', 'Private')
                            .and('not.be.checked');
                    });
                });
        });

        it("should contain Sobriquet input and checkbox", () => {
            cy.get('div.form-group')
                .eq(3)
                .within(() => {
                    cy.get('div.row').eq(0).within(() => {
                        cy.contains('label', 'Sobriquet').should('exist');
                        cy.get('input[type="text"]').should('exist').and('be.visible');
                        cy.contains('label', 'Add sobriquet').prev('input[type="checkbox"]').should('exist');
                    });
                });
        });

        it("should contain Alias input and checkbox", () => {
            cy.get('div.form-group')
                .eq(3)
                .within(() => {
                    cy.get('div.row').eq(1).within(() => {
                        cy.contains('label', 'Alias').should('exist');
                        cy.get('input[type="text"]').should('exist').and('be.visible');
                        cy.contains('label', 'Add alias').prev('input[type="checkbox"]').should('exist');
                    });
                });
        });

        it("should contain Alternate first name input and checkbox", () => {
            cy.get('div.form-group')
                .eq(3)
                .within(() => {
                    cy.get('div.row').eq(2).within(() => {
                        cy.contains('label', 'Alternate first name').should('exist');
                        cy.get('input[type="text"]').should('exist').and('be.visible');
                        cy.contains('label', 'Add alternate first name').prev('input[type="checkbox"]').should('exist');
                    });
                });
        });

        it("should contain Alternate surname input and checkbox", () => {
            cy.get('div.form-group')
                .eq(3)
                .within(() => {
                    cy.get('div.row').eq(3).within(() => {
                        cy.contains('label', 'Alternate surname').should('exist');
                        cy.get('input[type="text"]').should('exist').and('be.visible');
                        cy.contains('label', 'Add alternate surname').prev('input[type="checkbox"]').should('exist');
                    });
                });
        });

        it("should contain input with correct labels: Occupations", () => {
            cy.get('div.form-group')
                .eq(4)
                .within(() => {
                    cy.get('label')
                        .first()
                        .should("contain.text", "Occupations");

                    cy.get('input')
                        .first()
                        .should("have.attr", "type", "text")
                        .should("be.visible");
                });
        });

        it("should contain input with correct labels: Source", () => {
            cy.get('div.card')
                .first()
                .find('div.row')
                .last()
                .within(() => {
                    cy.get('label')
                        .first()
                        .should("contain.text", "Source");

                    cy.get('input')
                        .first()
                        .should("have.attr", "type", "text")
                        .should("be.visible");

                    cy.get('button[type="submit"]')
                        .should("exist")
                        .should("be.visible");
                });
        });

    });

    context("Page load and structure: Birth", () => {
        it("should have a valid title", () => {
            cy.get('div.card')
                .eq(1)
                .within(() => {
                    cy.get('h3')
                        .should('be.visible')
                        .and('contain.text', 'Birth');

                });
        });
        it("should contain input for Birth place", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            cy.get('label')
                                .contains('Place')
                                .should('exist');

                            cy.get('input')
                                .first()
                                .should('have.attr', 'type', 'text')
                                .should('be.visible');
                        });
                });
        });

        it("should contain input for Birth date (month, day, year) and selects", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(5) // garde la même structure que ton précédent test
                        .within(() => {
                            // Vérifie le label "Date"
                            cy.get('div.col-sm-1.col-md-2.col-form-label')
                                .contains('Date')
                                .should('exist');

                            // Vérifie les inputs month, day, year
                            cy.get('div.col.col-sm-auto.form-inline')
                                .within(() => {
                                    cy.get('input[name="e_date1_mm"]')
                                        .should('have.attr', 'type', 'text')
                                        .should('be.visible');

                                    cy.get('input[name="e_date1_dd"]')
                                        .should('have.attr', 'type', 'text')
                                        .should('be.visible');

                                    cy.get('input[name="e_date1_yyyy"]')
                                        .should('have.attr', 'type', 'text')
                                        .should('be.visible');
                                });

                            // Vérifie les selects precision et calendar
                            cy.get('div.col-10.col-lg.ml-auto.form-inline')
                                .within(() => {
                                    cy.get('select[name="e_date1_prec"]').should('exist');
                                    cy.get('select[name="e_date1_cal"]').should('exist');
                                });
                        });
                });
        });


        it("should contain the correct options for Birth date selects", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            // Tableau des selects et des options attendues
                            const selectsToCheck = [
                                {
                                    name: 'e_date1_prec',
                                    options: ['exact', 'about', 'possibly', 'before', 'after', '…or…', '…between…']
                                },
                                {
                                    name: 'e_date1_cal',
                                    options: ['-', 'Gregorian', 'Julian', 'French republican', 'Hebrew']
                                }
                            ];

                            selectsToCheck.forEach(select => {
                                cy.get(`select[name="${select.name}"]`).within(() => {
                                    select.options.forEach(optionText => {
                                        cy.contains('option', optionText).should('exist');
                                    });
                                });
                            });
                        });
                });
        });

        it("should contain a textarea for event notes", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(7) // correspond à la ligne Notes
                        .within(() => {
                            cy.get('label')
                                .contains('Notes')
                                .should('exist');

                            cy.get('textarea')
                                .first()
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_note1')
                                .and('have.attr', 'placeholder', 'Notes');
                        });
                });
        });

        it("should contain input for event Source", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(8) // correspond à la ligne Source
                        .within(() => {
                            cy.get('label')
                                .contains('Source')
                                .should('exist');

                            cy.get('input')
                                .first()
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_src1')
                                .and('have.attr', 'placeholder', 'Source');
                        });
                });
        });

        it("should contain select for number of witnesses and related checkbox", () => {
            cy.get('div.card-body')
                .eq(1)
                .within(() => {
                    cy.get('div.row')
                        .eq(9) // correspond à la ligne Add
                        .within(() => {
                            // Vérification du label
                            cy.get('label')
                                .contains('Add')
                                .should('exist');

                            // Vérification du select
                            cy.get('select[name="e1_ins_witn0_n"]')
                                .should('exist')
                                .and('be.visible')
                                .within(() => {
                                    const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                                    options.forEach(opt => {
                                        cy.get('option').contains(opt).should('exist');
                                    });
                                });

                            // Vérification du checkbox
                            cy.get('input[type="checkbox"][name="e1_ins_witn0"]')
                                .should('exist')
                                .and('not.be.checked');

                            // Vérification du bouton
                            cy.get('button[type="submit"]')
                                .should('exist')
                                .and('contain', 'OK');
                        });
                });
        });
    });

    context("Baptism section tests", () => {
        it("should contain a visible input for event Place", () => {
            cy.get('div.card-body')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            cy.get('label[for="e_place5"]')
                                .should('exist')
                                .and('contain.text', 'Place');

                            cy.get('input#e_place5')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'name', 'e_place5')
                        });
                });
        });

        it("should contain visible inputs and selects for event Date", () => {
            cy.get('div.card-body')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            cy.get('.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Date');

                            cy.get('input[name="e_date5_mm"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'maxlength', '2');

                            cy.get('input[name="e_date5_dd"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'maxlength', '2');

                            cy.get('input[name="e_date5_yyyy"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'maxlength', '8');

                            cy.get('select#e_date5_prec')
                                .should('exist')
                                .and('be.visible')
                                .and('contain', 'exact')
                                .and('contain', 'about')
                                .and('contain', 'possibly')
                                .and('contain', 'before')
                                .and('contain', 'after')
                                .and('contain', '…or…')
                                .and('contain', '…between…');

                            cy.get('select#e_date5_cal')
                                .should('exist')
                                .and('be.visible')
                                .and('contain', 'Gregorian')
                                .and('contain', 'Julian')
                                .and('contain', 'French republican')
                                .and('contain', 'Hebrew');
                        });
                });
        });


        it("should contain a visible textarea for event Notes", () => {
            cy.get('div.card-body')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(7)
                        .within(() => {
                            cy.get('label[for="e_note5"]')
                                .should('exist')
                                .and('contain.text', 'Notes');

                            cy.get('textarea#e_note5')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_note5')
                                .and('have.attr', 'placeholder', 'Notes')
                                .and('have.attr', 'rows', '1');
                        });
                });
        });


        it("should contain a visible input for event Source", () => {
            cy.get('div.card-body')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(8)
                        .within(() => {
                            cy.get('label[for="e_src5"]')
                                .should('exist')
                                .and('contain.text', 'Source');

                            cy.get('input#e_src5')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'name', 'e_src5')
                                .and('have.attr', 'placeholder', 'Source');
                        });
                });
        });


        it("should contain a visible select and checkbox for adding witnesses", () => {
            cy.get('div.card-body')
                .eq(2)
                .within(() => {
                    cy.get('div.row')
                        .eq(9)
                        .within(() => {
                            cy.get('label[for="e5_ins_witn0_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#e5_ins_witn0_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e5_ins_witn0_n')
                                .within(() => {
                                    cy.get('option').should('have.length', 10);
                                    cy.get('option').first().should('contain.text', '1');
                                    cy.get('option').last().should('contain.text', '10');
                                });

                            cy.get('input[type="checkbox"][name="e5_ins_witn0"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'value', 'on');

                            cy.get('label.btn.btn-outline-primary')
                                .should('exist')
                                .and('contain.text', 'witness(es)');

                            cy.get('button[type="submit"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'title', 'Add witness(s)')
                                .and('contain.text', 'OK');
                        });
                });
        });

    });

    context("Death section tests", () => {
        it("should contain a visible header for Death section", () => {
            cy.get('div.card')
                .eq(3)
                .within(() => {
                    cy.get('h3#death.card-header')
                        .should('exist')
                        .and('be.visible')
                        .and('have.class', 'text-center')
                        .and('contain.text', 'Death');
                });
        });

        it("should contain a visible select and radio buttons for Death type", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            cy.get('label[for="death_select3"]')
                                .should('exist')
                                .and('contain.text', 'Type');

                            cy.get('select#death_select3')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'death')
                                .within(() => {
                                    cy.get('option').should('have.length', 5);
                                    cy.get('option').eq(0).should('contain.text', 'Alive');
                                    cy.get('option').eq(1).should('contain.text', 'Unknown');
                                    cy.get('option').eq(2).should('contain.text', 'Died');
                                    cy.get('option').eq(3).should('contain.text', 'Dead as an infant');
                                    cy.get('option').eq(4).should('contain.text', 'May be dead');
                                });

                            cy.get('input[type="radio"][name="death_reason"]').should('have.length', 5);

                            cy.get('input#Killed')
                                .should('exist')
                                .and('have.value', 'Killed');
                            cy.get('label[for="Killed"]').should('contain.text', 'Killed');

                            cy.get('input#Murdered')
                                .should('exist')
                                .and('have.value', 'Murdered');
                            cy.get('label[for="Murdered"]').should('contain.text', 'Murdered');

                            cy.get('input#Executed')
                                .should('exist')
                                .and('have.value', 'Executed');
                            cy.get('label[for="Executed"]').should('contain.text', 'Executed');

                            cy.get('input#Disappeared')
                                .should('exist')
                                .and('have.value', 'Disappeared');
                            cy.get('label[for="Disappeared"]').should('contain.text', 'Disappeared');

                            cy.get('input#Unspecified')
                                .should('exist')
                                .and('have.value', 'Unspecified')
                                .and('be.checked');
                            cy.get('label[for="Unspecified"]').should('contain.text', 'Unspecified');
                        });
                });
        });

        it("should contain a visible input field for Death Place", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            cy.get('label[for="e_place3"]')
                                .should('exist')
                                .and('contain.text', 'Place');

                            cy.get('input#e_place3')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_place3')
                                .and('have.attr', 'type', 'text')
                                .and('have.attr', 'maxlength', '200')
                                .and('have.attr', 'placeholder', 'Place')
                                .and('have.value', 'Stamford, Fairfield, Connecticut, United States of America');

                            cy.get('i.fas.fa-xmark.clear-button-icon')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'title', 'Clear the input');

                            cy.get('span.floating-placeholder')
                                .should('exist')
                                .and('contain.text', 'Place');
                        });
                });
        });

        it("should display correctly structured Date fields for Death section", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(6)
                        .within(() => {

                            cy.get('.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Date');

                            cy.get('input[name="e_date3_mm"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.value', '4')
                                .and('have.attr', 'maxlength', '2')
                                .and('have.attr', 'placeholder', '\u00A0')
                                .and('have.attr', 'pattern')
                                .and('match', /0?\[?1-9]|1[0-2]/);

                            cy.get('span')
                                .contains('month')
                                .should('be.visible');

                            cy.get('input[name="e_date3_dd"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.value', '14')
                                .and('have.attr', 'maxlength', '2')
                                .and('have.attr', 'pattern', '(?:0?[1-9]|1[0-9]|2[0-9]|3[0-1])');

                            cy.get('span')
                                .contains('day')
                                .should('be.visible');

                            cy.get('input[name="e_date3_yyyy"]')
                                .should('exist')
                                .and('be.visible')
                                .and('have.value', '1905')
                                .and('have.attr', 'maxlength', '8')
                                .and('have.attr', 'pattern')
                                .and('include', '\\d');

                            cy.get('span')
                                .contains('year')
                                .should('be.visible');

                            cy.get('select#e_date3_prec')
                                .should('exist')
                                .and('be.visible')
                                .and('contain', 'exact')
                                .and('contain', 'about')
                                .and('contain', 'possibly')
                                .and('have.value', 'sure');

                            cy.get('select#e_date3_cal')
                                .should('exist')
                                .and('be.visible')
                                .and('contain', 'Gregorian')
                                .and('contain', 'Julian')
                                .and('contain', 'French republican')
                                .and('have.value', 'G');
                        });
                });
        });

        it("should contain a visible textarea for Death Notes", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(8)
                        .within(() => {
                            cy.get('label[for="e_note3"]')
                                .should('exist')
                                .and('contain.text', 'Notes');

                            cy.get('textarea#e_note3')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_note3')
                                .and('have.attr', 'placeholder', 'Notes')
                                .and('have.attr', 'rows', '1');
                        });
                });
        });

        it("should contain a visible input for Death Source", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(9)
                        .within(() => {
                            cy.get('label[for="e_src3"]')
                                .should('exist')
                                .and('contain.text', 'Source');

                            cy.get('input#e_src3')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_src3')
                                .and('have.attr', 'placeholder', 'Source');
                        });
                });
        });

        it("should contain a select input and add button for Death witnesses", () => {
            cy.get('div.card-body')
                .eq(3)
                .within(() => {
                    cy.get('div.row')
                        .eq(10)
                        .within(() => {
                            cy.get('label[for="e3_ins_witn0_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#e3_ins_witn0_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e3_ins_witn0_n');

                            cy.get('input[type="checkbox"][name="e3_ins_witn0"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add witness(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });
    });

    context("Burial Section", () => {
        it("should display the Burial card header", () => {
            cy.get("div.card").eq(4)
                .within(() => {
                    cy.get("h3#burial")
                        .should("exist")
                        .and("contain.text", "Burial");
                });
        });

        it("should contain a select input for Burial type", () => {
            cy.get('div.card-body')
                .eq(4)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            cy.get('label[for="buri_select4"]')
                                .should('exist')
                                .and('contain.text', 'Type');

                            cy.get('select#buri_select4')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'onchange', "change_buri('4')");

                            cy.get('select#buri_select4 option')
                                .should('have.length', 3)
                                .then((options) => {
                                    expect(options[0].value).to.eq('');
                                    expect(options[1].value).to.eq('#buri');
                                    expect(options[2].value).to.eq('#crem');
                                });

                            cy.get('select#buri_select4 option:selected')
                                .should('have.value', '#buri');
                        });
                });
        });

        it("should contain an input for Burial place", () => {
            cy.get('div.card-body')
                .eq(4)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            cy.get('label[for="e_place4"]')
                                .should('exist')
                                .and('contain.text', 'Place');

                            cy.get('input#e_place4')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_place4')
                                .and('have.attr', 'maxlength', '200')
                                .and('have.attr', 'placeholder', 'Place')
                                .and('have.attr', 'list', 'datalist_places')
                                .and('have.attr', 'data-book', 'place');
                        });
                });
        });

        it("should contain a textarea for Burial notes", () => {
            cy.get('div.card-body')
                .eq(4)
                .within(() => {
                    cy.get('div.row')
                        .eq(8)
                        .within(() => {
                            cy.get('label[for="e_note4"]')
                                .should('exist')
                                .and('contain.text', 'Notes');

                            cy.get('textarea#e_note4')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_note4')
                                .and('have.attr', 'placeholder', 'Notes');
                        });
                });
        });

        it("should contain an input for Burial source", () => {
            cy.get('div.card-body')
                .eq(4)
                .within(() => {
                    cy.get('div.row')
                        .eq(9)
                        .within(() => {
                            cy.get('label[for="e_src4"]')
                                .should('exist')
                                .and('contain.text', 'Source');

                            cy.get('input#e_src4')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_src4')
                                .and('have.attr', 'placeholder', 'Source');
                        });
                });
        });

        it("should contain a select input and add button for Burial witnesses", () => {
            cy.get('div.card-body')
                .eq(4)
                .within(() => {
                    cy.get('div.row')
                        .eq(10)
                        .within(() => {
                            cy.get('label[for="e4_ins_witn0_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#e4_ins_witn0_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e4_ins_witn0_n');

                            cy.get('input[type="checkbox"][name="e4_ins_witn0"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add witness(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });
    });

    context("Events section tests", () => {
        it("should contain the Events header", () => {
            cy.get('div.card')
                .eq(5)
                .within(() => {
                    cy.get('h3.card-header#events')
                        .should('exist')
                        .and('be.visible')
                        .and('contain.text', 'Events');
                });
        });

        it("should contain the Event select input and text input", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(0)
                        .within(() => {
                            cy.get('label[for="pevent_select2"]')
                                .should('exist')
                                .and('contain.text', 'Event');

                            cy.get('select#pevent_select2')
                                .should('exist')
                                .and('be.visible')
                                .and('have.class', 'form-control')
                                .and('have.value', '#resi');

                            cy.get('input#e_name2')
                                .should('exist')
                                .and('have.value', '#resi')
                                .and('have.attr', 'placeholder', 'Event');
                        });
                });
        });

        it("should contain the Place text input", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(1)
                        .within(() => {
                            // Vérifie le label
                            cy.get('label[for="e_place2"]')
                                .should('exist')
                                .and('contain.text', 'Place');

                            // Vérifie l'input texte
                            cy.get('input#e_place2')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e_place2')
                                .and('have.attr', 'placeholder', 'Place');
                        });
                });
        });

        it("should contain the Date inputs and select elements", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(2)
                        .within(() => {
                            cy.get('div.col-sm-1.col-md-2.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Date');

                            cy.get('input[name="e_date2_mm"]')
                                .should('exist')
                                .and('have.attr', 'placeholder', '\u00A0');

                            cy.get('input[name="e_date2_dd"]')
                                .should('exist')
                                .and('have.attr', 'placeholder', '\u00A0');

                            cy.get('input[name="e_date2_yyyy"]')
                                .should('exist')
                                .and('have.value', '1900')
                                .and('have.attr', 'placeholder', '\u00A0');

                            cy.get('select#e_date2_prec')
                                .should('exist')
                                .and('have.value', 'yearint');

                            cy.get('select#e_date2_cal')
                                .should('exist')
                                .and('have.value', 'G');
                        });
                });
        });

        it("should contain the Notes textarea input", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            cy.get('label[for="e_note2"]')
                                .should('exist')
                                .and('contain.text', 'Notes');

                            cy.get('textarea#e_note2')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Notes')
                                .and('have.attr', 'rows', '1');
                        });
                });
        });

        it("should contain the Source input", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            cy.get('label[for="e_src2"]')
                                .should('exist')
                                .and('contain.text', 'Source');

                            cy.get('input#e_src2')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Source')
                                .and('have.class', 'form-control');
                        });
                });
        });

        it("should contain a select input and add button for witnesses", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(6)
                        .within(() => {
                            cy.get('label[for="e2_ins_witn0_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#e2_ins_witn0_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'e2_ins_witn0_n');

                            cy.get('input[type="checkbox"][name="e2_ins_witn0"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add witness(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });

        it("should contain a select input and add button for events", () => {
            cy.get('div.card-body')
                .eq(5)
                .within(() => {
                    cy.get('div.row')
                        .eq(7)
                        .within(() => {
                            cy.get('label[for="ins_event6_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#ins_event6_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 'ins_event6_n');

                            cy.get('input[type="checkbox"][name="ins_event6"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add event(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });
    });

    context("Relationships section tests", () => {
        it("should contain the Relationships header", () => {
            cy.get('div.card')
                .eq(6)
                .within(() => {
                    cy.get('h3#relations')
                        .should('exist')
                        .and('contain.text', 'Relationships')
                        .and('be.visible');
                });
        });

        it("should contain the Add relationship select and button", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(0)
                        .within(() => {
                            cy.get('span.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('label.btn-outline-primary')
                                .should('exist')
                                .and('contain.text', '1 relationship');

                            cy.get('input[type="checkbox"][name="add_relation0"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add relationship"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });

        it("should contain the Relationship 1 select input", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(1)
                        .within(() => {
                            cy.get('label[for="r1_type"]')
                                .should('exist')
                                .and('contain.text', 'Relationship 1');

                            cy.get('select#r1_type')
                                .should('exist')
                                .and('be.visible')
                                .and('have.class', 'form-control')
                                .and('have.value', 'Undef');
                        });
                });
        });

        it("should contain the Relationship 1 first name, number and link/create select inputs", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(2)
                        .within(() => {
                            // Vérifie le label et l'input du first name
                            cy.get('label[for="r1_fath_fn"]')
                                .should('exist')
                                .and('contain.text', 'First name');

                            cy.get('input#r1_fath_fn')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'First name')
                                .and('have.value', '');

                            // Vérifie le label et l'input number
                            cy.get('label[for="r1_fath_occ"]')
                                .should('exist')
                                .and('contain.text', 'Number');

                            cy.get('input#r1_fath_occ')
                                .should('exist')
                                .and('have.value', '0')
                                .and('have.attr', 'type', 'number');

                            // Vérifie le select link/create
                            cy.get('select#r1_fath_p_selct')
                                .should('exist')
                                .and('have.value', 'create');
                        });
                });
        });

        it("should contain the Relationship 1 surname input", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(3)
                        .within(() => {
                            // Vérifie le label et l'input du surname
                            cy.get('label[for="r1_fath_sn"]')
                                .should('exist')
                                .and('contain.text', 'Surname');

                            cy.get('input#r1_fath_sn')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Surname')
                                .and('have.value', '');

                            // Vérifie la présence du label "(Him)"
                            cy.get('div.col-1.col-form-label')
                                .should('exist')
                                .and('contain.text', '(Him)');
                        });
                });
        });

        it("should contain the Relationship 1 occupation input and checkboxes", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(4)
                        .within(() => {
                            // Vérifie le label et l'input de l'occupation
                            cy.get('label[for="r1_fath_occu"]')
                                .should('exist')
                                .and('contain.text', 'Occupation');

                            cy.get('input#r1_fath_occu')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Occupation')
                                .and('have.value', '');

                            // Vérifie la checkbox "May be dead"
                            cy.get('input#r1_fath_od')
                                .should('exist')
                                .and('have.attr', 'type', 'checkbox');

                            cy.get('label[for="r1_fath_od"]')
                                .should('exist')
                                .and('contain.text', 'May be dead');

                            // Vérifie la checkbox "Public"
                            cy.get('input#r1_fath_pub')
                                .should('exist')
                                .and('have.attr', 'type', 'checkbox');

                            cy.get('label[for="r1_fath_pub"]')
                                .should('exist')
                                .and('contain.text', 'Public');
                        });
                });
        });

        it("should contain the Relationship 1 mother first name, number and select input", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            // Vérifie le label et l'input du prénom
                            cy.get('label[for="r1_moth_fn"]')
                                .should('exist')
                                .and('contain.text', 'First name');

                            cy.get('input#r1_moth_fn')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'First name')
                                .and('have.value', '');

                            // Vérifie le label et l'input du numéro
                            cy.get('label[for="r1_moth_occ"]')
                                .should('exist')
                                .and('contain.text', 'Number');

                            cy.get('input#r1_moth_occ')
                                .should('exist')
                                .and('have.value', '0')
                                .and('have.attr', 'type', 'number');

                            // Vérifie le select pour l'action Link/Create
                            cy.get('select#r1_moth_p_selct')
                                .should('exist')
                                .and('have.value', 'create')
                                .and('have.class', 'form-control');
                        });
                });
        });

        it("should contain the Relationship 1 mother surname input", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(6)
                        .within(() => {
                            // Vérifie le label du surname
                            cy.get('label[for="r1_moth_sn"]')
                                .should('exist')
                                .and('contain.text', 'Surname');

                            // Vérifie l'input du surname
                            cy.get('input#r1_moth_sn')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Surname')
                                .and('have.value', '');

                            // Vérifie le label (Her)
                            cy.get('div.col-1.col-form-label')
                                .should('exist')
                                .and('contain.text', '(Her)');
                        });
                });
        });

        it("should contain the Relationship 1 mother occupation input and checkboxes", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(7)
                        .within(() => {
                            // Vérifie le label Occupation
                            cy.get('label[for="r1_moth_occu"]')
                                .should('exist')
                                .and('contain.text', 'Occupation');

                            // Vérifie l'input Occupation
                            cy.get('input#r1_moth_occu')
                                .should('exist')
                                .and('have.attr', 'placeholder', 'Occupation')
                                .and('have.value', '');

                            // Vérifie la checkbox "May be dead"
                            cy.get('input#r1_moth_od')
                                .should('exist')
                                .and('have.attr', 'type', 'checkbox');
                            cy.get('label[for="r1_moth_od"]')
                                .should('exist')
                                .and('contain.text', 'May be dead');

                            // Vérifie la checkbox "Public"
                            cy.get('input#r1_moth_pub')
                                .should('exist')
                                .and('have.attr', 'type', 'checkbox');
                            cy.get('label[for="r1_moth_pub"]')
                                .should('exist')
                                .and('contain.text', 'Public');
                        });
                });
        });

        it("should contain the Add relationship 1 button group", () => {
            cy.get('div.card-body')
                .eq(6)
                .within(() => {
                    cy.get('div.row')
                        .eq(8)
                        .within(() => {
                            // Vérifie le label "Add"
                            cy.get('span.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Add');

                            // Vérifie le label avec la checkbox
                            cy.get('label.btn')
                                .should('exist')
                                .and('contain.text', '1 relationship');
                            cy.get('input[type="checkbox"][name="add_relation1"]')
                                .should('exist')
                                .and('be.visible');

                            // Vérifie le bouton OK
                            cy.get('button[title="Add relationship"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });
    });

    context("Titles section tests", () => {
        it("should contain the Titles header", () => {
            cy.get('div.card')
                .eq(7)
                .within(() => {
                    cy.get('h3#titles')
                        .should('exist')
                        .and('contain.text', 'Titles');
                });
        });

        it("should contain the Title select input and add button", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(0)
                        .within(() => {
                            cy.get('label[for="ins_title0_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#ins_title0_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.class', 'form-control')
                                .and('have.attr', 'name', 'ins_title0_n');

                            cy.get('input[type="checkbox"][name="ins_title0"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('button[title="Add title(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });

        it("should contain the Title and Fief input fields", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(1)
                        .within(() => {
                            // Vérifie le label Title
                            cy.get('label[for="t_ident1"]')
                                .should('exist')
                                .and('contain.text', 'Title');

                            // Vérifie l'input Title
                            cy.get('input#t_ident1')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 't_ident1')
                                .and('have.attr', 'placeholder', 'Title');

                            // Vérifie le label Fief
                            cy.get('label[for="t_place1"]')
                                .should('exist')
                                .and('contain.text', 'Fief');

                            // Vérifie l'input Fief
                            cy.get('input#t_place1')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 't_place1')
                                .and('have.attr', 'placeholder', 'Fief');
                        });
                });
        });

        it("should contain the Name, Rank input fields and Main title checkbox", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(2)
                        .within(() => {
                            // Vérifie le label Name
                            cy.get('label[for="t_name1"]')
                                .should('exist')
                                .and('contain.text', 'Name');

                            // Vérifie l'input Name
                            cy.get('input#t_name1')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 't_name1')
                                .and('have.attr', 'placeholder', 'Name');

                            // Vérifie le label Rank
                            cy.get('label[for="t_nth1"]')
                                .should('exist')
                                .and('contain.text', 'Rank');

                            // Vérifie l'input Rank
                            cy.get('input#t_nth1')
                                .should('exist')
                                .and('be.visible')
                                .and('have.attr', 'name', 't_nth1')
                                .and('have.attr', 'placeholder', '#');

                            // Vérifie le checkbox Main title
                            cy.get('input#maintitle')
                                .should('exist')
                                .and('have.attr', 'name', 't_main_title1')
                                .and('have.attr', 'type', 'checkbox');

                            cy.get('label[for="maintitle"]')
                                .should('exist')
                                .and('contain.text', 'Main title');
                        });
                });
        });

        it("should contain the Start Date inputs, precision and calendar selects", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(3)
                        .within(() => {
                            cy.get('.col-form-label')
                                .should('exist')
                                .and('contain.text', 'Begin');

                            cy.get('input[name="t_date_start1_mm"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('input[name="t_date_start1_dd"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('input[name="t_date_start1_yyyy"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('select#t_date_start1_prec')
                                .should('exist')
                                .and('have.value', 'sure');

                            cy.get('select#t_date_start1_cal')
                                .should('exist')
                                .and('have.value', '');
                        });
                });
        });

        it("should contain the End Date inputs, precision and calendar selects", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(5)
                        .within(() => {
                            cy.get('.col-form-label')
                                .should('exist')
                                .and('contain.text', 'End');

                            cy.get('input[name="t_date_end1_mm"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('input[name="t_date_end1_dd"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('input[name="t_date_end1_yyyy"]')
                                .should('exist')
                                .and('be.visible');

                            cy.get('select#t_date_end1_prec')
                                .should('exist')
                                .and('have.value', 'sure');

                            cy.get('select#t_date_end1_cal')
                                .should('exist')
                                .and('have.value', '');
                        });
                });
        });

        it("should contain the Add Title select, checkbox and OK button", () => {
            cy.get('div.card-body')
                .eq(7)
                .within(() => {
                    cy.get('div.row')
                        .eq(7)
                        .within(() => {
                            cy.get('label[for="ins_title1_n"]')
                                .should('exist')
                                .and('contain.text', 'Add');

                            cy.get('select#ins_title1_n')
                                .should('exist')
                                .and('be.visible')
                                .and('have.class', 'form-control');

                            cy.get('input[name="ins_title1"]')
                                .should('exist')
                                .and('have.attr', 'type', 'checkbox');

                            cy.get('button[title="Add title(s)"]')
                                .should('exist')
                                .and('be.visible');
                        });
                });
        });
    });

    context("Notes section tests", () => {
        it("should contain the Notes header", () => {
            cy.get('div.card')
                .eq(8)
                .within(() => {
                    cy.get('h3#notes')
                        .should('exist')
                        .and('have.class', 'card-header')
                        .and('contain.text', 'Notes');
                });
        });

        it("should have the toolbar container", () => {
            cy.get('div.card')
                .eq(8)
                .within(() => {
                    cy.get('div.d-inline-flex.flex-column')
                        .should('exist');
                });
        });

        it("should have the notes textarea", () => {
            cy.get('div.card')
                .eq(8)
                .within(() => {
                    cy.get('textarea#notes_comments')
                        .should('exist')
                        .and('have.class', 'form-control')
                        .and('have.attr', 'name', 'notes');
                });
        });

        it("should have the submit button", () => {
            cy.get('div.card')
                .eq(8)
                .within(() => {
                    cy.get('textarea#notes_comments')
                        .parent()
                        .find('button[type="submit"]')
                        .should('exist')
                        .and('contain.text', 'Submit');
                });
        });
    });



    context("Form interactions", () => {
    });

    context("Navigation bar", () => {
        it("should contain all navigation tabs", () => {
            const tabs = [
                "Individual",
                "Birth",
                "Baptism",
                "Death",
                "Burial",
                "Events",
                "Relationships",
                "Titles",
                "Notes",
            ];
            tabs.forEach((tab) => cy.get("#banner").contains(tab).should("exist"));
        });

        it("should allow opening the search modal", () => {
            cy.get('[data-target="#searchmodal"]').click();
            cy.get("#searchmodal").should("be.visible");
        });
    });

    context("Accessibility and consistency", () => {
        it("should have aria attributes and labels", () => {
            cy.get("label").should("exist");
            cy.get("[aria-hidden]").should("exist");
        });
    });
});
