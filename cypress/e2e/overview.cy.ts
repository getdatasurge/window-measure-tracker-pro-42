
describe('Overview Page', () => {
  beforeEach(() => {
    // Visit the overview page before each test
    cy.visit('/overview');
  });

  it('renders correctly with key elements', () => {
    // Check that the main container exists
    cy.get('[data-testid="overview-page"]').should('exist');
    
    // Verify page title
    cy.get('[data-testid="overview-page"] h1').should('contain.text', 'Overview');
    
    // Check for login button
    cy.get('[data-testid="login-button"]').should('exist');
    
    // Verify all KPI cards are present
    cy.get('[data-testid="kpi-active-projects"]').should('exist');
    cy.get('[data-testid="kpi-upcoming-projects"]').should('exist');
    cy.get('[data-testid="kpi-windows-measured"]').should('exist');
    cy.get('[data-testid="kpi-pending-measurements"]').should('exist');
    
    // Check for placeholder sections
    cy.get('[data-testid="analytics-placeholder"]').should('exist');
    cy.get('[data-testid="team-activity-placeholder"]').should('exist');
    
    // Verify recent measurements section
    cy.get('[data-testid="recent-measurements"]').should('exist');
  });

  it('displays correct section titles', () => {
    // Check for section headings
    cy.get('[data-testid="analytics-placeholder"] h2').should('contain.text', 'Performance Analytics');
    cy.get('[data-testid="recent-measurements"] h2').should('contain.text', 'Recent Measurements');
  });

  it('handles responsive layout', () => {
    // Test on mobile viewport
    cy.viewport('iphone-6');
    cy.get('[data-testid="overview-page"]').should('exist');
    cy.get('[data-testid="kpi-active-projects"]').should('exist');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('[data-testid="overview-page"]').should('exist');
    cy.get('[data-testid="kpi-active-projects"]').should('exist');
    
    // Back to desktop viewport
    cy.viewport(1280, 800);
    cy.get('[data-testid="overview-page"]').should('exist');
    cy.get('[data-testid="kpi-active-projects"]').should('exist');
  });

  it('checks login button functionality', () => {
    cy.get('[data-testid="login-button"]').click();
    // Since we're not mocking auth yet, just verify it was clicked
    cy.get('[data-testid="login-button"]').should('exist');
    // In a future test with mocks, we would check for navigation to /projects
  });
});
