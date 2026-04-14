import { Page, Locator, expect } from '@playwright/test';
import config from '../config.json';

export abstract class BasePage {
  readonly page: Page;
  protected readonly baseURL: string = config.url;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the app base URL (default) or a specific URL
  async navigate(url: string = this.baseURL): Promise<void> {
    await this.page.goto(url);
  }

  // Click an element by locator
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  // Fill a text field
  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  // Select a dropdown option by visible text
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  // Get trimmed text content of an element (div, span, paragraph, etc.)
  async getTextContent(locator: Locator): Promise<string> {
    const text = await locator.textContent({ timeout: 10000 });
    return text?.trim() ?? '';
  }

  // Get value from an input field or select dropdown
  async getInputValue(locator: Locator): Promise<string> {
    return locator.inputValue({ timeout: 10000 });
  }

  // Assert element is visible
  async assertVisible(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  // Assert element contains text
  async assertText(locator: Locator, text: string, timeout = 10000): Promise<void> {
    await expect(locator).toHaveText(text, { timeout });
  }

  // Assert current URL matches a pattern
  async assertURL(pattern: RegExp, timeout = 15000): Promise<void> {
    await expect(this.page).toHaveURL(pattern, { timeout });
  }
}
