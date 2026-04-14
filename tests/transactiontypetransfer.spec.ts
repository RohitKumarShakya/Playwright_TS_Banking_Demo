import { test, expect, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuickTransactionTransferPage } from '../pages/QuickTransactionTransferPage';
import { STORAGE_STATE } from '../global-setup';

// ── Test Data ────────────────────────────────────────────────────────────────
const TRANSACTION_TYPE              = 'Transfer';
const TRANSFER_AMOUNT               = '800';
const TRANSFER_AMOUNT_FORMATTED     = '$800.00';
const TRANSFER_TO_ACCOUNT           = '12345';
const TRANSFER_DESCRIPTION          = 'Description of Tranfer type Transactions';
const EXPECTED_SUCCESS_MSG          = 'Transaction Completed Successfully!';

// ── Suite ────────────────────────────────────────────────────────────────────
// Single browser session — global-setup login is reused, no re-login here.
// Tests run in strict sequence; each TC builds on the state left by the previous.
// Human-like pauses are embedded in QuickTransactionTransferPage methods.
// "Transfer to Account" field (#transferAccount) is exclusive to Transfer type —
// it is hidden for Deposit and Withdrawal transaction types.

test.describe.serial('Quick Transactions — Transfer Flow', () => {

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

  // ── TC_TF_001 — Navigate to Quick Transactions and verify section loads ───────
  test('TC_TF_001 — Verify the Quick Transactions section loads', async () => {
    const homePage    = new HomePage(page);
    const transferPage = new QuickTransactionTransferPage(page);

    await homePage.goToQuickTransactions();
    await transferPage.verifySectionLoaded();
  });

  // ── TC_TF_002 — Select Transfer as the Transaction Type ──────────────────────
  test('TC_TF_002 — Select Transfer as the Transaction Type', async () => {
    const transferPage = new QuickTransactionTransferPage(page);
    await transferPage.selectTransferTransactionType();
  });

  // ── TC_TF_003 — Enter 800 in the Amount ($) field ────────────────────────────
  test('TC_TF_003 — Enter 800 in the Amount ($) field', async () => {
    const transferPage = new QuickTransactionTransferPage(page);
    await transferPage.enterAmount(TRANSFER_AMOUNT);
  });

  // ── TC_TF_004 — Enter destination account number in Transfer to Account field ─
  // This field (#transferAccount) is exclusive to Transfer type;
  // it is hidden for Deposit and Withdrawal forms.
  test('TC_TF_004 — Enter 12345 in the Transfer to Account field', async () => {
    const transferPage = new QuickTransactionTransferPage(page);
    await transferPage.enterTransferToAccount(TRANSFER_TO_ACCOUNT);
  });

  // ── TC_TF_005 — Enter description in the Description field ──────────────────
  test('TC_TF_005 — Enter description in the Description field', async () => {
    const transferPage = new QuickTransactionTransferPage(page);
    await transferPage.enterDescription(TRANSFER_DESCRIPTION);
  });

  // ── TC_TF_006 — Submit and cross-check every field in the Confirmation Modal ─
  test('TC_TF_006 — Submit and cross-check Confirmation Modal fields', async () => {
    const transferPage = new QuickTransactionTransferPage(page);

    // Submit the form
    await transferPage.clickSubmit();
    await transferPage.verifyConfirmationScreen();

    // Cross-check Transaction Type
    const confirmType = await transferPage.getConfirmationTransactionType();
    console.log(`Confirmation — Transaction Type  : ${confirmType}`);
    expect(confirmType).toBe(TRANSACTION_TYPE);

    // Cross-check Amount
    const confirmAmount = await transferPage.getConfirmationAmount();
    console.log(`Confirmation — Amount            : ${confirmAmount}`);
    expect(confirmAmount).toBe(TRANSFER_AMOUNT_FORMATTED);

    // Cross-check Transfer to Account (Transfer-exclusive field)
    const confirmTransferAccount = await transferPage.getConfirmationTransferAccount();
    console.log(`Confirmation — Transfer to Account: ${confirmTransferAccount}`);
    expect(confirmTransferAccount).toBe(TRANSFER_TO_ACCOUNT);

    // Cross-check Description
    const confirmDescription = await transferPage.getConfirmationDescription();
    console.log(`Confirmation — Description       : ${confirmDescription}`);
    expect(confirmDescription).toBe(TRANSFER_DESCRIPTION);

    // Capture Current Balance Before Transfer
    const currentBalance = await transferPage.getConfirmationCurrentBalance();
    console.log(`Confirmation — Current Balance   : ${currentBalance}`);
    expect(currentBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    // Capture New Balance After Transfer
    const newBalance = await transferPage.getConfirmationNewBalance();
    console.log(`Confirmation — New Balance       : ${newBalance}`);
    expect(newBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    console.log('─'.repeat(55));
    console.log(`  TRANSFER CONFIRMATION DETAILS`);
    console.log(`  Type               : ${confirmType}`);
    console.log(`  Amount             : ${confirmAmount}`);
    console.log(`  Transfer to Account: ${confirmTransferAccount}`);
    console.log(`  Description        : ${confirmDescription}`);
    console.log(`  Current Balance    : ${currentBalance}`);
    console.log(`  New Balance        : ${newBalance}`);
    console.log('─'.repeat(55));
  });

  // ── TC_TF_007 — Confirm and capture the full Success screen details ───────────
  test('TC_TF_007 — Confirm transaction and capture Success screen details', async () => {
    const transferPage = new QuickTransactionTransferPage(page);

    // Confirm and verify success screen is shown
    await transferPage.confirmTransaction();
    await transferPage.verifySuccessScreen();

    // Capture and verify success message
    const successMsg = await transferPage.getSuccessMessage();
    console.log(`Success — Message                : ${successMsg}`);
    expect(successMsg).toBe(EXPECTED_SUCCESS_MSG);

    // Capture and verify Transaction Reference
    const txnRef = await transferPage.getTransactionReference();
    console.log(`Success — Transaction Reference  : ${txnRef}`);
    expect(txnRef).toMatch(/^TXN-\d+-\d+$/);

    // Capture Transaction Date & Time
    const txnDateTime = await transferPage.getTransactionDateTime();
    console.log(`Success — Date & Time            : ${txnDateTime}`);
    expect(txnDateTime).toBeTruthy();

    // Final mapping — all captured values confirm a successful Transfer
    console.log('─'.repeat(55));
    console.log(`  TRANSFER TRANSACTION COMPLETED SUCCESSFULLY`);
    console.log(`  Type      : ${await transferPage.getSuccessTransactionType()}`);
    console.log(`  Amount    : ${await transferPage.getSuccessAmount()}`);
    console.log(`  Reference : ${txnRef}`);
    console.log(`  DateTime  : ${txnDateTime}`);
    console.log('─'.repeat(55));
  });

});
