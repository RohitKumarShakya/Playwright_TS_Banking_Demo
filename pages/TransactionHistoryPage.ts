import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransactionHistoryPage extends BasePage {
  // Locators
  private get sectionHeading() { return this.page.getByRole('heading', { name: '📊 Transaction History', level: 2 }); }

  constructor(page: Page) {
    super(page);
  }

  // Verify the Transaction History section is visible
  async verifySectionLoaded(): Promise<void> {
    await this.assertVisible(this.sectionHeading);
  }

  // Verify a transaction reference number exists in the history list
  async verifyTransactionReference(txnRef: string): Promise<void> {
    const refEntry = this.page.getByText(`Ref: ${txnRef}`);
    await this.assertVisible(refEntry);
  }

  // Get all transaction references currently displayed in history
  async getAllTransactionRefs(): Promise<string[]> {
    const refLocators = this.page.locator('text=/Ref: TXN-/');
    const count = await refLocators.count();
    const refs: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await refLocators.nth(i).textContent();
      if (text) refs.push(text.trim());
    }
    return refs;
  }
}
