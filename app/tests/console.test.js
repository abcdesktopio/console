const fs = require('fs').promises;
const webdriver = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const options = new Chrome.Options();
options.addArguments('--headless', '--no-sandbox');
options.setBinaryPath('/opt/google/chrome/google-chrome');

// Récupération de l'URL via args
const args = process.argv.slice(2);
const urlArg = args.find(arg => arg.startsWith('--url='));
const URL = urlArg ? urlArg.split('=')[1] : null;

const SCREEN_DIR = './tests/screens/';
async function screenshot(driver, filename) {
  const img = await driver.takeScreenshot();
  await fs.writeFile(`${SCREEN_DIR}${filename}`, img, 'base64');
}

describe('console service front-end tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new webdriver.Builder()
      .forBrowser(webdriver.Browser.CHROME)
      .setChromeOptions(options)
      .build();
    await driver.manage().window().setRect({ width: 1400, height: 768 });
  }, 30000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // -------- CONNECTION --------
  describe('connection test', () => {
    it('connects to console', async () => {
      await driver.get(`${URL}/console`);
      // Optionnel : attendre un élément clé ou url confirmée
    });
  });

  // -------- DESKTOPS PAGE --------
  describe('console Desktops page tests', () => {
    it('shows the desktops toolbar', async () => {
      await driver.get(`${URL}/console`);
      
      const toolbar = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('toolbar')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(toolbar), 5000);
      
      expect(toolbar).toBeDefined();

      await screenshot(driver, 'desktops-page.png');
    });

    it('shows error toast if delete is clicked with no desktop selected', async () => {
      const deleteBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('delete-desktop-button')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(deleteBtn), 5000);
      await deleteBtn.click();

      const failureToast = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('toast-message')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(failureToast), 5000);

      const text = await failureToast.getText();
      expect(text).toBe('No desktop selected');

      await screenshot(driver, 'desktops-page-error-toast.png');
    });
  });

  // -------- APPLICATIONS PAGE --------
  describe('console Applications page tests', () => {
    it('shows the applications toolbar', async () => {
      await driver.get(`${URL}/console#/apps`);

      const toolbar = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('toolbar')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(toolbar), 5000);

      expect(toolbar).toBeDefined();

      await screenshot(driver, 'apps-page.png');
    });

    it('shows error toast if delete is clicked with no apps selected', async () => {
      const deleteBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('delete-app-button')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(deleteBtn), 5000);
      await deleteBtn.click();

      const failureToast = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('toast-message')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(failureToast), 5000);

      const text = await failureToast.getText();
      expect(text).toBe('No app selected');

      await screenshot(driver, 'apps-page-error-toast.png');
    });

    it('shows the Add App modal on add button click', async () => {
      const addButton = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('btn-primary')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(addButton), 5000);
      await addButton.click();

      const addAppModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('AddAppModal')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(addAppModal), 5000);

      const className = await addAppModal.getAttribute('class');
      expect(className.includes('show')).toBe(true);

      await screenshot(driver, 'apps-page-modal-open.png');
    });

    it('closes the Add App modal when close clicked', async () => {
      await new Promise(r => setTimeout(r, 1000));
      const closeBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('add-app-modal-close-button')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(closeBtn), 5000);
      await closeBtn.click();

      const addAppModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('AddAppModal')),
        10000
      );
      await driver.wait(webdriver.until.elementIsNotVisible(addAppModal), 10000);

      const className = await addAppModal.getAttribute('class');
      expect(className.includes('show')).toBe(false);

      await screenshot(driver, 'apps-page-modal-close.png');
    }, 11000);
  });

  // -------- BAN IP PAGE --------
  describe('console Ban IP page tests', () => {
    it('shows the banIp toolbar', async () => {
      await driver.get(`${URL}/console#/banIp`);

      const toolbar = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('toolbar')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(toolbar), 5000);

      expect(toolbar).toBeDefined();

      await screenshot(driver, 'banIP-page.png');
    });

    it('shows error toast if unban is clicked without selection', async () => {
      const unbanBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('delete-ban-ipaddr-button')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(unbanBtn), 5000);
      await unbanBtn.click();

      const failureToast = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('toast-message')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(failureToast), 5000);

      const text = await failureToast.getText();
      expect(text).toBe('Please select at least one IP to delete');

      await screenshot(driver, 'banIP-page-error-toast.png');
    });

    it('shows BanIp modal on add button click', async () => {
      const addButton = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('btn-primary')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(addButton), 5000);
      await addButton.click();

      const banIpModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('BanIpModal')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(banIpModal), 5000);

      const className = await banIpModal.getAttribute('class');
      expect(className.includes('show')).toBe(true);

      await screenshot(driver, 'banIP-page-modal-open.png');
    });

    it('closes BanIp modal when close clicked', async () => {
      await new Promise(r => setTimeout(r, 1000));
      const closeBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('close-ban-ip-modal')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(closeBtn), 5000);
      await closeBtn.click();

      const banIpModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('BanIpModal')),
        10000
      );
      await driver.wait(webdriver.until.elementIsNotVisible(banIpModal), 10000);

      const className = await banIpModal.getAttribute('class');
      expect(className.includes('show')).toBe(false);

      await screenshot(driver, 'banIP-page-modal-close.png');
    }, 11000);
  });

  // -------- BAN LOGIN PAGE --------
  describe('console Ban Login page tests', () => {
    it('shows the banLogin toolbar', async () => {
      await driver.get(`${URL}/console#/banLogin`);

      const toolbar = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('toolbar')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(toolbar), 5000);

      expect(toolbar).toBeDefined();

      await screenshot(driver, 'banLogin-page.png');
    });

    it('shows error toast if unban is clicked with no user selected', async () => {
      const unbanBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('delete-ban-login-button')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(unbanBtn), 5000);
      await unbanBtn.click();

      const failureToast = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('toast-message')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(failureToast), 5000);

      const text = await failureToast.getText();
      expect(text).toBe('Please select at least one Login to delete');

      await screenshot(driver, 'banLogin-page-error-toast.png');
    });

    it('shows BanLogin modal on add button click', async () => {
      const addButton = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.className('btn-primary')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(addButton), 5000);
      await addButton.click();

      const banLoginModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('BanLoginModal')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(banLoginModal), 5000);

      const className = await banLoginModal.getAttribute('class');
      expect(className.includes('show')).toBe(true);

      await screenshot(driver, 'banLogin-page-mdoal-open.png');
    });

    it('closes BanLogin modal when close clicked', async () => {
      await new Promise(r => setTimeout(r, 1000));
      const closeBtn = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('close-ban-login-modal')),
        5000
      );
      await driver.wait(webdriver.until.elementIsVisible(closeBtn), 5000);
      await closeBtn.click();

      const banLoginModal = await driver.wait(
        webdriver.until.elementLocated(webdriver.By.id('BanLoginModal')),
        10000
      );
      await driver.wait(webdriver.until.elementIsNotVisible(banLoginModal), 10000);

      const className = await banLoginModal.getAttribute('class');
      expect(className.includes('show')).toBe(false);

      await screenshot(driver, 'banLogin-page-modal-close.png');
    }, 11000);
  });
});