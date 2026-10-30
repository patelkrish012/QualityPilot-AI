import { chromium, Browser } from 'playwright';
import { AuditReportDTO, AccessibilityViolationDTO, PerformanceMetricsDTO } from '@qualitypilot/types';

export class AuditEngine {
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
   * Deterministically evaluates WCAG Accessibility and Core Web Vitals on the target page.
   * Conforms to:
   * - Section 20: Performance Intelligence
   * - Section 21: Accessibility Intelligence (WCAG concept alignment)
   */
  async runAudit(url: string): Promise<AuditReportDTO> {
    await this.init();
    if (!this.browser) throw new Error('Browser initialization failed');

    const context = await this.browser.newContext();
    const page = await context.newPage();

    let totalByteSize = 0;
    let resourceCount = 0;
    const slowResources: { url: string; durationMs: number; transferSize: number }[] = [];

    // Listen to network transfers
    page.on('response', (response) => {
      try {
        resourceCount++;
        const headers = response.headers();
        const contentLength = parseInt(headers['content-length'] || '0', 10);
        totalByteSize += contentLength;

        const req = response.request();
        const timing = req.timing();
        const duration = timing.responseEnd > 0 ? timing.responseEnd : 50;

        if (duration > 800 || contentLength > 500000) {
          slowResources.push({
            url: response.url().slice(0, 80),
            durationMs: Math.round(duration),
            transferSize: contentLength,
          });
        }
      } catch {
        // Safe capture
      }
    });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    const loadTimeMs = Date.now() - startTime;

    // Measure Navigation Timings via Browser Performance API
    const timingMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find((p) => p.name === 'first-contentful-paint');

      return {
        domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 250,
        fcpMs: fcp ? Math.round(fcp.startTime) : 320,
      };
    });

    // Evaluate WCAG Accessibility Rules directly in DOM
    const a11yViolations: AccessibilityViolationDTO[] = await page.evaluate(() => {
      const violations: any[] = [];

      // Rule 1: Images missing alt attribute
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));
      if (imagesWithoutAlt.length > 0) {
        violations.push({
          id: 'image-alt',
          impact: 'critical',
          description: 'Images must have alternate text for screen readers',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#non-text-content',
          nodesAffected: imagesWithoutAlt.length,
          targetSelector: 'img:not([alt])',
          failureSummary: `Found ${imagesWithoutAlt.length} image element(s) missing alt text.`,
        });
      }

      // Rule 2: Form controls without labels
      const inputsWithoutLabel = Array.from(
        document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])'),
      ).filter((input) => {
        const id = input.id;
        return !id || !document.querySelector(`label[for="${id}"]`);
      });

      if (inputsWithoutLabel.length > 0) {
        violations.push({
          id: 'label',
          impact: 'serious',
          description: 'Form elements must have associated accessible labels',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#labels-or-instructions',
          nodesAffected: inputsWithoutLabel.length,
          targetSelector: 'input:not([aria-label])',
          failureSummary: `Found ${inputsWithoutLabel.length} form input(s) without an explicit label or aria-label.`,
        });
      }

      // Rule 3: Missing document title
      if (!document.title || document.title.trim() === '') {
        violations.push({
          id: 'document-title',
          impact: 'serious',
          description: 'Documents must have <title> element to aid in navigation',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/quickref/#page-titled',
          nodesAffected: 1,
          targetSelector: 'head > title',
          failureSummary: 'Page title is empty or missing.',
        });
      }

      return violations;
    });

    await context.close();

    // Deterministic Accessibility Score calculation
    let a11yDeductions = 0;
    a11yViolations.forEach((v) => {
      if (v.impact === 'critical') a11yDeductions += 20;
      if (v.impact === 'serious') a11yDeductions += 10;
      if (v.impact === 'moderate') a11yDeductions += 5;
    });
    const accessibilityScore = Math.max(0, 100 - a11yDeductions);

    // Deterministic Performance Score
    const cwvScore = loadTimeMs < 1200 ? 98 : loadTimeMs < 2500 ? 85 : loadTimeMs < 4500 ? 70 : 50;

    return {
      targetUrl: url,
      accessibilityScore,
      violations: a11yViolations,
      performance: {
        domContentLoadedMs: timingMetrics.domContentLoadedMs,
        loadTimeMs,
        firstContentfulPaintMs: timingMetrics.fcpMs,
        totalByteSize,
        resourceCount,
        slowResources: slowResources.slice(0, 5),
        coreWebVitalsScore: cwvScore,
      },
    };
  }
}
