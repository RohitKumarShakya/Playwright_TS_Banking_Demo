import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object for the Account Management section — Transfers tab scope.
// NOTE: This class covers only the initial element set. Full scope (form fields,
// submit flow, validations) will be added in subsequent iterations.

export class AccManageTransfersPage extends BasePage {

  // ── Navigation & Tab elements ────────────────────────────────────────────────

  // Transfers tab button on the banking home page
  private get transfersTab() {
    return this.page.getByRole('button', { name: 'Transfers' });
  }

  // Account Management link in the left-side navigation bar
  private get accountManagementNavLink() {
    return this.page.getByRole('link', { name: '💰 Account Management' });
  }

  // ── Account Management — banking-main-content form fields ────────────────────

  // Account balance display above the form (e.g. "Balance: $10,000.00")
  private get accountBalanceDisplay() {
    return this.page.getByText(/Balance: \$/);
  }

  // Account Number read-only input field
  private get accountNumberField() {
    return this.page.getByLabel('Account Number:');
  }

  // Account Holder Name input field
  private get accountHolderField() {
    return this.page.getByLabel('Account Holder:');
  }

  // Account Type select dropdown
  private get accountTypeDropdown() {
    return this.page.getByLabel('Account Type:');
  }

  constructor(page: Page) {
    super(page);
  }

  // ── Visibility assertions ────────────────────────────────────────────────────

  // Verify the Transfers tab is visible on the page
  async verifyTransfersTabVisible(): Promise<void> {
    await this.assertVisible(this.transfersTab);
  }

  // Verify the Account Management link is visible in the left nav
  async verifyAccountManagementNavLinkVisible(): Promise<void> {
    await this.assertVisible(this.accountManagementNavLink);
  }

  // ── Field value getters ──────────────────────────────────────────────────────

  // Returns the account balance text (e.g. "Balance: $10,000.00")
  async getAccountBalance(): Promise<string> {
    return this.getTextContent(this.accountBalanceDisplay);
  }

  // Returns the Account Number field value
  async getAccountNumber(): Promise<string> {
    return this.getInputValue(this.accountNumberField);
  }

  // Returns the Account Holder Name field value
  async getAccountHolderName(): Promise<string> {
    return this.getInputValue(this.accountHolderField);
  }

  // Returns the currently selected Account Type
  async getAccountType(): Promise<string> {
    return this.getInputValue(this.accountTypeDropdown);
  }
}
