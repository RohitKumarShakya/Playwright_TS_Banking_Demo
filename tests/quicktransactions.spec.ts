import { test, expect, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuickTransactionDepositPage } from '../pages/QuickTransactionDepositPage';
import { STORAGE_STATE } from '../global-setup';

// ── Test Data ────────────────────────────────────────────────────────────────
const TRANSACTION_TYPE        = 'Deposit';
const DEPOSIT_AMOUNT          = '1000';
const DEPOSIT_AMOUNT_FORMATTED = '$1000.00';
const DEPOSIT_DESCRIPTION     = 'Check Deposit Transaction Type';
const EXPECTED_SUCCESS_MSG    = 'Transaction Completed Successfully!';

// ── Suite ────────────────────────────────────────────────────────────────────
// Single browser session — global-setup login is reused, no re-login here.
// Tests run in strict sequence; each TC builds on the state left by the previous.
// Human-like pauses are embedded in QuickTransactionsPage methods.

test.describe.serial('Quick Transactions — Deposit Flow', () => {

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

  // ── TC_QT_001 — Navigate to Quick Transactions and verify section loads ───────
  test('TC_QT_001 — Verify the Quick Transactions section loads', async () => {
    const homePage              = new HomePage(page);
    const quickTransactionsPage = new QuickTransactionDepositPage(page);

    await homePage.goToQuickTransactions();
    await quickTransactionsPage.verifySectionLoaded();
  });

  // ── TC_QT_002 — Select Deposit as the Transaction Type ──────────────────────
  test('TC_QT_002 — Select Deposit as the Transaction Type', async () => {
    const quickTransactionsPage = new QuickTransactionDepositPage(page);
    await quickTransactionsPage.selectDepositTransactionType();
  });

  // ── TC_QT_003 — Enter 1000 in the Amount ($) field ──────────────────────────
  test('TC_QT_003 — Enter 1000 in the Amount ($) field', async () => {
    const quickTransactionsPage = new QuickTransactionDepositPage(page);
    await quickTransactionsPage.enterAmount(DEPOSIT_AMOUNT);
  });

  // ── TC_QT_004 — Enter description in the Description field ──────────────────
  test('TC_QT_004 — Enter description in the Description field', async () => {
    const quickTransactionsPage = new QuickTransactionDepositPage(page);
    await quickTransactionsPage.enterDescription(DEPOSIT_DESCRIPTION);
  });

  // ── TC_QT_005 — Submit and cross-check every field in the Confirmation Modal ─
  test('TC_QT_005 — Submit and cross-check Confirmation Modal fields', async () => {
    const quickTransactionsPage = new QuickTransactionDepositPage(page);

    // Submit the form
    await quickTransactionsPage.clickSubmit();
    await quickTransactionsPage.verifyConfirmationScreen();

    // Cross-check Transaction Type
    const confirmType = await quickTransactionsPage.getConfirmationTransactionType();
    console.log(`Confirmation — Transaction Type  : ${confirmType}`);
    expect(confirmType).toBe(TRANSACTION_TYPE);

    // Cross-check Amount
    const confirmAmount = await quickTransactionsPage.getConfirmationAmount();
    console.log(`Confirmation — Amount            : ${confirmAmount}`);
    expect(confirmAmount).toBe(DEPOSIT_AMOUNT_FORMATTED);

    // Cross-check Description
    const confirmDescription = await quickTransactionsPage.getConfirmationDescription();
    console.log(`Confirmation — Description       : ${confirmDescription}`);
    expect(confirmDescription).toBe(DEPOSIT_DESCRIPTION);

    // Capture New Balance After Transaction
    const newBalance = await quickTransactionsPage.getConfirmationNewBalance();
    console.log(`Confirmation — New Balance       : ${newBalance}`);
    expect(newBalance).toMatch(/^\$[\d,]+\.\d{2}$/);
  });

  // ── TC_QT_006 — Confirm and capture the full Success screen details ───────────
  test('TC_QT_006 — Confirm transaction and capture Success screen details', async () => {
    const quickTransactionsPage = new QuickTransactionDepositPage(page);

    // Confirm and verify success screen is shown
    await quickTransactionsPage.confirmTransaction();
    await quickTransactionsPage.verifySuccessScreen();

    // Capture and verify success message
    const successMsg = await quickTransactionsPage.getSuccessMessage();
    console.log(`Success — Message                : ${successMsg}`);
    expect(successMsg).toBe(EXPECTED_SUCCESS_MSG);

    // Capture and verify Transaction Reference
    const txnRef = await quickTransactionsPage.getTransactionReference();
    console.log(`Success — Transaction Reference  : ${txnRef}`);
    expect(txnRef).toMatch(/^TXN-\d+-\d+$/);

    // Capture Transaction Date & Time
    const txnDateTime = await quickTransactionsPage.getTransactionDateTime();
    console.log(`Success — Date & Time            : ${txnDateTime}`);
    expect(txnDateTime).toBeTruthy();

    // Final mapping — all captured values confirm a successful Deposit
    console.log('─'.repeat(55));
    console.log(`  DEPOSIT TRANSACTION COMPLETED SUCCESSFULLY`);
    console.log(`  Type      : ${await quickTransactionsPage.getSuccessTransactionType()}`);
    console.log(`  Amount    : ${await quickTransactionsPage.getSuccessAmount()}`);
    console.log(`  Reference : ${txnRef}`);
    console.log(`  DateTime  : ${txnDateTime}`);
    console.log('─'.repeat(55));
  });

});
