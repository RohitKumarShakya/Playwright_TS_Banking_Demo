import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private get usernameInput() { return this.page.getByRole('textbox', { name: 'Username' }); }
  private get passwordInput() { return this.page.getByRole('textbox', { name: 'Password' }); }
  private get appNameDropdown() { return this.page.getByLabel('App Name:'); }
  private get loginButton() { return this.page.getByRole('button', { name: 'Login' }); }

  constructor(page: Page) {
    super(page);
  }

  // Navigate to the login page (index.html) and wait for the form to be ready
  async open(): Promise<void> {
    await this.navigate(`${this.baseURL}index.html`);
    await this.assertVisible(this.usernameInput);
  }

  // Enter username
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  // Enter password
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  // Select the app from the dropdown
  async selectApp(appName: string): Promise<void> {
    await this.selectOption(this.appNameDropdown, appName);
  }

  // Click the login button
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  // Complete login flow in one call
  async login(username: string, password: string, appName: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.selectApp(appName);
    await this.clickLogin();
  }

  // Assert username field has the expected value
  async verifyUsernameValue(value: string): Promise<void> {
    await expect(this.usernameInput).toHaveValue(value);
  }

  // Assert password field has the expected value
  async verifyPasswordValue(value: string): Promise<void> {
    await expect(this.passwordInput).toHaveValue(value);
  }
}
