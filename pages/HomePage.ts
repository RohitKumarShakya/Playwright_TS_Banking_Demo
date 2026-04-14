import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private get pageHeader() { return this.page.getByRole('heading', { name: '🏦 Sample Banking Application', level: 1 }); }
  private get welcomeText() { return this.page.getByText('Welcome to the Testers Talk Banking Application'); }
  private get quickTransactionsLink() { return this.page.getByRole('link', { name: '💳 Quick Transactions' }); }
  private get transactionHistoryLink() { return this.page.getByRole('link', { name: '📊 Transaction History' }); }
  private get accountManagementLink() { return this.page.getByRole('link', { name: '💰 Account Management' }); }
  private get transfersTab() { return this.page.getByRole('button', { name: 'Transfers' }); }
  private get billPaymentsTab() { return this.page.getByRole('button', { name: 'Bill Payments' }); }

  constructor(page: Page) {
    super(page);
  }

  // Verify the page loaded correctly after login (URL + heading + subtitle)
  async verifyPageLoaded(): Promise<void> {
    await this.assertURL(/Banking-Project-Demo\.html/);
    await this.assertVisible(this.pageHeader);
    await this.assertVisible(this.welcomeText);
  }

  // TC_HOME_001 — Verify heading and welcome subtitle together
  async verifyHeadingAndSubtitle(): Promise<void> {
    await this.assertVisible(this.pageHeader);
    await this.assertVisible(this.welcomeText);
  }

  // TC_HOME_003 — Verify Transfers tab is visible
  async verifyTransfersTabVisible(): Promise<void> {
    await this.assertVisible(this.transfersTab);
  }

  // TC_HOME_004 — Verify Bill Payments tab is visible
  async verifyBillPaymentsTabVisible(): Promise<void> {
    await this.assertVisible(this.billPaymentsTab);
  }

  // TC_HOME_005 — Verify Account Management nav link is visible
  async verifyAccountManagementLinkVisible(): Promise<void> {
    await this.assertVisible(this.accountManagementLink);
  }

  // TC_HOME_006 — Verify Quick Transactions nav link is visible
  async verifyQuickTransactionsLinkVisible(): Promise<void> {
    await this.assertVisible(this.quickTransactionsLink);
  }

  // TC_HOME_007 — Verify Transaction History nav link is visible
  async verifyTransactionHistoryLinkVisible(): Promise<void> {
    await this.assertVisible(this.transactionHistoryLink);
  }

  // Verify both tabs visible (used by banking-test.spec.ts)
  async verifyTabsVisible(): Promise<void> {
    await this.assertVisible(this.transfersTab);
    await this.assertVisible(this.billPaymentsTab);
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

  // Navigate to Bill Payments tab
  async goToBillPayments(): Promise<void> {
    await this.click(this.billPaymentsTab);
  }
}
