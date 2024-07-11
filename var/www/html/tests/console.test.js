const webdriver = require('selenium-webdriver');
const URL = "http://172.18.0.1:30443"; // replace by localhost to try it locally


describe('console service front-end tests', function(){
  var driver;
  
  beforeAll(async function(){
    driver =  await new webdriver.Builder().forBrowser(webdriver.Browser.CHROME).build();
  });

  afterAll(async function(){
    await driver.quit();
  });

  describe('connection test', function() {

    it("connect to console", function(){
      driver.get(`${URL}/console`);
    });

  });

  describe('console Desktops page tests', function(){

    it("desktops : API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("desktops : close API-KEY modal", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)
    
    it("desktops : table element is visible on the page", async function(){
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

    it("apps : API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console/apps.html`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("apps : close API-KEY modal", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)
    
    it("apps : table element is visible on the page", async function(){
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

    it("webfront : API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console/webfront.html`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("webfront : close API-KEY modal", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

    it("webfront : table element is visible on the page", async function(){
      let table = await driver.findElement(webdriver.By.className("table"));
      expect(table).not.toBeUndefined();
    })

    it("webfront : dock section should not be visible", async function(){
      let profileInfos = await driver.findElement(webdriver.By.id("profileInfos"));
      await profileInfos.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    })

  })

  describe('console Ban IP page tests', function(){

    it("banIp : API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console/banIp.html`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("banIp : close API-KEY modal", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

    it("banIp : table element is visible on the page", async function(){
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

    it("banLogin : API-KEY modal should be visible", async function(){
      await driver.get(`${URL}/console/banLogin.html`);
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.wait(webdriver.until.elementIsVisible(apiKeyModal), 2000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(true);
      });
    })

    it("banLogin : close API-KEY modal", async function(){
      await new Promise((r) => setTimeout(r, 1000));
      let apiKeyModal = await driver.findElement(webdriver.By.id("setApiKeyModal"));
      await driver.findElement(webdriver.By.id("close-api-key-modal")).click();
      await driver.wait(webdriver.until.elementIsNotVisible(apiKeyModal), 5000);
      await apiKeyModal.getAttribute("class").then(function(className){
        expect(className.includes("show")).toBe(false);
      });
    }, 10000)

    it("banLogin : table element is visible on the page", async function(){
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