import { test, expect, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuickTransactionPage } from '../pages/QuickTransactionPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { STORAGE_STATE } from '../global-setup';
import transferData from '../test-data/Transfer_TestData.json';

// Reuses the session saved by global-setup — no login in this file.
test.describe.serial('Banking — Core Flows', () => {

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ storageState: STORAGE_STATE });
    page = await context.newPage();
    await page.goto('Banking-Project-Demo.html');

    // Verify we have landed on the dashboard before any test begins
    const homePage = new HomePage(page);
    await homePage.verifyPageLoaded();
  });

  test.afterAll(async () => {
    await context.close();
  });

  // ── Test 1: Full Quick Transactions flow ─────────────────────────────────────
  test('Verify Quick Transactions Flow', async () => {
    const homePage = new HomePage(page);
    const quickTransactionPage = new QuickTransactionPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);

    // ── Step 1: Navigate to Quick Transactions ───────────────────────────────
    await homePage.goToQuickTransactions();
    await quickTransactionPage.verifySectionLoaded();

    // ── Step 2: Submit a Transfer transaction ───────────────────────────────
    await quickTransactionPage.submitTransfer(transferData.amount, transferData.toAccount, transferData.description);

    // ── Step 3: Confirm the transaction ─────────────────────────────────────
    await quickTransactionPage.confirmTransaction();

    // ── Step 4: Capture Transaction Reference from success screen ───────────
    const txnRef = await quickTransactionPage.getTransactionReference();
    expect(txnRef).toMatch(/^TXN-/);
    console.log(`Transaction Reference captured: ${txnRef}`);

    // ── Step 5: View Transaction History and verify the reference ───────────
    await quickTransactionPage.clickViewHistory();
    await transactionHistoryPage.verifySectionLoaded();
    await transactionHistoryPage.verifyTransactionReference(txnRef);
  });

  // ── Test 2: Verify Transfers & Bill Payments tabs ────────────────────────────
  // Continues on the same session — tabs are always visible in the top navigation
  test('Verify Tab Names in the Homepage', async () => {
    const homePage = new HomePage(page);
    await homePage.verifyTabsVisible();
  });

});
