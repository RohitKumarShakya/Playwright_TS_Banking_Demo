import { test, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { STORAGE_STATE } from '../global-setup';

// Reuses the session saved by global-setup — no login in this file.
test.describe.serial('Home Page — Positive Test Cases', () => {

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ storageState: STORAGE_STATE });
    page = await context.newPage();
    await page.goto('Banking-Project-Demo.html');
  });

  test.afterAll(async () => {
    await context.close();
  });

  // TC_HOME_001 — Heading + welcome subtitle merged into one assertion
  test('TC_HOME_001 — Verify the heading and welcome subtitle of the Home Page', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyHeadingAndSubtitle();
  });

  // TC_HOME_003 — Transfers tab
  test('TC_HOME_003 — Verify the Transfers tab is visible on the Home Page', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyTransfersTabVisible();
  });

  // TC_HOME_004 — Bill Payments tab
  test('TC_HOME_004 — Verify the Bill Payments tab is visible on the Home Page', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyBillPaymentsTabVisible();
  });

  // TC_HOME_005 — Account Management nav link (split from original TC_HOME_005)
  test('TC_HOME_005 — Verify the left nav link Account Management is visible', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyAccountManagementLinkVisible();
  });

  // TC_HOME_006 — Quick Transactions nav link (split from original TC_HOME_005)
  test('TC_HOME_006 — Verify the left nav link Quick Transactions is visible', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyQuickTransactionsLinkVisible();
  });

  // TC_HOME_007 — Transaction History nav link (split from original TC_HOME_005)
  test('TC_HOME_007 — Verify the left nav link Transaction History is visible', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyTransactionHistoryLinkVisible();
  });

});
