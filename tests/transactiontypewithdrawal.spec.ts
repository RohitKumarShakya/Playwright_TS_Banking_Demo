import { test, expect, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuickTransactionWithdrawalPage } from '../pages/QuickTransactionWithdrawalPage';
import { STORAGE_STATE } from '../global-setup';

// ── Test Data ────────────────────────────────────────────────────────────────
const TRANSACTION_TYPE         = 'Withdrawal';
const WITHDRAWAL_AMOUNT        = '500';
const WITHDRAWAL_AMOUNT_FORMATTED = '$500.00';
const WITHDRAWAL_DESCRIPTION   = 'Withdrawal test Description';
const EXPECTED_SUCCESS_MSG     = 'Transaction Completed Successfully!';

// ── Suite ────────────────────────────────────────────────────────────────────
// Single browser session — global-setup login is reused, no re-login here.
// Tests run in strict sequence; each TC builds on the state left by the previous.
// Human-like pauses are embedded in QuickTransactionWithdrawalPage methods.

test.describe.serial('Quick Transactions — Withdrawal Flow', () => {

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

  // ── TC_WD_001 — Navigate to Quick Transactions and verify section loads ──────
  test('TC_WD_001 — Verify the Quick Transactions section loads', async () => {
    const homePage              = new HomePage(page);
    const withdrawalPage        = new QuickTransactionWithdrawalPage(page);

    await homePage.goToQuickTransactions();
    await withdrawalPage.verifySectionLoaded();
  });

  // ── TC_WD_002 — Select Withdrawal as the Transaction Type ───────────────────
  test('TC_WD_002 — Select Withdrawal as the Transaction Type', async () => {
    const withdrawalPage = new QuickTransactionWithdrawalPage(page);
    await withdrawalPage.selectWithdrawalTransactionType();
  });

  // ── TC_WD_003 — Enter 500 in the Amount ($) field ───────────────────────────
  test('TC_WD_003 — Enter 500 in the Amount ($) field', async () => {
    const withdrawalPage = new QuickTransactionWithdrawalPage(page);
    await withdrawalPage.enterAmount(WITHDRAWAL_AMOUNT);
  });

  // ── TC_WD_004 — Enter description in the Description field ──────────────────
  test('TC_WD_004 — Enter description in the Description field', async () => {
    const withdrawalPage = new QuickTransactionWithdrawalPage(page);
    await withdrawalPage.enterDescription(WITHDRAWAL_DESCRIPTION);
  });

  // ── TC_WD_005 — Submit and cross-check every field in the Confirmation Modal ─
  test('TC_WD_005 — Submit and cross-check Confirmation Modal fields', async () => {
    const withdrawalPage = new QuickTransactionWithdrawalPage(page);

    // Submit the form
    await withdrawalPage.clickSubmit();
    await withdrawalPage.verifyConfirmationScreen();

    // Cross-check Transaction Type
    const confirmType = await withdrawalPage.getConfirmationTransactionType();
    console.log(`Confirmation — Transaction Type  : ${confirmType}`);
    expect(confirmType).toBe(TRANSACTION_TYPE);

    // Cross-check Amount
    const confirmAmount = await withdrawalPage.getConfirmationAmount();
    console.log(`Confirmation — Amount            : ${confirmAmount}`);
    expect(confirmAmount).toBe(WITHDRAWAL_AMOUNT_FORMATTED);

    // Cross-check Description
    const confirmDescription = await withdrawalPage.getConfirmationDescription();
    console.log(`Confirmation — Description       : ${confirmDescription}`);
    expect(confirmDescription).toBe(WITHDRAWAL_DESCRIPTION);

    // Capture Current Balance Before Withdrawal
    const currentBalance = await withdrawalPage.getConfirmationCurrentBalance();
    console.log(`Confirmation — Current Balance   : ${currentBalance}`);
    expect(currentBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    // Capture New Balance After Withdrawal
    const newBalance = await withdrawalPage.getConfirmationNewBalance();
    console.log(`Confirmation — New Balance       : ${newBalance}`);
    expect(newBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    console.log('─'.repeat(55));
    console.log(`  WITHDRAWAL CONFIRMATION DETAILS`);
    console.log(`  Type            : ${confirmType}`);
    console.log(`  Amount          : ${confirmAmount}`);
    console.log(`  Description     : ${confirmDescription}`);
    console.log(`  Current Balance : ${currentBalance}`);
    console.log(`  New Balance     : ${newBalance}`);
    console.log('─'.repeat(55));
  });

  // ── TC_WD_006 — Confirm and capture the full Success screen details ───────────
  test('TC_WD_006 — Confirm transaction and capture Success screen details', async () => {
    const withdrawalPage = new QuickTransactionWithdrawalPage(page);

    // Confirm and verify success screen is shown
    await withdrawalPage.confirmTransaction();
    await withdrawalPage.verifySuccessScreen();

    // Capture and verify success message
    const successMsg = await withdrawalPage.getSuccessMessage();
    console.log(`Success — Message                : ${successMsg}`);
    expect(successMsg).toBe(EXPECTED_SUCCESS_MSG);

    // Capture and verify Transaction Reference
    const txnRef = await withdrawalPage.getTransactionReference();
    console.log(`Success — Transaction Reference  : ${txnRef}`);
    expect(txnRef).toMatch(/^TXN-\d+-\d+$/);

    // Capture Transaction Date & Time
    const txnDateTime = await withdrawalPage.getTransactionDateTime();
    console.log(`Success — Date & Time            : ${txnDateTime}`);
    expect(txnDateTime).toBeTruthy();

    // Final mapping — all captured values confirm a successful Withdrawal
    console.log('─'.repeat(55));
    console.log(`  WITHDRAWAL TRANSACTION COMPLETED SUCCESSFULLY`);
    console.log(`  Type      : ${await withdrawalPage.getSuccessTransactionType()}`);
    console.log(`  Amount    : ${await withdrawalPage.getSuccessAmount()}`);
    console.log(`  Reference : ${txnRef}`);
    console.log(`  DateTime  : ${txnDateTime}`);
    console.log('─'.repeat(55));
  });

});
