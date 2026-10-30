import { chromium, Browser, Page } from 'playwright';
import { PageDiscoveryResult, ApplicationMap, DiscoveredForm, DiscoveredElement } from './discovery.types';

export class ApplicationDiscoveryEngine {
  private browser: Browser | null = null;

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Explores a single page URL and deterministically extracts DOM structure,
   * forms, inputs, buttons, navigation links, network traffic and console errors.
   */
  async discoverPage(url: string, timeoutMs: number = 30000): Promise<PageDiscoveryResult> {
    await this.init();
    if (!this.browser) throw new Error('Browser failed to initialize');

    const context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'QualityPilot-AI-DiscoveryEngine/1.0',
    });

    const page = await context.newPage();
    const consoleErrors: string[] = [];
    const networkRequests: { url: string; method: string; status: number; responseTimeMs: number }[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture observable API and network requests
    page.on('response', (response) => {
      try {
        const req = response.request();
        networkRequests.push({
          url: response.url(),
          method: req.method(),
          status: response.status(),
          responseTimeMs: 0,
        });
      } catch (e) {
        // Safe capture
      }
    });

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    const domContentLoadedMs = Date.now() - startTime;

    const title = await page.title();

    // Deterministically inspect forms and input validation
    const forms: DiscoveredForm[] = await page.$$eval('form', (elements) =>
      elements.map((form) => {
        const inputEls = Array.from(form.querySelectorAll('input, select, textarea'));
        const inputs = inputEls.map((input) => {
          const el = input as HTMLInputElement;
          return {
            name: el.name || '',
            type: el.type || 'text',
            placeholder: el.placeholder || '',
            required: el.required || false,
            id: el.id || '',
          };
        });

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement;

        return {
          action: form.action || '',
          method: (form.method || 'GET').toUpperCase(),
          id: form.id || undefined,
          inputs,
          submitButtonText: submitBtn ? submitBtn.innerText || 'Submit' : undefined,
        };
      }),
    );

    // Extract clickable buttons
    const buttons: DiscoveredElement[] = await page.$$eval('button, [role="button"], input[type="button"]', (elements) =>
      elements.slice(0, 50).map((btn) => ({
        tag: btn.tagName.toLowerCase(),
        text: (btn as HTMLElement).innerText?.trim() || '',
        role: btn.getAttribute('role') || 'button',
        selector: btn.id ? `#${btn.id}` : btn.className ? `.${btn.className.split(' ')[0]}` : btn.tagName.toLowerCase(),
      })),
    );

    // Extract in-domain navigation links
    const targetOrigin = new URL(url).origin;
    const rawLinks: string[] = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href),
    );

    const validLinks = Array.from(
      new Set(
        rawLinks
          .filter((link) => {
            try {
              const parsed = new URL(link);
              return parsed.origin === targetOrigin && !parsed.hash.startsWith('#');
            } catch {
              return false;
            }
          })
          .slice(0, 30),
      ),
    );

    const loadTimeMs = Date.now() - startTime;
    await context.close();

    return {
      url,
      title,
      links: validLinks,
      buttons,
      forms,
      consoleErrors,
      networkRequests: networkRequests.slice(0, 50),
      loadMetrics: {
        domContentLoadedMs,
        loadTimeMs,
      },
    };
  }

  /**
   * Crawls up to maxPages to construct an Application Map for Mode A black-box testing.
   */
  async buildApplicationMap(startUrl: string, maxPages: number = 5): Promise<ApplicationMap> {
    const visited = new Set<string>();
    const queue: string[] = [startUrl];
    const discoveredPages: PageDiscoveryResult[] = [];
    const unreachableLinks: string[] = [];

    while (queue.length > 0 && discoveredPages.length < maxPages) {
      const currentUrl = queue.shift()!;
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        const pageResult = await this.discoverPage(currentUrl);
        discoveredPages.push(pageResult);

        // Queue newly discovered links
        for (const link of pageResult.links) {
          if (!visited.has(link) && !queue.includes(link)) {
            queue.push(link);
          }
        }
      } catch (err) {
        unreachableLinks.push(currentUrl);
      }
    }

    return {
      targetUrl: startUrl,
      discoveredPages,
      totalPagesDiscovered: discoveredPages.length,
      totalFormsDiscovered: discoveredPages.reduce((acc, p) => acc + p.forms.length, 0),
      totalButtonsDiscovered: discoveredPages.reduce((acc, p) => acc + p.buttons.length, 0),
      unreachableLinks,
    };
  }
}
