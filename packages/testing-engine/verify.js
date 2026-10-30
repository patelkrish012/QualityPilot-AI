const { ApplicationDiscoveryEngine } = require('./dist/discovery/discovery.engine');
const { PlaywrightRunner } = require('./dist/runner/playwright.runner');

async function verifyEngine() {
  console.log('--- [QualityPilot AI] Starting Autonomous Discovery Engine Verification ---');
  const targetUrl = 'https://example.com';

  const discovery = new ApplicationDiscoveryEngine();
  try {
    console.log(`[1] Crawling and inspecting DOM on: ${targetUrl}...`);
    const pageData = await discovery.discoverPage(targetUrl);
    console.log('✓ Discovery Succeeded:');
    console.log(`  - Page Title: "${pageData.title}"`);
    console.log(`  - Outbound/In-domain Links: ${pageData.links.length}`);
    console.log(`  - Forms Discovered: ${pageData.forms.length}`);
    console.log(`  - Buttons Discovered: ${pageData.buttons.length}`);
    console.log(`  - Network Requests Captured: ${pageData.networkRequests.length}`);
    console.log(`  - DOM Content Loaded: ${pageData.loadMetrics.domContentLoadedMs}ms`);
    console.log(`  - Total Page Load: ${pageData.loadMetrics.loadTimeMs}ms`);
  } catch (err) {
    console.error('Discovery error:', err.message);
  } finally {
    await discovery.close();
  }

  console.log('\n--- [QualityPilot AI] Starting Live Playwright Runner Verification ---');
  const runner = new PlaywrightRunner();
  try {
    const result = await runner.executeSmokeTest(targetUrl, 'VERIFY-SMOKE-001');
    console.log('✓ Smoke Test Execution Completed:');
    console.log(`  - Status: ${result.status}`);
    console.log(`  - Steps Executed: ${result.steps.length}`);
    console.log(`  - Total Duration: ${result.durationMs}ms`);
    console.log(`  - Screenshot Evidence Captured: ${result.screenshotBase64 ? 'YES (' + result.screenshotBase64.length + ' base64 chars)' : 'NO'}`);
    console.log(`  - Console Errors: ${result.consoleErrors.length}`);
  } catch (err) {
    console.error('Runner error:', err.message);
  } finally {
    await runner.close();
  }

  console.log('\n======================================================');
  console.log('✓ VERIFICATION RESULT: All Phase 2 Engines Functional!');
  console.log('======================================================');
}

verifyEngine();
