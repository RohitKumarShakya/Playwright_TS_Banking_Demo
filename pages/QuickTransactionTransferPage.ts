import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object for Quick Transactions — Transfer transaction type scope.
// "Transfer to Account" input (#transferAccount / #transferAccountGroup) is visible
// only when Transfer is selected from the Transaction Type dropdown.
// Uses human-like pauses between field interactions for easy visual monitoring.

export class QuickTransactionTransferPage extends BasePage {

  // ── Form field locators ──────────────────────────────────────────────────────
  private get sectionHeading() {
    return this.page.getByRole('heading', { name: '💳 Quick Transactions', level: 2 });
  }

  private get transactionTypeDropdown() {
    return this.page.getByLabel('Transaction Type:');
  }

  private get amountInput() {
    return this.page.locator('#transactionAmount');
  }

  // Visible only when Transfer type is selected (shown via #transferAccountGroup)
  private get transferToAccountInput() {
    return this.page.locator('#transferAccount');
  }

  private get descriptionInput() {
    return this.page.locator('#transactionDescription');
  }

  private get submitButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  // ── Confirmation modal — heading & action ────────────────────────────────────
  private get confirmationHeading() {
    return this.page.getByRole('heading', { name: '🔍 Transaction Confirmation', level: 2 });
  }

  private get confirmButton() {
    return this.page.getByRole('button', { name: 'Confirm' });
  }

  private get backButton() {
    return this.page.getByRole('button', { name: 'Back' });
  }

  // ── Confirmation modal — detail values (exact IDs from DOM) ─────────────────
  private get confirmationType()           { return this.page.locator('#confirmType'); }
  private get confirmationAmount()         { return this.page.locator('#confirmAmount'); }
  private get confirmationDescription()    { return this.page.locator('#confirmDescription'); }
  // Transfer-specific confirmation fields (shown only for Transfer type)
  private get confirmationTransferAccount() { return this.page.locator('#confirmTransferAccount'); }
  private get confirmationCurrentBalance() { return this.page.locator('#confirmCurrentBalance'); }
  private get confirmationNewBalance()     { return this.page.locator('#confirmNewBalance'); }

  // ── Success screen — heading ─────────────────────────────────────────────────
  private get successHeading() {
    return this.page.getByRole('heading', { name: '✅ Transaction Successful', level: 2 });
  }

  // ── Success screen — detail values (exact IDs from DOM) ─────────────────────
  private get successTitle()       { return this.page.locator('#successTitle'); }
  private get successType()        { return this.page.locator('#successType'); }
  private get successAmount()      { return this.page.locator('#successAmount'); }
  private get successDescription() { return this.page.locator('#successDescription'); }
  private get successReference()   { return this.page.locator('#successReference'); }
  private get successDateTime()    { return this.page.locator('#successDateTime'); }

  // ── Success screen — actions ─────────────────────────────────────────────────
  private get viewHistoryButton()    { return this.page.getByRole('button', { name: 'View History' }); }
  private get newTransactionButton() { return this.page.getByRole('button', { name: 'New Transaction' }); }

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

  // ── Form field interactions ──────────────────────────────────────────────────

  async selectTransferTransactionType(): Promise<void> {
    await this.pause();
    await this.selectOption(this.transactionTypeDropdown, 'Transfer');
    await this.pause();
  }

  async enterAmount(amount: string): Promise<void> {
    await this.pause();
    await this.fill(this.amountInput, amount);
    await this.pause();
  }

  // Enters the destination account number (visible only after selecting Transfer type)
  async enterTransferToAccount(accountNumber: string): Promise<void> {
    await this.pause();
    await this.assertVisible(this.transferToAccountInput);
    await this.fill(this.transferToAccountInput, accountNumber);
    await this.pause();
  }

  async enterDescription(description: string): Promise<void> {
    await this.pause();
    await this.fill(this.descriptionInput, description);
    await this.pause();
  }

  async clickSubmit(): Promise<void> {
    await this.pause();
    await this.click(this.submitButton);
    await this.assertVisible(this.confirmationHeading);
  }

  async clickBack(): Promise<void> {
    await this.pause();
    await this.click(this.backButton);
    await this.assertVisible(this.sectionHeading);
  }

  // ── Confirmation modal — verification ────────────────────────────────────────

  async verifyConfirmationScreen(): Promise<void> {
    await this.assertVisible(this.confirmationHeading);
  }

  async getConfirmationTransactionType(): Promise<string> {
    return this.getTextContent(this.confirmationType);
  }

  async getConfirmationAmount(): Promise<string> {
    return this.getTextContent(this.confirmationAmount);
  }

  async getConfirmationDescription(): Promise<string> {
    return this.getTextContent(this.confirmationDescription);
  }

  // Returns the destination account shown in the confirmation modal (Transfer-specific)
  async getConfirmationTransferAccount(): Promise<string> {
    return this.getTextContent(this.confirmationTransferAccount);
  }

  async getConfirmationCurrentBalance(): Promise<string> {
    return this.getTextContent(this.confirmationCurrentBalance);
  }

  async getConfirmationNewBalance(): Promise<string> {
    return this.getTextContent(this.confirmationNewBalance);
  }

  // ── Confirm action ────────────────────────────────────────────────────────────
  async confirmTransaction(): Promise<void> {
    await this.pause();
    await this.click(this.confirmButton);
    await this.assertVisible(this.successHeading);
  }

  // ── Success screen — verification ────────────────────────────────────────────

  async verifySuccessScreen(): Promise<void> {
    await this.assertVisible(this.successHeading);
  }

  async getSuccessMessage(): Promise<string> {
    return this.getTextContent(this.successTitle);
  }

  async getSuccessTransactionType(): Promise<string> {
    return this.getTextContent(this.successType);
  }

  async getSuccessAmount(): Promise<string> {
    return this.getTextContent(this.successAmount);
  }

  async getSuccessDescription(): Promise<string> {
    return this.getTextContent(this.successDescription);
  }

  async getTransactionReference(): Promise<string> {
    await this.assertVisible(this.successReference);
    return this.getTextContent(this.successReference);
  }

  async getTransactionDateTime(): Promise<string> {
    return this.getTextContent(this.successDateTime);
  }

  // ── Post-success navigation ───────────────────────────────────────────────────
  async clickViewHistory(): Promise<void> {
    await this.pause();
    await this.click(this.viewHistoryButton);
  }

  async clickNewTransaction(): Promise<void> {
    await this.pause();
    await this.click(this.newTransactionButton);
  }
}
