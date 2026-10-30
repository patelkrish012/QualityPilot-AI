import { chromium, Browser, Page } from 'playwright';
import { TestStatus } from '@qualitypilot/types';

export interface ExecutionStepResult {
  action: string;
  target?: string;
  status: TestStatus;
  durationMs: number;
  error?: string;
}

export interface TestCaseExecutionResult {
  testId: string;
  status: TestStatus;
  durationMs: number;
  steps: ExecutionStepResult[];
  screenshotBase64?: string;
  errorMessage?: string;
  consoleErrors: string[];
}

export class PlaywrightRunner {
  private browser: Browser | null = null;

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: true });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Executes a deterministic sequence of actions on the target URL, capturing live evidence.
   */
  async executeSmokeTest(url: string, testId: string = 'SMOKE-001'): Promise<TestCaseExecutionResult> {
    await this.init();
    if (!this.browser) throw new Error('Browser initialization failed');

    const context = await this.browser.newContext();
    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const steps: ExecutionStepResult[] = [];
    const startTime = Date.now();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    let overallStatus = TestStatus.PASS;
    let errorMessage: string | undefined;
    let screenshotBase64: string | undefined;

    try {
      // Step 1: Open URL
      const navStart = Date.now();
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const navStatus = response?.status() || 0;

      if (navStatus >= 400) {
        throw new Error(`HTTP Error Status: ${navStatus}`);
      }

      steps.push({
        action: 'OPEN_URL',
        target: url,
        status: TestStatus.PASS,
        durationMs: Date.now() - navStart,
      });

      // Step 2: Assert Visibility of Body Element
      const assertStart = Date.now();
      const isVisible = await page.isVisible('body');
      if (!isVisible) {
        throw new Error('Body element not visible on target application');
      }

      steps.push({
        action: 'ASSERT_VISIBILITY',
        target: 'body',
        status: TestStatus.PASS,
        durationMs: Date.now() - assertStart,
      });

      // Step 3: Capture Baseline Screenshot Evidence
      const buffer = await page.screenshot({ fullPage: false });
      screenshotBase64 = buffer.toString('base64');
    } catch (err: any) {
      overallStatus = TestStatus.FAIL;
      errorMessage = err.message || 'Unknown execution failure';

      steps.push({
        action: 'EXECUTION_FAILURE',
        status: TestStatus.FAIL,
        durationMs: 0,
        error: errorMessage,
      });

      try {
        const buffer = await page.screenshot({ fullPage: false });
        screenshotBase64 = buffer.toString('base64');
      } catch {
        // Screenshot fallback
      }
    } finally {
      await context.close();
    }

    return {
      testId,
      status: overallStatus,
      durationMs: Date.now() - startTime,
      steps,
      screenshotBase64,
      errorMessage,
      consoleErrors,
    };
  }
}
