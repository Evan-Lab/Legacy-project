describe("Carrousel image management page (server)", () => {
  const base =
    Cypress.env("BASE_URL") ||
    Cypress.config("baseUrl") ||
    "http://localhost:2317";

  const genealogy = "555Sample";
  const pageUrl = `${base}/${genealogy}?m=SND_IMAGE_C&i=1`;

  beforeEach(() => {
    cy.visit(pageUrl);
  });

  it("displays the page title for adding/modifying portrait", () => {
    cy.get("h1.display-5").should("exist");
    cy.get("h1.display-5")
      .first()
      .invoke("text")
      .should("match", /(Add a portrait|Modify portrait)/i);
  });

  it("has the container div", () => {
    cy.get("div.container").should("exist");
  });

  it("displays two main columns layout", () => {
    cy.get("div.row div.col-6").should("have.length", 2);
  });

  it("displays the portrait upload form", () => {
    cy.get("form").should("exist");
    cy.get("input[type='file'].custom-portrait").should("exist");
  });

  it("has portrait file input with accept attribute", () => {
    cy.get("input#portrait_file.custom-portrait")
      .should("have.attr", "accept", "image/*")
      .and("have.attr", "type", "file");
  });

  it("portrait form has a submit button", () => {
    cy.get("button.snd-btn-portrait[type='submit']")
      .should("exist")
      .and("contain.text", "Upload");
  });

  it("portrait submit button is initially disabled", () => {
    cy.get("button.snd-btn-portrait").should("be.disabled");
  });

  it("displays the coat of arms (blason) section", () => {
    cy.contains("h1.display-5", /coat of arms/i).should("exist");
  });

  it("has blason file input", () => {
    cy.get("input[type='file'].custom-blason")
      .should("exist")
      .and("have.attr", "accept", "image/*");
  });

  it("blason form has a submit button", () => {
    cy.get("button.snd-btn-blason[type='submit']")
      .should("exist")
      .and("be.disabled");
  });

  it("displays the add image section", () => {
    cy.contains("h1.display-5", /Add.*image/i).should("exist");
  });

  it("has others/carrousel image file input", () => {
    cy.get("input#others_file.custom-others")
      .should("exist")
      .and("have.attr", "type", "file")
      .and("have.attr", "accept", "image/*");
  });

  it("has quick upload button for carrousel images", () => {
    cy.get("button.btn-quick-upload").should("exist").and("be.disabled");
  });

  it("has image URL input field", () => {
    cy.get("input#image_url[name='image_url']")
      .should("exist")
      .and("have.attr", "placeholder");
  });

  it("has image name input field", () => {
    cy.get("input#image_name[name='image_name']")
      .should("exist")
      .and("be.disabled");
  });

  it("has image note textarea", () => {
    cy.get("textarea#image_note[name='note']")
      .should("exist")
      .and("be.disabled");
  });

  it("has image source textarea", () => {
    cy.get("textarea#image_source[name='source']")
      .should("exist")
      .and("be.disabled");
  });

  it("has main submit button for image with note and source", () => {
    cy.get("button.submit-button[type='submit']")
      .should("exist")
      .and("be.disabled");
  });

  it("has cancel edit button (initially hidden)", () => {
    cy.get("button#btn-cancel-edit")
      .should("exist")
      .and("have.class", "d-none");
  });

  it("all forms have hidden inputs for mode", () => {
    cy.get("form input[name='m']").should("have.length.greaterThan", 0);
    cy.get("form input[name='i']").should("have.length.greaterThan", 0);
  });

  it("portrait form has correct hidden mode value", () => {
    cy.get("form input[name='mode'][value='portraits']").should("exist");
  });

  it("blason form has correct hidden mode value", () => {
    cy.get("form input[name='mode'][value='blasons']").should("exist");
  });

  it("carrousel form has correct hidden mode value", () => {
    cy.get("input#mode_2[value='carrousel']").should("exist");
  });

  it("has proper meta tags", () => {
    cy.get('meta[name="robots"]').should("have.attr", "content", "none");
    cy.get('meta[charset="UTF-8"]').should("exist");
    cy.get('meta[name="viewport"]').should(
      "have.attr",
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    );
  });

  it("verifies favicon is present", () => {
    cy.get('link[rel="shortcut icon"]').should("exist");
  });

  it("has file input labels with proper classes", () => {
    cy.get("label.custom-file-label").should("have.length.greaterThan", 0);
  });

  it("enables submit button when image URL is entered", () => {
    cy.get("input#image_url").type("https://example.com/image.jpg");

    cy.get("button.submit-button").should("not.be.disabled");
  });

  it("shows cancel button when URL is entered", () => {
    cy.get("input#image_url").type("https://example.com/image.jpg");
    cy.get("button#btn-cancel-edit").should("not.have.class", "d-none");
  });

  it("can type in note and source fields when URL is entered", () => {
    cy.get("input#image_url").type("https://example.com/image.jpg");

    cy.get("textarea#image_note").should("not.be.disabled");
    cy.get("textarea#image_source").should("not.be.disabled");

    cy.get("textarea#image_note").type("Test note");
    cy.get("textarea#image_note").should("have.value", "Test note");
  });

  it("cancel button resets the form", () => {
    cy.get("input#image_url").type("https://example.com/image.jpg");
    cy.get("textarea#image_note").type("Test note");

    cy.get("button#btn-cancel-edit").click();

    cy.get("input#image_url").should("have.value", "");
    cy.get("textarea#image_note").should("have.value", "").and("be.disabled");
    cy.get("button#btn-cancel-edit").should("have.class", "d-none");
  });

  it("has Bootstrap tooltips on info icons", () => {
    cy.get("abbr[data-toggle='tooltip']").should("exist");
  });

  it("has proper form encoding for file upload", () => {
    cy.get("form[enctype='multipart/form-data']").should(
      "have.length.greaterThan",
      0
    );
  });

  it("verifies body has id person", () => {
    cy.get("body#person").should("exist");
  });

  it("has custom file inputs with proper Bootstrap classes", () => {
    cy.get("div.custom-file").should("have.length.greaterThan", 0);
    cy.get("input.custom-file-input").should("have.length.greaterThan", 0);
  });

  it("image name field gets enabled when URL is entered", () => {
    cy.get("input#image_name").should("be.disabled");

    cy.get("input#image_url").type("https://example.com/photo.jpg");

    cy.get("input#image_name").should("not.be.disabled");
  });

  it("verifies multiple forms are present", () => {
    cy.get("form").should("have.length.greaterThan", 2);
  });

  it("has hidden file_name_2 input for carrousel", () => {
    cy.get("input#file_name_2[name='file_name_2']")
      .should("exist")
      .and("have.value", "");
  });

  it("displays proper button text on main submit", () => {
    cy.get("button.submit-button span#which_img_show").should("exist");
  });

  it("has proper layout with row and columns", () => {
    cy.get("div.row.mb-1").should("exist");
    cy.get("div.col-6.border").should("exist");
  });

  it("right column exists for displaying images", () => {
    cy.get("div.row div.col-6").eq(1).should("exist");
  });
});
