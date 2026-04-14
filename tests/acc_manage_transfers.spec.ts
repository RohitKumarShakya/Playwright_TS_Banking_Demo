import { test, expect, Page, BrowserContext } from '@playwright/test';
import { AccManageTransfersPage } from '../pages/AccManageTransfersPage';
import { STORAGE_STATE } from '../global-setup';

// Reuses the session saved by global-setup — no login in this file.
// NOTE: These test cases cover the initial scope only.
// Full Account Management — Transfers test coverage will be added in subsequent iterations.

test.describe.serial('Account Management — Transfers', () => {

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

  // ── Visibility Tests ─────────────────────────────────────────────────────────

  // TC_AMT_001 — Verify the user is on the Transfers tab
  test('TC_AMT_001 — Verify the Transfers tab is visible on the Home Page', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    await accManageTransfersPage.verifyTransfersTabVisible();
  });

  // TC_AMT_002 — Verify the Account Management link is present in the left nav bar
  test('TC_AMT_002 — Verify the Account Management link is visible in the nav bar', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    await accManageTransfersPage.verifyAccountManagementNavLinkVisible();
  });

  // ── Field Capture & Print Tests ──────────────────────────────────────────────

  // TC_AMT_003 — Capture and print the Account Number
  test('TC_AMT_003 — Capture and print the Account Number', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    const accountNumber = await accManageTransfersPage.getAccountNumber();
    console.log(`Account Number : ${accountNumber}`);
    expect(accountNumber).toBeTruthy();
  });

  // TC_AMT_004 — Capture and print the Account Holder Name
  test('TC_AMT_004 — Capture and print the Account Holder Name', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    const accountHolderName = await accManageTransfersPage.getAccountHolderName();
    console.log(`Account Holder Name : ${accountHolderName}`);
    expect(accountHolderName).toBeTruthy();
  });

  // TC_AMT_005 — Capture and print the Account Type
  test('TC_AMT_005 — Capture and print the Account Type', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    const accountType = await accManageTransfersPage.getAccountType();
    console.log(`Account Type : ${accountType}`);
    expect(accountType).toBeTruthy();
  });

  // TC_AMT_006 — Capture and print the Account Balance
  test('TC_AMT_006 — Capture and print the Account Balance', async () => {
    const accManageTransfersPage = new AccManageTransfersPage(page);
    const accountBalance = await accManageTransfersPage.getAccountBalance();
    console.log(`Account Balance : ${accountBalance}`);
    expect(accountBalance).toMatch(/Balance: \$/);
  });

});
