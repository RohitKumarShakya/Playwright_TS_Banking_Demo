import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private get pageHeader() { return this.page.getByRole('heading', { name: '🏦 Sample Banking Application', level: 1 }); }
  private get welcomeText() { return this.page.getByText('Welcome to the Testers Talk Banking Application'); }
  private get quickTransactionsLink() { return this.page.getByRole('link', { name: '💳 Quick Transactions' }); }
  private get transactionHistoryLink() { return this.page.getByRole('link', { name: '📊 Transaction History' }); }
  private get accountManagementLink() { return this.page.getByRole('link', { name: '💰 Account Management' }); }

  // Tab locators (discovered via live MCP exploration)
  readonly transfersTab = this.page.getByRole('button', { name: 'Transfers' });
  readonly billPaymentsTab = this.page.getByRole('button', { name: 'Bill Payments' });

  constructor(page: Page) {
    super(page);
  }

  // Verify the page loaded correctly after login
  async verifyPageLoaded(): Promise<void> {
    await this.assertURL(/Banking-Project-Demo\.html/);
    await this.assertVisible(this.pageHeader);
    await this.assertVisible(this.welcomeText);
  }

  // Navigate to Quick Transactions section
  async goToQuickTransactions(): Promise<void> {
    await this.click(this.quickTransactionsLink);
  }

  // Navigate to Transaction History section
  async goToTransactionHistory(): Promise<void> {
    await this.click(this.transactionHistoryLink);
  }

  // Navigate to Account Management section
  async goToAccountManagement(): Promise<void> {
    await this.click(this.accountManagementLink);
  }

  // Verify both Transfers and Bill Payments tabs are visible
  async verifyTabsVisible(): Promise<void> {
    await this.assertVisible(this.transfersTab);
    await this.assertVisible(this.billPaymentsTab);
  }
}
