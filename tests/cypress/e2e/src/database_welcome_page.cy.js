describe("Database welcome page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";
  const testDatabase = Cypress.env("TEST_DB") || "555Sample";

  beforeEach(() => {
    cy.visit(`${base}/?b=${testDatabase}`);
  });

  describe("Page structure and CSS classes", () => {
    it("has a container div with correct class", () => {
      cy.get("div.container").should("exist").and("have.class", "container");
    });

    it("displays the GeneWeb logo if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find('img[src*="gwlogo"]').length > 0) {
          cy.get('img[src*="gwlogo"]').should("exist").and("be.visible");
        } else if ($body.find('img[alt*="GeneWeb"]').length > 0) {
          cy.get('img[alt*="GeneWeb"]').should("exist").and("be.visible");
        }
      });
    });

    it("displays the main H1 heading", () => {
      cy.get("h1").should("exist").and("be.visible");
    });

    it("displays H2 heading if present", () => {
      cy.get("body").then(($body) => {
        if ($body.find("h2").length > 0) {
          cy.get("h2").should("be.visible").and("not.be.empty");
        }
      });
    });
  });

  describe("Navigation links", () => {
    it("has a link to Statistics page", () => {
      cy.get('a[href*="m=STAT"]').should("exist").and("be.visible");
    });

    it("navigates to Statistics page when clicked", () => {
      cy.get('a[href*="m=STAT"]').click();
      cy.url().should("include", "m=STAT");
    });

    it("has a link to Calendar page", () => {
      cy.get('a[href*="m=CAL"]').should("exist").and("be.visible");
    });

    it("navigates to Calendar page when clicked", () => {
      cy.get('a[href*="m=CAL"]').click();
      cy.url().should("include", "m=CAL");
    });

    it("has a link to Anniversaries page", () => {
      cy.get('a[href*="m=ANM"]').should("exist").and("be.visible");
    });

    it("navigates to Anniversaries page when clicked", () => {
      cy.get('a[href*="m=ANM"]').click();
      cy.url().should("include", "m=ANM");
    });

    it("has a link to First names page", () => {
      cy.get('a[href*="m=P"]').should("exist").and("be.visible");
    });

    it("has a link to Surnames page", () => {
      cy.get('a[href*="m=N"]').should("exist").and("be.visible");
    });

    it("navigates to First names page when clicked", () => {
      cy.get('a[href*="m=P"][href*="tri=A"]').first().click();
      cy.url().should("include", "m=P");
    });

    it("navigates to Surnames page when clicked", () => {
      cy.get('a[href*="m=N"][href*="tri=A"]').first().click();
      cy.url().should("include", "m=N");
    });
  });

  describe("Login form", () => {
    it("has a login form with correct class if auth is required", () => {
      cy.get("body").then(($body) => {
        if ($body.find("form.login").length > 0) {
          cy.get("form.login").should("exist").and("have.class", "login");

          cy.get('form.login input[name="w"][type="password"]').should("exist");
        }
      });
    });
  });

  describe("Place/Events search form", () => {
    it("has a form for searching by place and events if available", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="m"][value="PS"]').length > 0) {
          cy.get('input[name="m"][value="PS"]').should("exist");
        } else if ($body.find("form").length > 0) {
          cy.get("form").should("have.length.greaterThan", 0);
        }
      });
    });

    it("has checkboxes for birth, marriage, and death events", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bi"]').length > 0) {
          cy.get('input[name="bi"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="ma"]').length > 0) {
          cy.get('input[name="ma"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="de"]').length > 0) {
          cy.get('input[name="de"][type="checkbox"]')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }
      });
    });

    it("can check and uncheck the birth checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bi"]').length > 0) {
          cy.get('input[name="bi"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("can check and uncheck the marriage checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="ma"]').length > 0) {
          cy.get('input[name="ma"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("can check and uncheck the death checkbox", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="de"]').length > 0) {
          cy.get('input[name="de"]')
            .should("be.checked")
            .uncheck()
            .should("not.be.checked")
            .check()
            .should("be.checked");
        }
      });
    });

    it("has optional checkboxes for baptism and burial", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="bp"]').length > 0) {
          cy.get('input[name="bp"][type="checkbox"]').should("exist");
        }

        if ($body.find('input[name="bu"]').length > 0) {
          cy.get('input[name="bu"][type="checkbox"]').should("exist");
        }
      });
    });
  });

  describe("Wizard/Admin features", () => {
    it("may have a link to add a family if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
          cy.get('a[href*="m=ADD_FAM"]').should("exist").and("be.visible");
        }
      });
    });

    it("may have links to modify data (first names, surnames, places) if user is wizard", () => {
      cy.get("body").then(($body) => {
        if ($body.find('a[href*="m=MOD_DATA"]').length > 0) {
          cy.get('a[href*="m=MOD_DATA"]').should("exist");
        }
      });
    });
  });

  describe("Counter and statistics display", () => {
    it("may display access counter if enabled", () => {
      cy.get("body").then(($body) => {
        const hasCounter =
          $body.text().includes("accesses") ||
          $body.text().includes("consultations") ||
          $body.text().includes("访问");

        if (hasCounter) {
          cy.contains(/accesses|consultations|访问/).should("exist");
        }
      });
    });
  });

  describe("User search functionality with redirection", () => {
    const testUser = {
      fullname: "Mary Ann Wilson",
      firstname: "Mary Ann",
      surname: "Wilson",
    };

    it("has a search form with correct structure", () => {
      cy.get("form#main-search").should("exist");
      cy.get('input[name="pn"]#fullname').should("exist");
      cy.get('input[name="p"]#firstname').should("exist");
      cy.get('input[name="n"]#surname').should("exist");
    });

    it("searches by fullname and redirects to search results", () => {
      cy.get('input[name="pn"]#fullname')
        .should("be.visible")
        .clear()
        .type(testUser.fullname);

      cy.get("form#main-search").submit();

      cy.url().should("include", "m=S");
      cy.url().should("include", "pn=Mary+Ann+Wilson");
    });

    it("searches by firstname only and redirects correctly", () => {
      cy.get('input[name="p"]#firstname')
        .should("be.visible")
        .clear()
        .type(testUser.firstname);

      cy.get("form#main-search").submit();

      cy.url().should("include", "m=S");
      cy.url().should("include", "p=Mary+Ann");
    });

    it("searches by surname only and redirects correctly", () => {
      cy.get('input[name="n"]#surname')
        .should("be.visible")
        .clear()
        .type(testUser.surname);

      cy.get("form#main-search").submit();

      cy.url().should("include", "m=S");
      cy.url().should("include", `n=${testUser.surname}`);
    });

    it("searches by combined firstname and surname with redirection", () => {
      cy.get('input[name="p"]#firstname')
        .should("be.visible")
        .clear()
        .type(testUser.firstname);

      cy.get('input[name="n"]#surname')
        .should("be.visible")
        .clear()
        .type(testUser.surname);

      cy.get("form#main-search").submit();

      cy.url().should("include", "m=S");
      cy.url().should("include", "p=Mary+Ann");
      cy.url().should("include", `n=${testUser.surname}`);
    });

    it("can use the global search button to submit", () => {
      cy.get("body").then(($body) => {
        const hasGlobalSearch = $body.find("button#global-search").length > 0;
        const hasInlineSearch =
          $body.find("button#global-search-inline").length > 0;

        if (hasGlobalSearch || hasInlineSearch) {
          cy.get('input[name="pn"]#fullname')
            .should("be.visible")
            .clear()
            .type(testUser.fullname);

          if (hasGlobalSearch) {
            cy.get("button#global-search").click();
          } else {
            cy.get("button#global-search-inline").click();
          }

          cy.url().should("include", "m=S");
          cy.url().should("include", "pn=Mary+Ann+Wilson");
        }
      });
    });

    it("handles search with invalid user gracefully", () => {
      const invalidUser = "NonExistentUser123456";

      cy.get('input[name="pn"]#fullname')
        .should("be.visible")
        .clear()
        .type(invalidUser);

      cy.get("form#main-search").submit();

      cy.url().should("include", "m=S");
      cy.url().should("include", `pn=${invalidUser}`);

      cy.get("body").then(($body) => {
        const hasErrorAlert =
          $body.find(".alert-danger").length > 0 ||
          $body.text().includes("unknown") ||
          $body.text().includes("inconnu") ||
          $body.find('div[role="alert"]').length > 0;

        if (hasErrorAlert) {
          cy.get(".alert-danger, div[role='alert']").should("exist");
        }
      });
    });

    it("search options checkboxes work correctly", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="p_all"]#p_all').length > 0) {
          cy.get('input[name="p_all"]#p_all')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="p_order"]#p_order').length > 0) {
          cy.get('input[name="p_order"]#p_order')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }

        if ($body.find('input[name="p_exact"]#p_exact').length > 0) {
          cy.get('input[name="p_exact"]#p_exact')
            .should("exist")
            .and("have.attr", "type", "checkbox");
        }
      });
    });

    it("can perform search with search options enabled", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[name="p_exact"]#p_exact').length > 0) {
          cy.get('input[name="p_exact"]#p_exact').uncheck();

          cy.get('input[name="pn"]#fullname')
            .should("be.visible")
            .clear()
            .type(testUser.fullname);

          cy.get("form#main-search").submit();

          cy.url().should("include", "m=S");
          cy.url().should("include", "pn=Mary+Ann+Wilson");
        }
      });
    });
  });

  describe("Tools and navigation buttons", () => {
    beforeEach(() => {
      cy.visit(`${base}/?b=${testDatabase}`);
    });

    describe("Main navigation buttons", () => {
      it("has and clicks Statistics button", () => {
        cy.get('a[href*="m=STAT"]')
          .should("exist")
          .and("be.visible")
          .first()
          .click();

        cy.url().should("include", "m=STAT");
        cy.url().should("match", /555sample/i);
      });

      it("has and clicks Anniversaries button", () => {
        cy.get('a[href*="m=ANM"]')
          .should("exist")
          .and("be.visible")
          .first()
          .click();

        cy.url().should("include", "m=ANM");
        cy.url().should("match", /555sample/i);
      });

      it("has and clicks Calendar button", () => {
        cy.get('a[href*="m=CAL"]')
          .should("exist")
          .and("be.visible")
          .first()
          .click();

        cy.url().should("include", "m=CAL");
        cy.url().should("match", /555sample/i);
      });
    });

    describe("First names navigation", () => {
      it("has alphabetical sort button for first names", () => {
        cy.get('a[href*="m=P"][href*="tri=A"]')
          .should("exist")
          .and("be.visible");
      });

      it("clicks first names alphabetical sort and redirects correctly", () => {
        cy.get('a[href*="m=P"][href*="tri=A"]').first().click();

        cy.url().should("include", "m=P");
        cy.url().should("include", "tri=A");
      });

      it("has frequency sort button for first names if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=P"][href*="tri=F"]').length > 0) {
            cy.get('a[href*="m=P"][href*="tri=F"]')
              .should("exist")
              .and("be.visible");
          }
        });
      });

      it("clicks first names frequency sort if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=P"][href*="tri=F"]').length > 0) {
            cy.get('a[href*="m=P"][href*="tri=F"]').first().click();

            cy.url().should("include", "m=P");
            cy.url().should("include", "tri=F");
          }
        });
      });
    });

    describe("Surnames navigation", () => {
      it("has alphabetical sort button for surnames", () => {
        cy.get('a[href*="m=N"][href*="tri=A"]')
          .should("exist")
          .and("be.visible");
      });

      it("clicks surnames alphabetical sort and redirects correctly", () => {
        cy.get('a[href*="m=N"][href*="tri=A"]').first().click();

        cy.url().should("include", "m=N");
        cy.url().should("include", "tri=A");
      });

      it("has frequency sort button for surnames if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=N"][href*="tri=F"]').length > 0) {
            cy.get('a[href*="m=N"][href*="tri=F"]')
              .should("exist")
              .and("be.visible");
          }
        });
      });

      it("clicks surnames frequency sort if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=N"][href*="tri=F"]').length > 0) {
            cy.get('a[href*="m=N"][href*="tri=F"]').first().click();

            cy.url().should("include", "m=N");
            cy.url().should("include", "tri=F");
          }
        });
      });
    });

    describe("Conditional navigation buttons", () => {
      it("checks for and clicks Base notes button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=NOTES"]').length > 0) {
            cy.get('a[href*="m=NOTES"]')
              .first()
              .should("exist")
              .and("be.visible")
              .click();

            cy.url().should("include", "m=NOTES");
          }
        });
      });

      it("checks for and clicks Misc notes button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=MISC_NOTES"]').length > 0) {
            cy.get('a[href*="m=MISC_NOTES"]')
              .first()
              .should("exist")
              .and("be.visible")
              .click();

            cy.url().should("include", "m=MISC_NOTES");
          }
        });
      });

      it("checks for and clicks Place/Surnames button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=PPS"]').length > 0) {
            cy.get('a[href*="m=PPS"]')
              .first()
              .should("exist")
              .and("be.visible")
              .click();

            cy.url().should("include", "m=PPS");
          }
        });
      });

      it("checks for and clicks Advanced request button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=AS"]').length > 0) {
            cy.get('a[href*="m=AS"]')
              .first()
              .should("exist")
              .and("be.visible")
              .click();

            cy.url().should("include", "m=AS");
          }
        });
      });

      it("checks for and clicks History button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=HIST"]').length > 0) {
            cy.get('a[href*="m=HIST"]')
              .first()
              .should("exist")
              .and("be.visible")
              .click();

            cy.url().should("include", "m=HIST");
          }
        });
      });

      it("checks for random individual button if available", () => {
        cy.get("body").then(($body) => {
          const randomButton = $body.find('a[href*="i="][title*="random"]');
          if (randomButton.length > 0) {
            cy.get('a[href*="i="][title*="random"]')
              .should("exist")
              .and("be.visible");
          }
        });
      });
    });

    describe("Wizard/Admin buttons", () => {
      it("checks for Configuration button if user is wizard", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=H"][href*="v=conf"]').length > 0) {
            cy.get('a[href*="m=H"][href*="v=conf"]')
              .should("exist")
              .and("be.visible");
          }
        });
      });

      it("clicks Configuration button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=H"][href*="v=conf"]').length > 0) {
            cy.get('a[href*="m=H"][href*="v=conf"]').first().click();

            cy.url().should("include", "m=H");
            cy.url().should("include", "v=conf");
          }
        });
      });

      it("checks for Add note button if user is wizard", () => {
        cy.get("body").then(($body) => {
          if (
            $body.find('a[href*="m=MOD_NOTES"][href*="f=new_note"]').length > 0
          ) {
            cy.get('a[href*="m=MOD_NOTES"][href*="f=new_note"]')
              .should("exist")
              .and("be.visible");
          }
        });
      });

      it("clicks Add note button if available", () => {
        cy.get("body").then(($body) => {
          if (
            $body.find('a[href*="m=MOD_NOTES"][href*="f=new_note"]').length > 0
          ) {
            cy.get('a[href*="m=MOD_NOTES"][href*="f=new_note"]')
              .first()
              .click();

            cy.url().should("include", "m=MOD_NOTES");
            cy.url().should("include", "f=new_note");
          }
        });
      });

      it("checks for Add family button if user is wizard", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').should("exist").and("be.visible");
          }
        });
      });

      it("clicks Add family button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();

            cy.url().should("include", "m=ADD_FAM");
          }
        });
      });

      it("checks for Add base notes button if user is wizard", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=MOD_NOTES"]').length > 0) {
            const addBaseNotesButton = $body.find(
              'a[href*="m=MOD_NOTES"]:not([href*="f="])'
            );
            if (addBaseNotesButton.length > 0) {
              cy.get('a[href*="m=MOD_NOTES"]:not([href*="f="])').should(
                "exist"
              );
            }
          }
        });
      });

      it("checks for Modify data books buttons if user is wizard", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=MOD_DATA"]').length > 0) {
            cy.get('a[href*="m=MOD_DATA"]').should("exist");
          }
        });
      });

      it("clicks first Modify data button if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=MOD_DATA"]').length > 0) {
            cy.get('a[href*="m=MOD_DATA"]').first().click();

            cy.url().should("include", "m=MOD_DATA");
          }
        });
      });
    });

    describe("Title and Estate search", () => {
      it("checks for title search form if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find("form#title-search").length > 0) {
            cy.get("form#title-search").should("exist");
            cy.get('input[name="t"]#titles').should("exist");
          }
        });
      });

      it("checks for estate search input if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('input[name="p"]#estates').length > 0) {
            cy.get('input[name="p"]#estates').should("exist");
          }
        });
      });

      it("searches by title if form is available", () => {
        cy.get("body").then(($body) => {
          if ($body.find("form#title-search").length > 0) {
            cy.get('input[name="t"]#titles').should("be.visible").type("Duke");
            cy.get("body").then(($searchBody) => {
              const globalSearchBtn = $searchBody.find(
                "button#global-search:visible"
              );
              if (globalSearchBtn.length > 0) {
                cy.get("button#global-search").click();
              } else {
                cy.get("form#title-search").submit();
              }
            });

            cy.url().should("include", "m=TT");
          }
        });
      });

      it("has link to all titles if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=TT"]').length > 0) {
            cy.get('a[href*="m=TT"]').should("exist");
          }
        });
      });

      it("has link to all estates if available", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=TT"][href*="p=*"]').length > 0) {
            cy.get('a[href*="m=TT"][href*="p=*"]').should("exist");
          }
        });
      });
    });
  });

  describe("Add Family - Navigation and E2E workflow", () => {
    describe("Navigation to Add Family page", () => {
      it("can access Add Family from the welcome page", () => {
        cy.visit(`${base}/?b=${testDatabase}`);
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();
            cy.url().should("include", "m=ADD_FAM");
            cy.get("form#updfam").should("exist");
            cy.get("h1").should("be.visible").and("contain", "Add family");
          }
        });
      });

      it("Add Family button has correct icon and text", () => {
        cy.visit(`${base}/?b=${testDatabase}`);

        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]')
              .first()
              .should("have.class", "btn")
              .within(() => {
                cy.get("i.fa-user-plus").should("exist");
              });
          }
        });
      });
    });

    describe("End-to-end family creation with submission", () => {
      beforeEach(() => {
        cy.visit(`${base}/?b=${testDatabase}`);
      });

      it("can navigate from welcome to Add Family and create a complete family", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();
            cy.url().should("include", "m=ADD_FAM");
            const timestamp = Date.now();
            const father = {
              firstName: `TestFather${timestamp}`,
              lastName: `TestFamily${timestamp}`,
              occ: "0",
            };
            const mother = {
              firstName: `TestMother${timestamp}`,
              lastName: `TestFamily${timestamp}`,
              occ: "0",
            };
            cy.get('input[name="pa1_fn"]').clear().type(father.firstName);
            cy.get('input[name="pa1_sn"]').clear().type(father.lastName);
            cy.get('input[name="pa1_occ"]').clear().type(father.occ);
            cy.get('select[name="pa1_p"]').select("create");
            cy.get('input[name="pa2_fn"]').clear().type(mother.firstName);
            cy.get('input[name="pa2_sn"]').clear().type(mother.lastName);
            cy.get('input[name="pa2_occ"]').clear().type(mother.occ);
            cy.get('select[name="pa2_p"]').select("create");
            cy.get('input[name="pa1_fn"]').should(
              "have.value",
              father.firstName
            );
            cy.get('input[name="pa2_fn"]').should(
              "have.value",
              mother.firstName
            );
            cy.get('button[type="submit"].btn-lg').click();
            cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
          }
        });
      });

      it("can create family with marriage event from welcome page", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();
            cy.url().should("include", "m=ADD_FAM");
            const timestamp = Date.now();
            const familyName = `TestFamily${timestamp}`;
            cy.get('input[name="pa1_fn"]').clear().type(`Father${timestamp}`);
            cy.get('input[name="pa1_sn"]').clear().type(familyName);
            cy.get('select[name="pa1_p"]').select("create");

            cy.get('input[name="pa2_fn"]').clear().type(`Mother${timestamp}`);
            cy.get('input[name="pa2_sn"]').clear().type(familyName);
            cy.get('select[name="pa2_p"]').select("create");
            cy.get('a[href="#events"]').click();
            cy.url().should("include", "#events");
            cy.get('select[id^="fevent_select"]').first().select("#marr");
            cy.get('input[name^="e_place"]').first().type("Test City");
            cy.get('input[name*="_yyyy"]').first().type("2020");
            cy.get('textarea[name^="e_note"]')
              .first()
              .type("Test marriage event");
            cy.get('a[href="#comments"]').click();
            cy.get('button[type="submit"].btn-lg').click();
            cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
          }
        });
      });

      it("can create family with birth dates from welcome page", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();
            cy.url().should("include", "m=ADD_FAM");
            const timestamp = Date.now();
            cy.get('input[name="pa1_fn"]')
              .clear()
              .type(`TestPerson${timestamp}`);
            cy.get('input[name="pa1_sn"]')
              .clear()
              .type(`TestSurname${timestamp}`);
            cy.get('select[name="pa1_p"]').select("create");
            cy.get('input[name="pa1b_dd"]').clear().type("15");
            cy.get('input[name="pa1b_mm"]').clear().type("06");
            cy.get('input[name="pa1b_yyyy"]').clear().type("1980");
            cy.get('input[name="pa1b_pl"]').clear().type("Paris");
            cy.get('input[name="pa2_fn"]')
              .clear()
              .type(`TestPerson2${timestamp}`);
            cy.get('input[name="pa2_sn"]')
              .clear()
              .type(`TestSurname${timestamp}`);
            cy.get('select[name="pa2_p"]').select("create");
            cy.get('input[name="pa2b_dd"]').clear().type("20");
            cy.get('input[name="pa2b_mm"]').clear().type("09");
            cy.get('input[name="pa2b_yyyy"]').clear().type("1982");
            cy.get('input[name="pa2b_pl"]').clear().type("London");
            cy.get('input[name="pa1b_yyyy"]').should("have.value", "1980");
            cy.get('input[name="pa2b_yyyy"]').should("have.value", "1982");
            cy.get('button[type="submit"].btn-lg').click();
            cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
          }
        });
      });

      it("form submission from welcome redirects to appropriate page", () => {
        cy.get("body").then(($body) => {
          if ($body.find('a[href*="m=ADD_FAM"]').length > 0) {
            cy.get('a[href*="m=ADD_FAM"]').first().click();
            cy.url().should("include", "m=ADD_FAM");
            const timestamp = Date.now();
            cy.get('input[name="pa1_fn"]').clear().type(`Min1${timestamp}`);
            cy.get('input[name="pa1_sn"]')
              .clear()
              .type(`MinFamily${timestamp}`);
            cy.get('select[name="pa1_p"]').select("create");

            cy.get('input[name="pa2_fn"]').clear().type(`Min2${timestamp}`);
            cy.get('input[name="pa2_sn"]')
              .clear()
              .type(`MinFamily${timestamp}`);
            cy.get('select[name="pa2_p"]').select("create");
            cy.get('button[type="submit"].btn-lg').click();
            cy.url({ timeout: 10000 }).should("not.include", "m=ADD_FAM");
            cy.get("body").should("be.visible");
          }
        });
      });
    });
  });
});
