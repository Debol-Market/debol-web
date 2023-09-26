describe("Main", () => {
  it("order", () => {
    cy.visit("/");
    cy.contains("School").click();
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
    cy.get("input.react-international-phone-input").first().type("946669787");
    cy.contains("Next", { timeout: 60000 }).click();
    cy.url().should("include", "checkout.stripe.com");
    cy.get("input#email", { timeout: 60000 }).type("test@email.com");
    cy.get("input#cardNumber").type("test@email.com");
    cy.get("input#email").type("4242424242424242");
    cy.get("input#cardExpiry").type("0326");
    cy.get("input#cardCvc").type("123");
    cy.get("input#billingName").type("False Name");
    cy.get('button[data-testid="hosted-payment-submit-button"]').click();
  });
});
