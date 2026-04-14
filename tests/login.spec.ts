import { test, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import config from '../config.json';

// login.spec.ts deliberately uses a FRESH browser context (no saved storageState)
// because it is testing the login mechanism itself.
test.describe.serial('Login Page — Positive Test Cases', () => {

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Fresh context — no storageState so the login page is unauthenticated
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test.afterAll(async () => {
    await context.close();
  });

  // P3 — Verify username field accepts input (page freshly opened on login)
  test('P3 — should accept and reflect the username in the username field', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.enterUsername(config.username);
    await loginPage.verifyUsernameValue(config.username);
  });

  // P4 — Verify password field accepts input (username already in field from P3)
  test('P4 — should accept and reflect the password in the password field', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.enterPassword(config.password);
    await loginPage.verifyPasswordValue(config.password);
  });

  // P1 — Full valid login (username + password already filled; fills again + selects app + clicks login)
  test('P1 — should redirect to Home page after valid login', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.login(config.username, config.password, config.appName);
    await loginPage.assertURL(/Banking-Project-Demo\.html/);
  });

  // P2 — Banking app loaded correctly (page already on Home after P1)
  test('P2 — should load the Banking application with correct app selection', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyPageLoaded();
  });

});
