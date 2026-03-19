import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class QuickTransactionPage extends BasePage {
  // Locators — form fields
  private get sectionHeading() { return this.page.getByRole('heading', { name: '💳 Quick Transactions', level: 2 }); }
  private get transactionTypeDropdown() { return this.page.getByLabel('Transaction Type:'); }
  private get amountInput() { return this.page.getByRole('spinbutton', { name: 'Amount ($): *' }); }
  private get transferToAccountInput() { return this.page.getByRole('textbox', { name: 'Transfer to Account: *' }); }
  private get descriptionInput() { return this.page.getByRole('textbox', { name: 'Description: *' }); }
  private get submitButton() { return this.page.getByRole('button', { name: 'Submit' }); }

  // Locators — confirmation screen
  private get confirmationHeading() { return this.page.getByRole('heading', { name: '🔍 Transaction Confirmation', level: 2 }); }
  private get confirmButton() { return this.page.getByRole('button', { name: 'Confirm' }); }
  private get backButton() { return this.page.getByRole('button', { name: 'Back' }); }

  // Locators — success screen
  private get successHeading() { return this.page.getByRole('heading', { name: '✅ Transaction Successful', level: 2 }); }
  private get txnReferenceValue() {
    return this.page.locator('div, span, p').filter({ hasText: /^TXN-\d+-\d+$/ }).first();
  }
  private get viewHistoryButton() { return this.page.getByRole('button', { name: 'View History' }); }
  private get newTransactionButton() { return this.page.getByRole('button', { name: 'New Transaction' }); }

  constructor(page: Page) {
    super(page);
  }

  // Verify the Quick Transactions section is active
  async verifySectionLoaded(): Promise<void> {
    await this.assertVisible(this.sectionHeading);
  }

  // Select the transaction type (Deposit / Withdrawal / Transfer)
  async selectTransactionType(type: string): Promise<void> {
    await this.selectOption(this.transactionTypeDropdown, type);
  }

  // Enter transfer amount
  async enterAmount(amount: string): Promise<void> {
    await this.fill(this.amountInput, amount);
  }

  // Enter destination account number (only visible for Transfer type)
  async enterTransferToAccount(accountNumber: string): Promise<void> {
    await this.fill(this.transferToAccountInput, accountNumber);
  }

  // Enter transaction description
  async enterDescription(description: string): Promise<void> {
    await this.fill(this.descriptionInput, description);
  }

  // Click the Submit button
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
    await this.assertVisible(this.confirmationHeading);
  }

  // Verify confirmation screen and click Confirm
  async confirmTransaction(): Promise<void> {
    await this.assertVisible(this.confirmationHeading);
    await this.click(this.confirmButton);
  }

  // Verify success screen is shown and return the transaction reference number
  async getTransactionReference(): Promise<string> {
    await this.assertVisible(this.successHeading);
    const txnRef = await this.getTextContent(this.txnReferenceValue);
    return txnRef;
  }

  // Click View History on the success screen
  async clickViewHistory(): Promise<void> {
    await this.click(this.viewHistoryButton);
  }

  // Full Transfer flow in one call
  async submitTransfer(amount: string, toAccount: string, description: string): Promise<void> {
    await this.selectTransactionType('Transfer');
    await this.enterAmount(amount);
    await this.enterTransferToAccount(toAccount);
    await this.enterDescription(description);
    await this.clickSubmit();
  }
}
