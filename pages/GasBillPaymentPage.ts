import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object for Bill Payments — Gas bill type scope.
// Accessible via the "Bill Payments" tab on the Home page (top tab bar).
// Flow: Fill Form → Submit → Confirmation Section → Confirm → Success Section → View History.
// Uses human-like pauses between field interactions for easy visual monitoring.

export class GasBillPaymentPage extends BasePage {

  // ── Bill Payment Form — section & fields ─────────────────────────────────────
  private get sectionHeading() {
    return this.page.getByRole('heading', { name: '💳 Bill Payments', level: 2 });
  }

  private get billTypeDropdown() {
    return this.page.locator('#billType');
  }

  private get serviceProviderInput() {
    return this.page.locator('#billProvider');
  }

  private get accountReferenceInput() {
    return this.page.locator('#billAccountNumber');
  }

  private get billAmountInput() {
    return this.page.locator('#billAmount');
  }

  private get paymentMethodDropdown() {
    return this.page.locator('#paymentMethod');
  }

  private get submitButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  // ── Bill Payment Confirmation — heading & actions ────────────────────────────
  private get confirmationHeading() {
    return this.page.getByRole('heading', { name: '🔍 Bill Payment Confirmation', level: 2 });
  }

  private get confirmButton() {
    return this.page.getByRole('button', { name: 'Confirm' });
  }

  private get backButton() {
    return this.page.getByRole('button', { name: 'Back' });
  }

  // ── Bill Payment Confirmation — detail values (exact IDs from DOM) ───────────
  private get confirmBillType()        { return this.page.locator('#billConfirmType'); }
  private get confirmProvider()        { return this.page.locator('#billConfirmProvider'); }
  private get confirmAccount()         { return this.page.locator('#billConfirmAccount'); }
  private get confirmAmount()          { return this.page.locator('#billConfirmAmount'); }
  private get confirmPaymentMethod()   { return this.page.locator('#billConfirmPaymentMethod'); }
  private get confirmCurrentBalance()  { return this.page.locator('#billConfirmCurrentBalance'); }
  private get confirmNewBalance()      { return this.page.locator('#billConfirmNewBalance'); }

  // ── Bill Payment Success — heading ────────────────────────────────────────────
  private get successHeading() {
    return this.page.getByRole('heading', { name: '✅ Bill Payment Successful', level: 2 });
  }

  // ── Bill Payment Success — detail values (exact IDs from DOM) ────────────────
  private get successTitle()      { return this.page.locator('#billSuccessTitle'); }
  private get successType()       { return this.page.locator('#billSuccessType'); }
  private get successProvider()   { return this.page.locator('#billSuccessProvider'); }
  private get successAccount()    { return this.page.locator('#billSuccessAccount'); }
  private get successAmount()     { return this.page.locator('#billSuccessAmount'); }
  private get successReference()  { return this.page.locator('#billSuccessReference'); }
  private get successDateTime()   { return this.page.locator('#billSuccessDateTime'); }

  // ── Post-success actions ──────────────────────────────────────────────────────
  private get viewHistoryButton()    { return this.page.getByRole('button', { name: 'View History' }); }
  private get newBillPaymentButton() { return this.page.getByRole('button', { name: 'New Bill Payment' }); }

  constructor(page: Page) {
    super(page);
  }

  // ── Human-like pause between field interactions ──────────────────────────────
  private async pause(ms = 1000): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // ── Section verification ─────────────────────────────────────────────────────
  async verifySectionLoaded(): Promise<void> {
    await this.assertVisible(this.sectionHeading);
  }

  // ── Form field interactions ───────────────────────────────────────────────────

  async selectGasBillType(): Promise<void> {
    await this.pause();
    await this.selectOption(this.billTypeDropdown, 'gas');
    await this.pause();
  }

  async enterServiceProvider(provider: string): Promise<void> {
    await this.pause();
    await this.fill(this.serviceProviderInput, provider);
    await this.pause();
  }

  async enterAccountReferenceNumber(accountRef: string): Promise<void> {
    await this.pause();
    await this.fill(this.accountReferenceInput, accountRef);
    await this.pause();
  }

  async enterBillAmount(amount: string): Promise<void> {
    await this.pause();
    await this.fill(this.billAmountInput, amount);
    await this.pause();
  }

  async selectSavingsAccountPaymentMethod(): Promise<void> {
    await this.pause();
    await this.selectOption(this.paymentMethodDropdown, 'savings');
    await this.pause();
  }

  async clickSubmit(): Promise<void> {
    await this.pause();
    await this.click(this.submitButton);
    await this.assertVisible(this.confirmationHeading);
  }

  // ── Confirmation section — verification getters ───────────────────────────────

  async verifyConfirmationScreen(): Promise<void> {
    await this.assertVisible(this.confirmationHeading);
  }

  async getConfirmBillType(): Promise<string> {
    return this.getTextContent(this.confirmBillType);
  }

  async getConfirmServiceProvider(): Promise<string> {
    return this.getTextContent(this.confirmProvider);
  }

  async getConfirmAccountReference(): Promise<string> {
    return this.getTextContent(this.confirmAccount);
  }

  async getConfirmAmount(): Promise<string> {
    return this.getTextContent(this.confirmAmount);
  }

  async getConfirmPaymentMethod(): Promise<string> {
    return this.getTextContent(this.confirmPaymentMethod);
  }

  async getConfirmCurrentBalance(): Promise<string> {
    return this.getTextContent(this.confirmCurrentBalance);
  }

  async getConfirmNewBalance(): Promise<string> {
    return this.getTextContent(this.confirmNewBalance);
  }

  // ── Confirm action ────────────────────────────────────────────────────────────
  async confirmPayment(): Promise<void> {
    await this.pause();
    await this.click(this.confirmButton);
    await this.assertVisible(this.successHeading);
  }

  // ── Success section — verification getters ────────────────────────────────────

  async verifySuccessScreen(): Promise<void> {
    await this.assertVisible(this.successHeading);
  }

  async getSuccessMessage(): Promise<string> {
    return this.getTextContent(this.successTitle);
  }

  async getSuccessType(): Promise<string> {
    return this.getTextContent(this.successType);
  }

  async getSuccessProvider(): Promise<string> {
    return this.getTextContent(this.successProvider);
  }

  async getSuccessAccount(): Promise<string> {
    return this.getTextContent(this.successAccount);
  }

  async getSuccessAmount(): Promise<string> {
    return this.getTextContent(this.successAmount);
  }

  async getPaymentReference(): Promise<string> {
    await this.assertVisible(this.successReference);
    return this.getTextContent(this.successReference);
  }

  async getSuccessDateTime(): Promise<string> {
    return this.getTextContent(this.successDateTime);
  }

  // ── Post-success navigation ───────────────────────────────────────────────────
  async clickViewHistory(): Promise<void> {
    await this.pause();
    await this.click(this.viewHistoryButton);
  }

  async clickNewBillPayment(): Promise<void> {
    await this.pause();
    await this.click(this.newBillPaymentButton);
  }
}
