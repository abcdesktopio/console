const webdriver = require('selenium-webdriver');
const URL = "https://localhost:30443";


describe('console service front-end tests', function(){
  var driver;
  
  beforeAll(async function(){
    driver =  await new webdriver.Builder().forBrowser('chrome').build();
  });

  afterAll(async function(){
    await driver.quit();
  });

  describe('connection tests', function() {

    it("connect to console", function(){
      driver.get(`${URL}/console`);
    });

    it("set API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
          expect(className.includes("show")).toBe(true);
      });
    })

    it("set API-KEY to make modal disappear", async function(){
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("set-api-key")).sendKeys("toto");
      await driver.findElement(webdriver.By.id("set-api-key-button")).click();
      await new Promise((r) => setTimeout(r, 1000));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
          expect(className.includes("show")).toBe(false);
      });
    }, 10000)

  });

  describe('console Desktops page tests', function(){
    
    it("desktops : table element is visible on the page", async function(){
      await driver.get(`${URL}/console`);
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

    it("desktops : click on delete no desktop selected, should display error modal", async function(){
      await driver.findElement(webdriver.By.id("delete-desktop-button")).click();
      let failureToastMessage = await driver.findElement(webdriver.By.id("toast-failure-message"));
      await driver.wait(webdriver.until.elementIsVisible(failureToastMessage), 2000);
      await failureToastMessage.getText().then(function(text){
        expect(text).toBe("Error, no desktop selected");
      });
    })

  });

  describe('console Applications page tests', function(){
    
    it("apps : table element is visible on the page", async function(){
      await driver.get(`${URL}/console/apps.html`);
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

    it("apps : click on delete but no apps selected, should display error modal", async function(){
      await driver.findElement(webdriver.By.id("delete-app-button")).click();
      let failureToastMessage = await driver.findElement(webdriver.By.id("toast-failure-message"));
      await driver.wait(webdriver.until.elementIsVisible(failureToastMessage), 2000);
      await failureToastMessage.getText().then(function(text){
        expect(text).toBe("Error, no apps selected");
      });
    })
    
    it("apps : click on add button, modal should appear", async function(){
      await driver.findElement(webdriver.By.className("btn-primary")).click();
      let addAppModal = await driver.findElement(webdriver.By.id("AddAppModal"));
      await driver.wait(webdriver.until.elementIsVisible(addAppModal), 2000);
      await addAppModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })
    
    it("apps : click on close button, modal should diseappear", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      await driver.findElement(webdriver.By.id("close-add-app-json-file")).click();
      let addAppModal = await driver.findElement(webdriver.By.id("AddAppModal"));
      await driver.wait(webdriver.until.elementIsNotVisible(addAppModal), 10000);
      await addAppModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

  });

  describe('console Webfront page tests', function(){

    it("webfront : table element is visible on the page", async function(){
      await driver.get(`${URL}/console/webfront.html`);
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

  })

  describe('console Ban IP page tests', function(){

    it("banIp : table element is visible on the page", async function(){
      await driver.get(`${URL}/console/banIp.html`);
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

    it("banIp : click on unban but no user selected, should display error modal", async function(){
      await driver.findElement(webdriver.By.id("unban-ip-button")).click();
      let failureToastMessage = await driver.findElement(webdriver.By.id("toast-failure-message"));
      await driver.wait(webdriver.until.elementIsVisible(failureToastMessage), 2000);
      await failureToastMessage.getText().then(function(text){
        expect(text).toBe("Error, no banned user selected");
      });
    })

    it("banIp : click on add button, modal should appear", async function(){
      await driver.findElement(webdriver.By.className("btn-primary")).click();
      let BanIpModal = await driver.findElement(webdriver.By.id("BanIpModal"));
      await driver.wait(webdriver.until.elementIsVisible(BanIpModal), 2000);
      await BanIpModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("banIp : click on close button, modal should diseappear", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      await driver.findElement(webdriver.By.id("close-ban-ip-modal")).click();
      let BanIpModal = await driver.findElement(webdriver.By.id("BanIpModal"));
      await driver.wait(webdriver.until.elementIsNotVisible(BanIpModal), 10000);
      await BanIpModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

  });

  describe('console Ban Login page tests', function(){

    it("banLogin : table element is visible on the page", async function(){
      await driver.get(`${URL}/console/banLogin.html`);
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

    it("banLogin : click on unban but no user selected, should display error modal", async function(){
      await driver.findElement(webdriver.By.id("unban-login-button")).click();
      let failureToastMessage = await driver.findElement(webdriver.By.id("toast-failure-message"));
      await driver.wait(webdriver.until.elementIsVisible(failureToastMessage), 2000);
      await failureToastMessage.getText().then(function(text){
        expect(text).toBe("Error, no banned user selected");
      });
    })

    it("banLogin : click on add button, modal should appear", async function(){
      await driver.findElement(webdriver.By.className("btn-primary")).click();
      let BanLoginModal = await driver.findElement(webdriver.By.id("BanLoginModal"));
      await driver.wait(webdriver.until.elementIsVisible(BanLoginModal), 2000);
      await BanLoginModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("banLogin : click on close button, modal should diseappear", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      await driver.findElement(webdriver.By.id("close-ban-login-modal")).click();
      let BanLoginModal = await driver.findElement(webdriver.By.id("BanLoginModal"));
      await driver.wait(webdriver.until.elementIsNotVisible(BanLoginModal), 10000);
      await BanLoginModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

  });
    
});