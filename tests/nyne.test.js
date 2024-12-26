// tests/nyne.test.js
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

let driver;
const APP_URL = "http://35.90.138.131";

describe("Nyne Application Tests", function () {
  this.timeout(30000);

  beforeEach(async function () {
    const options = new chrome.Options();
    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  afterEach(async function () {
    await driver.quit();
  });

  // Test 1: User Registration
  it("should successfully register a new user", async function () {
    await driver.get(`${APP_URL}/signup_page`);
    await driver.findElement(By.name("fname")).sendKeys("Test");
    await driver.findElement(By.name("lname")).sendKeys("User");
    await driver.findElement(By.name("email")).sendKeys(`test2@example.com`);
    await driver.findElement(By.name("password")).sendKeys("TestPassword123!");
    await driver.findElement(By.name("phone")).sendKeys("03345023055");
    await driver.findElement(By.name("location")).sendKeys("Rawalpindi");
    await driver.findElement(By.name("cname")).sendKeys("Test Company");
    await driver.findElement(By.name("job-role")).sendKeys("Tester");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains("/signup"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/signup"));
  });

  // Test 2: User Login
  it("should successfully login with valid credentials", async function () {
    await driver.get(`${APP_URL}/login_page`);
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("TestPassword123!");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains("/login"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/login"));
  });

  // Test 3: Profile Edit
  it("should successfully edit user's profile", async function () {
    await driver.get(`${APP_URL}/login_page`);
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("TestPassword123!");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/login"), 5000);

    await driver.get(`${APP_URL}/edit_profile`);
    await driver.wait(until.urlContains("/edit_profile"), 5000);

    const newValue = "03345062033";
    const phoneField = await driver.wait(
      until.elementLocated(By.name("phone")),
      10000,
      "Phone field not found"
    );
    console.log("Phone field found:", await phoneField.isDisplayed());
    await phoneField.clear();
    await phoneField.sendKeys(newValue);
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains("/user_dashboard"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/user_dashboard"));
  });

  // Test 4: View QR Code
  it("should display QR code for a card", async function () {
    await driver.get(`${APP_URL}/login_page`);
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("TestPassword123!");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/login"), 5000);

    await driver.get(`${APP_URL}/personal_card`);
    await driver.sleep(9000);
    const qrImage = await driver.findElement(By.css("svg"));

    assert(await qrImage.isDisplayed());
  });

  // Test 5: Admin Login
  it("should allow admin login and access to console", async function () {
    await driver.get(`${APP_URL}/admin_login`);
    await driver.findElement(By.name("admin_user")).sendKeys("admin@nyne");
    await driver.findElement(By.name("admin_pass")).sendKeys("secure");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains("/admin_dashboard"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/admin_dashboard"));
  });

  // Test 6: Invalid Login
  it("should show error message for invalid login", async function () {
    await driver.get(`${APP_URL}/login_page`);
    await driver.findElement(By.name("email")).sendKeys("wrong@example.com");
    await driver.findElement(By.name("password")).sendKeys("wrongpass");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains("/login"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/login"));
  });

  // Test 7 : Logout
  it("should successfully logout user", async function () {
    await driver.get(`${APP_URL}/login_page`);
    await driver.findElement(By.name("email")).sendKeys("test@example.com");
    await driver.findElement(By.name("password")).sendKeys("TestPassword123!");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/login"), 5000);

    await driver.sleep(7000);
    await driver.findElement(By.css('a[href="logout"]')).click();
    await driver.wait(until.urlContains("/login_page"), 5000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes("/login_page"));
  });
});
