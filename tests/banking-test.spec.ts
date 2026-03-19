import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { QuickTransactionPage } from '../pages/QuickTransactionPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import config from '../config.json';
import transferData from '../test-data/Transfer_TestData.json';

test('Verify Quick Transactions Flow', async ({ page }) => {
  // Initialise page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const quickTransactionPage = new QuickTransactionPage(page);
  const transactionHistoryPage = new TransactionHistoryPage(page);

  // ── Step 1: Open login page ──────────────────────────────────────────────
  await loginPage.open();

  // ── Step 2: Login with credentials and select Banking app ───────────────
  await loginPage.login(config.username, config.password, config.appName);

  // ── Step 3: Verify post-login state ─────────────────────────────────────
  // URL contains "Banking-Project-Demo.html", header and welcome text are visible
  await homePage.verifyPageLoaded();

  // ── Step 4: Navigate to Quick Transactions ───────────────────────────────
  await homePage.goToQuickTransactions();
  await quickTransactionPage.verifySectionLoaded();

  // ── Step 5: Submit a Transfer transaction ───────────────────────────────
  await quickTransactionPage.submitTransfer(transferData.amount, transferData.toAccount, transferData.description);

  // ── Step 6: Confirm the transaction ─────────────────────────────────────
  await quickTransactionPage.confirmTransaction();

  // ── Step 7: Capture Transaction Reference from success screen ───────────
  const txnRef = await quickTransactionPage.getTransactionReference();
  expect(txnRef).toMatch(/^TXN-/);
  console.log(`Transaction Reference captured: ${txnRef}`);

  // ── Step 8: View Transaction History and verify the reference ───────────
  await quickTransactionPage.clickViewHistory();
  await transactionHistoryPage.verifySectionLoaded();
  await transactionHistoryPage.verifyTransactionReference(txnRef);
});

test('Verify Tab Names in the Homepage', async ({ page }) => {
  // Initialise page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // ── Step 1: Open login page ──────────────────────────────────────────────
  await loginPage.open();

  // ── Step 2: Login with credentials from config ──────────────────────────
  await loginPage.login(config.username, config.password, config.appName);

  // ── Step 3: Verify home page loaded successfully ─────────────────────────
  await homePage.verifyPageLoaded();

  // ── Step 4: Verify Transfers & Bill Payments tabs are visible ────────────
  await homePage.verifyTabsVisible();
});
