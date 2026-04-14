# CLAUDE.md — Playwright Banking Automation Framework

## Purpose

This file is the authoritative guide for building, extending, and maintaining the Playwright Banking Automation Framework. All future automation must align with the architecture, naming conventions, and test coverage strategy defined here.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Test Runner | Playwright Test | ^1.58.2 |
| Language | TypeScript | Latest (ESNext target) |
| Module System | CommonJS | Node resolution |
| Package Manager | npm | — |
| Browsers | Chromium, Firefox, WebKit | Playwright managed |
| Reporting | Playwright HTML Report | Built-in |
| Tracing | Playwright Trace Viewer | On first retry |
| Test Data | JSON files (`test-data/`) | — |
| Config | `config.json` (url, credentials, appName) | — |
| Type Checking | Strict TypeScript (`tsconfig.json`) | — |

---

## Project Structure

```
Playwright_Banking Project/
├── CLAUDE.md                        ← This file
├── config.json                      ← App URL, credentials, app name
├── playwright.config.ts             ← Playwright runner config
├── tsconfig.json                    ← TypeScript compiler config
├── package.json
│
├── pages/                           ← Page Object Model (POM) classes
│   ├── BasePage.ts                  ← Abstract base — shared utilities
│   ├── LoginPage.ts                 ← Login section
│   ├── HomePage.ts                  ← Dashboard/home section
│   ├── QuickTransactionPage.ts      ← Quick Transactions section
│   └── TransactionHistoryPage.ts    ← Transaction History section
│
├── tests/                           ← Test spec files (Playwright picks up from here)
│   ├── banking-test.spec.ts         ← Main banking test suite
│   └── login.spec.ts                ← Login page positive test cases
│
├── test-data/                       ← External JSON test data files
│   └── Transfer_TestData.json       ← Transfer transaction data
│
├── playwright-report/               ← Generated HTML report (gitignored)
└── test-results/                    ← Generated test artifacts (gitignored)
```

---

## Architecture — Page Object Model (POM)

### Design Principles

1. **One class per page/section** — Each page or major UI section has its own POM class inside `pages/`.
2. **BasePage is the single source of utility methods** — All shared actions (click, fill, assertVisible, assertText, assertURL) live in `BasePage.ts`. Never duplicate these in child classes.
3. **Locators are private getters** — Each POM exposes locators as private `get` accessors. This ensures encapsulation and makes locator updates a single-point change.
4. **Public methods are action-oriented** — Public methods represent user actions or verifications (e.g., `login()`, `submitTransfer()`, `verifySectionLoaded()`).
5. **Test data is external** — All data-driven values come from `test-data/*.json`. No hardcoded test values inside spec files or page objects.
6. **Specs are thin** — Test files import POMs and orchestrate user flows. No locators or direct Playwright API calls inside spec files.

### Class Hierarchy

```
BasePage (abstract)
├── LoginPage
├── HomePage
├── QuickTransactionPage
└── TransactionHistoryPage
```

### BasePage — Shared Utilities

| Method | Purpose |
|---|---|
| `navigate(url)` | Navigate to a URL |
| `click(locator)` | Click a locator |
| `fill(locator, value)` | Fill a text input |
| `selectOption(locator, value)` | Select a dropdown option |
| `getTextContent(locator)` | Return trimmed text (10s timeout) |
| `assertVisible(locator)` | Assert element is visible (10s timeout) |
| `assertText(locator, text)` | Assert element contains text (10s timeout) |
| `assertURL(pattern)` | Assert current URL matches regex (15s timeout) |

---

## Application Under Test

- **URL**: `https://bakkappan.github.io/Testers-Talk-Practice-Site/`
- **App**: Testers Talk — Sample Banking Application
- **Credentials**: Username: `TestersTalk` / Password: `TestersTalk`
- **App Selection**: `Banking` (selected from dropdown on login page)

---

## Pages, Sections & Test Cases

---

### 1. Login Page (`LoginPage.ts`)

**Description**: Entry point of the application. User provides username, password, and selects the application name from a dropdown before logging in.

**Locators**:
- Username input
- Password input
- App Name dropdown
- Login button

**Page Methods**:
- `open()` — Navigate to login URL
- `enterUsername(username)`
- `enterPassword(password)`
- `selectApp(appName)`
- `clickLogin()`
- `login(username, password, appName)` — Full login in one call

#### Positive Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| P1 | Valid Login | Enter valid username, password, select Banking, click Login | Redirected to Home page; URL contains `Banking-Project-Demo.html` |
| P2 | Login with correct app selection | Select "Banking" from app dropdown, use valid credentials | Correct application loads post-login |
| P3 | Username field accepts input | Type valid username in field | Field reflects entered value |
| P4 | Password field accepts input | Type valid password in field | Field reflects entered value (masked) |

#### Negative Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| N1 | Login with invalid username | Enter wrong username, correct password, click Login | Error message displayed; no redirect to home |
| N2 | Login with invalid password | Enter correct username, wrong password, click Login | Error message displayed; no redirect to home |
| N3 | Login with empty username | Leave username blank, enter password, click Login | Validation error or login blocked |
| N4 | Login with empty password | Enter username, leave password blank, click Login | Validation error or login blocked |
| N5 | Login with both fields empty | Leave username and password blank, click Login | Validation error or login blocked |
| N6 | Login without selecting app | Enter valid credentials, skip app selection, click Login | Appropriate error or no app loaded |
| N7 | Login with incorrect app selected | Enter valid credentials, select wrong app, click Login | Wrong application or error page |

---

### 2. Home Page (`HomePage.ts`)

**Description**: Main dashboard shown after successful login. Displays a page header, welcome message, and navigation links to Quick Transactions, Transaction History, and Account Management. Also contains Transfers and Bill Payments tabs.

**Locators**:
- Page header: "🏦 Sample Banking Application"
- Welcome text: "Welcome to the Testers Talk Banking Application"
- Navigation links: Quick Transactions, Transaction History, Account Management
- Tabs: Transfers tab, Bill Payments tab

**Page Methods**:
- `verifyPageLoaded()` — Assert URL, header, and welcome text
- `goToQuickTransactions()`
- `goToTransactionHistory()`
- `goToAccountManagement()`
- `verifyTabsVisible()` — Assert both tabs are visible

#### Positive Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| P1 | Home page loads after login | Complete valid login | Home page URL, header, and welcome text are all visible |
| P2 | Transfers tab is visible | Navigate to Home page | "Transfers" tab button is visible |
| P3 | Bill Payments tab is visible | Navigate to Home page | "Bill Payments" tab button is visible |
| P4 | Navigate to Quick Transactions | Click Quick Transactions link | Quick Transactions section loads |
| P5 | Navigate to Transaction History | Click Transaction History link | Transaction History section loads |
| P6 | Navigate to Account Management | Click Account Management link | Account Management section loads |
| P7 | Page header is correct | Load Home page | Header reads "🏦 Sample Banking Application" |
| P8 | Welcome message is correct | Load Home page | Welcome text reads "Welcome to the Testers Talk Banking Application" |

#### Negative Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| N1 | Access Home page without login | Navigate directly to home URL without login | Redirected to login page or access denied |
| N2 | Account Management navigates correctly | Click Account Management | Section loads (or appropriate placeholder if not implemented) |

---

### 3. Quick Transactions Page (`QuickTransactionPage.ts`)

**Description**: Allows users to submit financial transactions. The flow is: Fill Form → Submit → Confirmation Screen → Confirm → Success Screen with Transaction Reference.

**Locators**:
- Transaction Type dropdown
- Amount input (spinbutton)
- Transfer to Account textbox
- Description textbox
- Submit button
- Confirmation heading: "🔍 Transaction Confirmation"
- Confirm button
- Back button
- Success heading: "✅ Transaction Successful"
- Transaction Reference (format: `TXN-{timestamp}-{id}`)
- View History button
- New Transaction button

**Page Methods**:
- `verifySectionLoaded()` — Assert section is visible
- `selectTransactionType(type)`
- `enterAmount(amount)`
- `enterTransferToAccount(accountNumber)`
- `enterDescription(description)`
- `clickSubmit()` — Submit and verify confirmation screen appears
- `confirmTransaction()` — Confirm the transaction
- `getTransactionReference()` — Retrieve TXN reference string
- `clickViewHistory()` — Navigate to Transaction History
- `submitTransfer(amount, toAccount, description)` — Full transfer flow composite

#### Positive Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| P1 | Quick Transactions section loads | Navigate from Home | Section heading and form are visible |
| P2 | Submit valid transfer | Select Transfer type, enter valid amount/account/description, click Submit | Confirmation screen appears with "🔍 Transaction Confirmation" |
| P3 | Confirm transaction | On confirmation screen, click Confirm | Success screen appears with "✅ Transaction Successful" |
| P4 | Transaction reference is generated | Complete transfer and confirm | Reference in format `TXN-{timestamp}-{id}` is displayed |
| P5 | View History after transaction | On success screen, click View History | Transaction History section loads |
| P6 | New Transaction button works | On success screen, click New Transaction | Form resets and Quick Transactions section reloads |
| P7 | Transaction type dropdown options | Open dropdown | "Transfer" (and other types) are selectable options |
| P8 | Amount field accepts numeric input | Enter valid numeric amount | Field reflects correct value |
| P9 | Transfer to Account field accepts input | Enter a valid account number | Field reflects entered value |
| P10 | Description field accepts input | Enter a description string | Field reflects entered value |
| P11 | Full transfer flow with test data | Use data from `Transfer_TestData.json` (amount:500, toAccount:9876543210) | Transaction completes successfully with a TXN reference |
| P12 | Back button on confirmation screen | Reach confirmation screen, click Back | Returns to the transaction form |

#### Negative Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| N1 | Submit with empty amount | Leave amount blank, fill other fields, click Submit | Validation error; confirmation screen does not appear |
| N2 | Submit with zero amount | Enter 0 as amount, fill other fields, click Submit | Validation error or rejection message |
| N3 | Submit with negative amount | Enter -100 as amount, fill other fields, click Submit | Validation error or rejection message |
| N4 | Submit with empty account number | Leave Transfer to Account blank, fill other fields, click Submit | Validation error; form not submitted |
| N5 | Submit with invalid account number | Enter non-numeric or malformed account, fill other fields, click Submit | Validation error |
| N6 | Submit with empty description | Leave description blank, fill other fields, click Submit | Form submits (if description is optional) or validation error |
| N7 | Submit without selecting transaction type | Skip type selection, fill other fields, click Submit | Validation error or default type used |
| N8 | Submit with excessively large amount | Enter a very large number (e.g., 999999999), click Submit | Validation error or rejection |
| N9 | Submit with special characters in description | Enter `<script>alert(1)</script>` in description | Input is sanitized or rejected |
| N10 | Submit with special characters in account number | Enter `!@#$%` in account field, click Submit | Validation error |

---

### 4. Transaction History Page (`TransactionHistoryPage.ts`)

**Description**: Displays a list of all completed transactions. Each row shows a transaction reference in the format `Ref: TXN-{timestamp}-{id}`.

**Locators**:
- Section heading: "📊 Transaction History"
- Transaction rows (filtered by `Ref: TXN-` text)

**Page Methods**:
- `verifySectionLoaded()` — Assert section heading is visible
- `verifyTransactionReference(txnRef)` — Assert a specific TXN reference exists in the list
- `getAllTransactionRefs()` — Return all TXN reference strings visible in history

#### Positive Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| P1 | Transaction History section loads | Navigate from Home or after a transaction | Section heading "📊 Transaction History" is visible |
| P2 | Submitted transaction appears in history | Complete a full transfer → View History | The generated TXN reference is present in the list |
| P3 | Multiple transactions all appear | Submit two or more transactions, view history | All TXN references are present in the list |
| P4 | Transaction reference format is correct | Retrieve all refs | All refs match the pattern `TXN-{timestamp}-{id}` |
| P5 | Navigate to history via View History button | After a successful transaction, click View History | History section loads and latest TXN ref is shown |

#### Negative Test Cases

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| N1 | History is empty before any transaction | Access Transaction History without submitting any transaction | Empty state message displayed or list shows no entries |
| N2 | Invalid TXN reference not found in history | Search for a non-existent reference (e.g., `TXN-0000-0000`) | Reference is not in the list |
| N3 | Access Transaction History without login | Navigate directly to history URL without authentication | Redirected to login or access denied |

---

## Test Data Strategy

- All test data lives in `test-data/*.json`
- Import in specs using `import testData from '../test-data/Transfer_TestData.json'`
- Add new JSON files per feature (e.g., `BillPayment_TestData.json`, `Login_TestData.json`)
- Never hardcode amounts, account numbers, or user credentials inside spec files

### Current Data Files

| File | Purpose |
|---|---|
| `Transfer_TestData.json` | Transfer transaction: amount, toAccount, description |

---

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| POM class files | PascalCase + "Page" suffix | `QuickTransactionPage.ts` |
| Spec files | kebab-case + `.spec.ts` | `banking-test.spec.ts` |
| Test data files | PascalCase + `_TestData.json` | `Transfer_TestData.json` |
| POM methods | camelCase, action verbs | `submitTransfer()`, `verifyPageLoaded()` |
| Locator getters | camelCase, descriptive | `get submitButton()`, `get amountInput()` |
| Test describe blocks | Title-cased, describe the section | `"Quick Transactions — Transfer Flow"` |
| Test `it/test` names | Full sentence describing behaviour | `"should display TXN reference on success"` |

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run with UI mode
npx playwright test --ui

# Run a specific spec file
npx playwright test tests/banking-test.spec.ts

# Run on a specific browser
npx playwright test --project=chromium

# View the HTML report
npx playwright show-report
```

---

## Adding a New Page Object

1. Create `pages/NewSectionPage.ts` extending `BasePage`
2. Define private locator getters
3. Implement public action and assertion methods
4. Create `test-data/NewSection_TestData.json` if data-driven
5. Create or extend a spec file in `tests/`
6. Update this `CLAUDE.md` with the new section, locators, methods, and test cases

---

## Playwright Config Reference (`playwright.config.ts`)

| Setting | Value |
|---|---|
| Test directory | `./tests` |
| Fully parallel | `true` |
| Retries | 2 on CI, 0 locally |
| Reporter | `html` |
| Trace | `on-first-retry` |
| Browsers | chromium, firefox, webkit |
| Base URL | Set from `config.json` → `https://bakkappan.github.io/Testers-Talk-Practice-Site/` |

---

## LoginPage.ts — Implementation Reference

### File
`pages/LoginPage.ts` — extends `BasePage`

### Locators

| Getter | Playwright Selector | Maps To |
|---|---|---|
| `usernameInput` | `getByRole('textbox', { name: 'Username' })` | Username text field |
| `passwordInput` | `getByRole('textbox', { name: 'Password' })` | Password text field |
| `appNameDropdown` | `getByLabel('App Name:')` | Application name `<select>` |
| `loginButton` | `getByRole('button', { name: 'Login' })` | Login submit button |

### Methods

| Method | Signature | Description |
|---|---|---|
| `open` | `(): Promise<void>` | Navigates to `{baseURL}index.html` |
| `enterUsername` | `(username: string): Promise<void>` | Fills the username field |
| `enterPassword` | `(password: string): Promise<void>` | Fills the password field |
| `selectApp` | `(appName: string): Promise<void>` | Selects an option from the App Name dropdown |
| `clickLogin` | `(): Promise<void>` | Clicks the Login button |
| `login` | `(username, password, appName): Promise<void>` | Composite — runs all four steps above in sequence |
| `verifyUsernameValue` | `(value: string): Promise<void>` | Asserts username field has the given value |
| `verifyPasswordValue` | `(value: string): Promise<void>` | Asserts password field has the given value |

### Spec File
`tests/login.spec.ts` — covers all **positive** test cases (P1–P4)

| Test ID | Test Name | Assertion |
|---|---|---|
| P1 | should redirect to Home page after valid login | URL matches `/Banking-Project-Demo\.html/` |
| P2 | should load the Banking application with correct app selection | `homePage.verifyPageLoaded()` passes |
| P3 | should accept and reflect the username in the username field | `verifyUsernameValue(config.username)` |
| P4 | should accept and reflect the password in the password field | `verifyPasswordValue(config.password)` |

### Config Keys Used
All credentials and the app name come from `config.json` — no values are hardcoded in the spec or page object.

| Key | Value |
|---|---|
| `config.url` | `https://bakkappan.github.io/Testers-Talk-Practice-Site/` |
| `config.username` | `TestersTalk` |
| `config.password` | `TestersTalk` |
| `config.appName` | `Banking` |

### Run Login Tests Only
```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/login.spec.ts --project=chromium
```

---

## Future Sections to Automate

| Section | Priority | Notes |
|---|---|---|
| Account Management | High | Navigation exists on Home page; section not yet automated |
| Bill Payments tab | High | Tab visible on Home page; no spec exists yet |
| Transfers tab | Medium | Overlaps with Quick Transactions; verify tab-level behaviour |
| Logout flow | High | No logout test exists; critical security path |
| Session timeout | Low | Verify session expiry behaviour |
| Cross-browser validation | Medium | Config has 3 browsers; confirm all tests pass on all |
