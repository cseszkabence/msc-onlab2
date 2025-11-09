// If your app fetches products on navigation, this stub prevents flaky network calls.
describe('Basic navigation', () => {
  it('opens the Products menu and navigates to a category', () => {
    // Intercept any product list calls to keep test hermetic. Adjust the pattern if needed.
    cy.intercept('GET', '**/api/**/products*', { statusCode: 200, body: { items: [] } }).as('getProducts');

    cy.visit('/');
    cy.findByRole('button', { name: /products/i }).click();

    // Assert a category like "Processors" is visible (adjust if your label differs)
    cy.findByRole('button', { name: /processors/i }).should('be.visible').click();

    // URL should include /products/
    cy.location('pathname').should('match', /\/products\//);
  });
});
