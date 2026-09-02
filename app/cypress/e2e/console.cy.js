// -------- URL TESTS --------
describe('console URL tests', () => {
  it('visits console page', () => {
    cy.visit(`console`);
  });
});

// -------- DESKTOPS PAGE --------
describe('console Desktops page tests', () => {
    beforeEach(() => {
        cy.visit(`console`);
    });

    it('shows the desktops toolbar', () => {
        cy.get('.toolbar', { timeout: 10000 }).should('be.visible');
        cy.screenshot('desktops-page-toolbar');
    });

    // it('shows error toast if delete is clicked with no desktop selected', () => {
    //     cy.get('#delete-desktop-button', { timeout: 10000 })
    //       .should('be.visible')
    //       .click();
    //     cy.get('#toast-message', { timeout: 10000 })
    //       .should('be.visible')
    //       .and('contain', 'No desktop selected');
    //     cy.screenshot('desktops-page-error-toast');
    //   });
});

// -------- APPLICATIONS PAGE --------
describe('console Applications page tests', () => {
    beforeEach(() => {
        cy.visit(`console#/apps`);
    });

    it('shows the applications toolbar', () => {
        cy.get('.toolbar', { timeout: 10000 }).should('be.visible');
        cy.screenshot('apps-page-toolbar');
    });

    // it('shows error toast if delete is clicked with no app selected', () => {
    //     cy.get('#delete-app-button', { timeout: 10000 })
    //       .should('be.visible')
    //       .click();
    //     cy.get('#toast-message', { timeout: 10000 })
    //       .should('be.visible')
    //       .and('contain', 'No app selected');
    //     cy.screenshot('apps-page-error-toast');
    // });

    it('shows app store modal on add app button click', () => {
        cy.get('#add-app-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#AppStoreModal', { timeout: 10000 })
          .should('be.visible');
        cy.screenshot('apps-page-app-store-modal-opened');
    });

    it('closes app store modal on close button click', () => {
        cy.get('#add-app-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#AppStoreModal', { timeout: 10000 })
          .should('be.visible');
        cy.get('#app-store-modal-close-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#AppStoreModal', { timeout: 10000 })
          .should('not.exist');
    });

    it('shows add app json modal on json button click', () => {
      cy.get('#add-app-button', { timeout: 10000 })
        .should('be.visible')
        .click();
      cy.get('#AppStoreModal', { timeout: 10000 })
        .should('be.visible');
      cy.get('#add-app-json-modal-open-button', { timeout: 10000 })
        .should('be.visible')
        .click();
      cy.get('#AddAppJsonModal', { timeout: 10000 })
        .should('be.visible');
      cy.screenshot('apps-page-add-app-json-modal-opened');
  });

  it('closes add app json modal on close button click', () => {
    cy.get('#add-app-button', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('#AppStoreModal', { timeout: 10000 })
      .should('be.visible');
    cy.get('#add-app-json-modal-open-button', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('#AddAppJsonModal', { timeout: 10000 })
      .should('be.visible');
    cy.get('#add-app-json-modal-close-button', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('#AppStoreModal', { timeout: 10000 })
      .should('not.exist');
  });
});

// -------- BAN IP PAGE --------
describe('console Ban IP page tests', () => {
    beforeEach(() => {
        cy.visit(`console#/banIp`);
    });

    it('shows the ban IP toolbar', () => {
        cy.get('.toolbar', { timeout: 10000 }).should('be.visible');
        cy.screenshot('ban-ip-page-toolbar');
    });

    // it('shows error toast if unban is clicked with no IP selected', () => {
    //     cy.get('#delete-ban-IP-button', { timeout: 10000 })
    //       .should('be.visible')
    //       .click();
    //     cy.get('#toast-message', { timeout: 10000 })
    //       .should('be.visible')
    //       .and('contain', 'Please select at least one IP to delete');
    //     cy.screenshot('ban-ip-page-error-toast');
    // });

    it('shows ban IP modal on ban IP button click', () => {
        cy.get('#add-ban-IP-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanIpModal', { timeout: 10000 })
          .should('be.visible');
        cy.screenshot('ban-ip-page-ban-ip-modal-opened');
    });

    it('closes ban IP modal on close button click', () => {
        cy.get('#add-ban-IP-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanIpModal', { timeout: 10000 })
          .should('be.visible');
        cy.get('#close-ban-ip-modal', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanIpModal', { timeout: 10000 })
          .should('not.exist');
    });
});

// -------- BAN Login PAGE --------
describe('console Ban Login page tests', () => {
    beforeEach(() => {
        cy.visit(`console#/banLogin`);
    });

    it('shows the ban login toolbar', () => {
        cy.get('.toolbar', { timeout: 10000 }).should('be.visible');
        cy.screenshot('ban-login-page-toolbar');
    });

    // it('shows error toast if unban is clicked with no login selected', () => {
    //     cy.get('#delete-ban-Login-button', { timeout: 10000 })
    //       .should('be.visible')
    //       .click();
    //     cy.get('#toast-message', { timeout: 10000 })
    //       .should('be.visible')
    //       .and('contain', 'Please select at least one Login to delete');
    //     cy.screenshot('ban-login-page-error-toast');
    // });

    it('shows ban login modal on ban login button click', () => {
        cy.get('#add-ban-Login-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanLoginModal', { timeout: 10000 })
          .should('be.visible');
        cy.screenshot('ban-login-page-ban-login-modal-opened');
    });

    it('closes ban login modal on close button click', () => {
        cy.get('#add-ban-Login-button', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanLoginModal', { timeout: 10000 })
          .should('be.visible');
        cy.get('#close-ban-login-modal', { timeout: 10000 })
          .should('be.visible')
          .click();
        cy.get('#BanLoginModal', { timeout: 10000 })
          .should('not.exist');
    });
});