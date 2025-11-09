describe('Smoke', () => {
  it('shows site title and Products button', () => {
    cy.visit('/');
    cy.contains('PC PART PICKER').should('be.visible');
    cy.findByRole('button', { name: /products/i }).should('be.visible');
  });
});
