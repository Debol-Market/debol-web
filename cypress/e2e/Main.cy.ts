describe("Main", () => {
  it("order", () => {
    cy.visit("/");
    cy.wait(2000);
    cy.contains("School").click();
    cy.wait(2000);
    cy.logout();
    cy.url().should("include", "/basket");
    cy.contains("Add To Cart").click();
    cy.get("#cart-btn").click();
    cy.contains("Your Cart").should("be.visible");
    cy.contains("Checkout").click();
    cy.contains("You need to Register inorder to Checkout").should(
      "be.visible"
    );
    cy.login("WsD56Q8WNgekeUaO6WKlMU8u3ats");

    cy.contains("Enter Shipping Information").should("be.visible");

    cy.get('input[name="name"]').type("Name");
    cy.get("input.react-international-phone-input").type("946669787");
    cy.contains("Next").click();
  });
});
