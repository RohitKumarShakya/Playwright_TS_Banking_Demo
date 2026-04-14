import { chromium } from '@playwright/test';
import config from './config.json';
import fs from 'fs';

// Path where the authenticated browser state is saved after the one-time login.
// Imported by every spec file that needs to start on the Banking dashboard.
export const STORAGE_STATE = 'auth/storageState.json';

async function globalSetup(): Promise<void> {
  // Ensure the auth directory exists
  fs.mkdirSync('auth', { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // ── Login once ────────────────────────────────────────────────────────────
  await page.goto(`${config.url}index.html`);
  await page.getByRole('textbox', { name: 'Username' }).fill(config.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(config.password);
  await page.getByLabel('App Name:').selectOption(config.appName);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/Banking-Project-Demo\.html/);

  // ── Save browser state (cookies + localStorage) ───────────────────────────
  await context.storageState({ path: STORAGE_STATE });
  await browser.close();

  console.log('Global Setup complete — session saved to', STORAGE_STATE);
}

export default globalSetup;
