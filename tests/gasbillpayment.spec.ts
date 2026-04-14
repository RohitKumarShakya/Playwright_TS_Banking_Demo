import { test, expect, Page, BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GasBillPaymentPage } from '../pages/GasBillPaymentPage';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
import { STORAGE_STATE } from '../global-setup';

// ── Test Data ────────────────────────────────────────────────────────────────
const BILL_TYPE_DISPLAY       = 'Gas';
const SERVICE_PROVIDER        = 'LPG';
const ACCOUNT_REFERENCE       = '12345';
const BILL_AMOUNT             = '10';
const BILL_AMOUNT_FORMATTED   = '$10.00';
const PAYMENT_METHOD_DISPLAY  = 'Savings';
const EXPECTED_SUCCESS_MSG    = 'Bill Payment Completed Successfully!';

// ── Suite ────────────────────────────────────────────────────────────────────
// Single browser session — global-setup login is reused, no re-login here.
// Tests run in strict sequence; each TC builds on the state left by the previous.
// Human-like pauses are embedded in GasBillPaymentPage methods.

test.describe.serial('Bill Payments — Gas Bill Flow', () => {

  let context: BrowserContext;
  let page: Page;
  let paymentRef: string;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ storageState: STORAGE_STATE });
    page = await context.newPage();
    await page.goto('Banking-Project-Demo.html');
  });

  test.afterAll(async () => {
    await context.close();
  });

  // ── TC_GB_001 — Navigate to Bill Payments tab and verify section loads ────────
  test('TC_GB_001 — Verify the Bill Payments section loads', async () => {
    const homePage       = new HomePage(page);
    const billPayPage    = new GasBillPaymentPage(page);

    await homePage.goToBillPayments();
    await billPayPage.verifySectionLoaded();
  });

  // ── TC_GB_002 — Select Gas as the Bill Type ───────────────────────────────────
  test('TC_GB_002 — Select Gas as the Bill Type', async () => {
    const billPayPage = new GasBillPaymentPage(page);
    await billPayPage.selectGasBillType();
  });

  // ── TC_GB_003 — Enter LPG as the Service Provider ────────────────────────────
  test('TC_GB_003 — Enter LPG as the Service Provider', async () => {
    const billPayPage = new GasBillPaymentPage(page);
    await billPayPage.enterServiceProvider(SERVICE_PROVIDER);
  });

  // ── TC_GB_004 — Enter 12345 as the Account/Reference Number ──────────────────
  test('TC_GB_004 — Enter 12345 as the Account/Reference Number', async () => {
    const billPayPage = new GasBillPaymentPage(page);
    await billPayPage.enterAccountReferenceNumber(ACCOUNT_REFERENCE);
  });

  // ── TC_GB_005 — Enter 10 as the Bill Amount ───────────────────────────────────
  test('TC_GB_005 — Enter 10 in the Amount ($) field', async () => {
    const billPayPage = new GasBillPaymentPage(page);
    await billPayPage.enterBillAmount(BILL_AMOUNT);
  });

  // ── TC_GB_006 — Select Savings Account as the Payment Method ─────────────────
  test('TC_GB_006 — Select Savings Account as the Payment Method', async () => {
    const billPayPage = new GasBillPaymentPage(page);
    await billPayPage.selectSavingsAccountPaymentMethod();
  });

  // ── TC_GB_007 — Submit and cross-check every field in the Confirmation section
  test('TC_GB_007 — Submit and cross-check Bill Payment Confirmation fields', async () => {
    const billPayPage = new GasBillPaymentPage(page);

    // Submit the form
    await billPayPage.clickSubmit();
    await billPayPage.verifyConfirmationScreen();

    // Cross-check Bill Type
    const confirmType = await billPayPage.getConfirmBillType();
    console.log(`Confirmation — Bill Type         : ${confirmType}`);
    expect(confirmType).toBe(BILL_TYPE_DISPLAY);

    // Cross-check Service Provider
    const confirmProvider = await billPayPage.getConfirmServiceProvider();
    console.log(`Confirmation — Service Provider  : ${confirmProvider}`);
    expect(confirmProvider).toBe(SERVICE_PROVIDER);

    // Cross-check Account/Reference Number
    const confirmAccount = await billPayPage.getConfirmAccountReference();
    console.log(`Confirmation — Account/Ref No    : ${confirmAccount}`);
    expect(confirmAccount).toBe(ACCOUNT_REFERENCE);

    // Cross-check Amount
    const confirmAmount = await billPayPage.getConfirmAmount();
    console.log(`Confirmation — Amount            : ${confirmAmount}`);
    expect(confirmAmount).toBe(BILL_AMOUNT_FORMATTED);

    // Cross-check Payment Method
    const confirmPaymentMethod = await billPayPage.getConfirmPaymentMethod();
    console.log(`Confirmation — Payment Method    : ${confirmPaymentMethod}`);
    expect(confirmPaymentMethod).toBe(PAYMENT_METHOD_DISPLAY);

    // Capture Current Balance
    const currentBalance = await billPayPage.getConfirmCurrentBalance();
    console.log(`Confirmation — Current Balance   : ${currentBalance}`);
    expect(currentBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    // Capture New Balance After Payment
    const newBalance = await billPayPage.getConfirmNewBalance();
    console.log(`Confirmation — New Balance       : ${newBalance}`);
    expect(newBalance).toMatch(/^\$[\d,]+\.\d{2}$/);

    console.log('─'.repeat(55));
    console.log(`  BILL PAYMENT CONFIRMATION DETAILS`);
    console.log(`  Bill Type       : ${confirmType}`);
    console.log(`  Provider        : ${confirmProvider}`);
    console.log(`  Account/Ref     : ${confirmAccount}`);
    console.log(`  Amount          : ${confirmAmount}`);
    console.log(`  Payment Method  : ${confirmPaymentMethod}`);
    console.log(`  Current Balance : ${currentBalance}`);
    console.log(`  New Balance     : ${newBalance}`);
    console.log('─'.repeat(55));
  });

  // ── TC_GB_008 — Confirm payment and capture Success screen details ─────────────
  test('TC_GB_008 — Confirm payment and capture Success screen details', async () => {
    const billPayPage = new GasBillPaymentPage(page);

    // Confirm and verify success screen
    await billPayPage.confirmPayment();
    await billPayPage.verifySuccessScreen();

    // Capture and verify success message
    const successMsg = await billPayPage.getSuccessMessage();
    console.log(`Success — Message                : ${successMsg}`);
    expect(successMsg).toBe(EXPECTED_SUCCESS_MSG);

    // Capture and store Payment Reference for history cross-check in TC_GB_009
    paymentRef = await billPayPage.getPaymentReference();
    console.log(`Success — Payment Reference      : ${paymentRef}`);
    expect(paymentRef).toMatch(/^TXN-\d+-\d+$/);

    // Capture Date & Time
    const successDateTime = await billPayPage.getSuccessDateTime();
    console.log(`Success — Date & Time            : ${successDateTime}`);
    expect(successDateTime).toBeTruthy();

    console.log('─'.repeat(55));
    console.log(`  GAS BILL PAYMENT COMPLETED SUCCESSFULLY`);
    console.log(`  Type      : ${await billPayPage.getSuccessType()}`);
    console.log(`  Provider  : ${await billPayPage.getSuccessProvider()}`);
    console.log(`  Account   : ${await billPayPage.getSuccessAccount()}`);
    console.log(`  Amount    : ${await billPayPage.getSuccessAmount()}`);
    console.log(`  Reference : ${paymentRef}`);
    console.log(`  DateTime  : ${successDateTime}`);
    console.log('─'.repeat(55));
  });

  // ── TC_GB_009 — Click View History and assert Payment Reference appears ────────
  test('TC_GB_009 — View History and verify Payment Reference is present', async () => {
    const billPayPage          = new GasBillPaymentPage(page);
    const transactionHistoryPage = new TransactionHistoryPage(page);

    // Navigate to Transaction History via the success screen button
    await billPayPage.clickViewHistory();

    // Verify Transaction History section loaded
    await transactionHistoryPage.verifySectionLoaded();

    // Assert the payment reference captured in TC_GB_008 is visible in history
    console.log(`History — Asserting ref present  : ${paymentRef}`);
    await transactionHistoryPage.verifyTransactionReference(paymentRef);
    console.log(`History — Payment Reference confirmed in Transaction History ✓`);
  });

});
