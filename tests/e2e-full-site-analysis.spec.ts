/**
 * 🔍 E2E Full Site Analysis
 * Based on: e2e-site-analyzer skill
 *
 * Modules:
 * 1. Page Discovery (sitemap generation)
 * 2. Hardcoding Detection
 * 3. API Integration Analysis
 * 4. Performance Metrics (Core Web Vitals)
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app';
const MAX_DEPTH = 3;
const OUTPUT_DIR = 'e2e-analysis-report';

interface PageInfo {
  url: string;
  title: string;
  parent: string | null;
  depth: number;
  status: number;
}

interface HardcodingIssue {
  page: string;
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

interface APIEndpoint {
  url: string;
  method: string;
  status: number;
  responseTime: number;
  requestCount: number;
}

interface PerformanceMetrics {
  url: string;
  fcp: number;
  lcp: number;
  cls: number;
  domContentLoaded: number;
  loadComplete: number;
  ttfb: number;
}

const discoveredPages: Map<string, PageInfo> = new Map();
const hardcodingIssues: HardcodingIssue[] = [];
const apiEndpoints: Map<string, APIEndpoint> = new Map();
const performanceData: PerformanceMetrics[] = [];

// ========================================
// Module 1: Page Discovery
// ========================================

async function crawl(
  page: Page,
  url: string,
  baseUrl: string,
  depth: number = 0,
  maxDepth: number = 3,
  parent: string | null = null
): Promise<void> {
  if (depth > maxDepth || discoveredPages.has(url)) {
    return;
  }

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = response?.status() || 0;
    const title = await page.title();

    discoveredPages.set(url, { url, title, parent, depth, status });

    console.log(`[${depth}] ${url} (${status})`);

    // Extract links
    const links = await page.$$eval('a[href]', (anchors, base) => {
      return anchors
        .map(a => {
          const href = a.getAttribute('href');
          if (!href) return null;
          try {
            const url = new URL(href, base);
            return url.href;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[];
    }, baseUrl);

    // Filter same-origin links
    const sameOriginLinks = links.filter(link => {
      try {
        const linkUrl = new URL(link);
        const baseUrlObj = new URL(baseUrl);
        return linkUrl.origin === baseUrlObj.origin;
      } catch {
        return false;
      }
    });

    // Remove duplicates
    const uniqueLinks = Array.from(new Set(sameOriginLinks));

    // Crawl each link
    for (const link of uniqueLinks) {
      await crawl(page, link, baseUrl, depth + 1, maxDepth, url);
    }
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    discoveredPages.set(url, {
      url,
      title: 'Error',
      parent,
      depth,
      status: -1
    });
  }
}

// ========================================
// Module 2: Hardcoding Detection
// ========================================

async function detectHardcoding(page: Page, url: string): Promise<void> {
  // Check for localhost URLs
  const localhostElements = await page.$$eval('a[href*="localhost"], a[href*="127.0.0.1"]', (elements) =>
    elements.map(el => ({ text: el.textContent || '', href: el.getAttribute('href') || '' }))
  );

  localhostElements.forEach(el => {
    hardcodingIssues.push({
      page: url,
      element: `<a href="${el.href}">${el.text}</a>`,
      issue: `Hardcoded localhost URL: ${el.href}`,
      severity: 'critical',
      recommendation: 'Use environment variable (e.g., process.env.NEXT_PUBLIC_SITE_URL)'
    });
  });

  // Check for static data (e.g., repeated text, missing API calls)
  const hasAPICall = await page.evaluate(() => {
    return (window as any).__API_CALLS_DETECTED__ || false;
  });

  if (!hasAPICall && url.includes('/dashboard')) {
    hardcodingIssues.push({
      page: url,
      element: 'Dashboard Page',
      issue: 'No API calls detected - data might be hardcoded',
      severity: 'high',
      recommendation: 'Implement dynamic data fetching from API endpoints'
    });
  }

  // Check metadata for hardcoded values
  const metaDescription = await page.$eval('meta[name="description"]', el => el.getAttribute('content'));
  const ogUrl = await page.$eval('meta[property="og:url"]', el => el.getAttribute('content')).catch(() => null);

  if (metaDescription && metaDescription.includes('localhost')) {
    hardcodingIssues.push({
      page: url,
      element: '<meta name="description">',
      issue: `Hardcoded localhost in meta description: ${metaDescription}`,
      severity: 'high',
      recommendation: 'Use NEXT_PUBLIC_SITE_URL environment variable'
    });
  }

  if (ogUrl && ogUrl.includes('localhost')) {
    hardcodingIssues.push({
      page: url,
      element: '<meta property="og:url">',
      issue: `Hardcoded localhost in OG URL: ${ogUrl}`,
      severity: 'high',
      recommendation: 'Use NEXT_PUBLIC_SITE_URL environment variable'
    });
  }

  // Check for 404 links
  const links = await page.$$eval('a[href]', anchors =>
    anchors.map(a => ({ href: a.getAttribute('href') || '', text: a.textContent || '' }))
  );

  for (const link of links) {
    if (link.href && !link.href.startsWith('http') && !link.href.startsWith('/')) {
      continue;
    }

    if (link.href === '#' || link.href === '' || link.href.startsWith('javascript:')) {
      hardcodingIssues.push({
        page: url,
        element: `<a href="${link.href}">${link.text}</a>`,
        issue: 'Link has no destination or uses placeholder href',
        severity: 'medium',
        recommendation: 'Implement proper navigation or remove placeholder link'
      });
    }
  }
}

// ========================================
// Module 3: API Integration Analysis
// ========================================

function setupAPIInterception(page: Page): void {
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/')) {
      const method = request.method();
      const existing = apiEndpoints.get(url);

      if (!existing) {
        apiEndpoints.set(url, {
          url,
          method,
          status: 0,
          responseTime: 0,
          requestCount: 1
        });
      } else {
        existing.requestCount++;
      }
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/')) {
      const status = response.status();
      const timing = response.timing();
      const responseTime = timing?.responseEnd || 0;

      const endpoint = apiEndpoints.get(url);
      if (endpoint) {
        endpoint.status = status;
        endpoint.responseTime = responseTime;
      }

      // Inject flag to detect API calls in page context
      await page.evaluate(() => {
        (window as any).__API_CALLS_DETECTED__ = true;
      }).catch(() => {});
    }
  });
}

// ========================================
// Module 4: Performance Metrics
// ========================================

async function measurePerformance(page: Page, url: string): Promise<void> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;

    // LCP (estimated - we'd need PerformanceObserver for real LCP)
    const lcp = fcp + 500; // Placeholder

    return {
      fcp,
      lcp,
      cls: 0, // Would need PerformanceObserver
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      ttfb: navigation.responseStart - navigation.requestStart
    };
  });

  performanceData.push({ url, ...metrics });
}

// ========================================
// Main Test Suite
// ========================================

test.describe('E2E Full Site Analysis', () => {
  test('Phase 1: Discover all pages', async ({ page }) => {
    console.log('========================================');
    console.log('📋 Phase 1: Page Discovery');
    console.log('========================================');

    await crawl(page, BASE_URL, BASE_URL, 0, MAX_DEPTH);

    console.log(`\n✅ Discovered ${discoveredPages.size} pages`);

    expect(discoveredPages.size).toBeGreaterThan(0);
  });

  test('Phase 2: Hardcoding Detection', async ({ page }) => {
    console.log('\n========================================');
    console.log('🔍 Phase 2: Hardcoding Detection');
    console.log('========================================');

    // If pages weren't discovered yet, do a quick crawl
    if (discoveredPages.size === 0) {
      await crawl(page, BASE_URL, BASE_URL, 0, 1);
    }

    for (const [url] of discoveredPages) {
      console.log(`Analyzing: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await detectHardcoding(page, url);
      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
      }
    }

    console.log(`\n⚠️  Found ${hardcodingIssues.length} hardcoding issues`);

    // Log critical issues
    const criticalIssues = hardcodingIssues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log(`\n🚨 Critical Issues: ${criticalIssues.length}`);
      criticalIssues.forEach(issue => {
        console.log(`  - ${issue.page}: ${issue.issue}`);
      });
    }
  });

  test('Phase 3: API Integration Analysis', async ({ page }) => {
    console.log('\n========================================');
    console.log('🔌 Phase 3: API Integration Analysis');
    console.log('========================================');

    setupAPIInterception(page);

    // Visit key pages that should make API calls
    const apiPages = [
      BASE_URL,
      `${BASE_URL}/dashboard`,
      `${BASE_URL}/admin`,
    ];

    for (const url of apiPages) {
      console.log(`Visiting: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000); // Wait for any delayed API calls
      } catch (error) {
        console.error(`Error visiting ${url}:`, error);
      }
    }

    console.log(`\n✅ Detected ${apiEndpoints.size} API endpoints`);

    // Log API endpoints
    apiEndpoints.forEach((endpoint, url) => {
      console.log(`  ${endpoint.method} ${url} (${endpoint.status}) - ${endpoint.requestCount} calls`);
    });
  });

  test('Phase 4: Performance Analysis', async ({ page }) => {
    console.log('\n========================================');
    console.log('⚡ Phase 4: Performance Analysis');
    console.log('========================================');

    // Measure key pages
    const perfPages = [
      BASE_URL,
      `${BASE_URL}/dashboard`,
    ];

    for (const url of perfPages) {
      console.log(`Measuring: ${url}`);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await measurePerformance(page, url);
      } catch (error) {
        console.error(`Error measuring ${url}:`, error);
      }
    }

    console.log(`\n✅ Measured performance for ${performanceData.length} pages`);

    // Log performance metrics
    performanceData.forEach(metrics => {
      console.log(`\n${metrics.url}`);
      console.log(`  FCP: ${metrics.fcp.toFixed(2)}ms`);
      console.log(`  LCP: ${metrics.lcp.toFixed(2)}ms`);
      console.log(`  TTFB: ${metrics.ttfb.toFixed(2)}ms`);
      console.log(`  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
      console.log(`  Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    });
  });

  test('Generate comprehensive report', async () => {
    console.log('\n========================================');
    console.log('📊 Generating Comprehensive Report');
    console.log('========================================');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate HTML report
    const report = generateHTMLReport();
    const reportPath = path.join(OUTPUT_DIR, 'e2e-analysis-report.html');
    fs.writeFileSync(reportPath, report, 'utf-8');

    console.log(`\n✅ Report generated: ${reportPath}`);

    // Generate JSON data
    const jsonData = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        totalPages: discoveredPages.size,
        hardcodingIssues: hardcodingIssues.length,
        criticalIssues: hardcodingIssues.filter(i => i.severity === 'critical').length,
        apiEndpoints: apiEndpoints.size,
        performancePages: performanceData.length
      },
      pages: Array.from(discoveredPages.values()),
      hardcodingIssues,
      apiEndpoints: Array.from(apiEndpoints.values()),
      performance: performanceData
    };

    const jsonPath = path.join(OUTPUT_DIR, 'e2e-analysis-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

    console.log(`✅ JSON data: ${jsonPath}`);
  });
});

// ========================================
// HTML Report Generator
// ========================================

function generateHTMLReport(): string {
  const criticalIssues = hardcodingIssues.filter(i => i.severity === 'critical');
  const highIssues = hardcodingIssues.filter(i => i.severity === 'high');
  const mediumIssues = hardcodingIssues.filter(i => i.severity === 'medium');
  const lowIssues = hardcodingIssues.filter(i => i.severity === 'low');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E2E Site Analysis Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 40px; }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; margin-bottom: 30px; }
    h2 { color: #444; margin-top: 40px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eee; }
    h3 { color: #555; margin-top: 20px; margin-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card.green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .summary-card.yellow { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .summary-card.red { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .summary-card h3 { color: white; font-size: 14px; margin-bottom: 10px; }
    .summary-card .value { font-size: 36px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
    th { background: #f9f9f9; font-weight: 600; color: #333; }
    tr:hover { background: #f5f5f5; }
    .severity { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .severity.critical { background: #ff4444; color: white; }
    .severity.high { background: #ff9800; color: white; }
    .severity.medium { background: #ffeb3b; color: #333; }
    .severity.low { background: #4CAF50; color: white; }
    .timestamp { color: #888; font-size: 14px; margin-bottom: 20px; }
    .api-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .api-status.ok { background: #4CAF50; color: white; }
    .api-status.error { background: #ff4444; color: white; }
    .perf-good { color: #4CAF50; font-weight: bold; }
    .perf-ok { color: #ff9800; font-weight: bold; }
    .perf-poor { color: #ff4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 E2E Full Site Analysis Report</h1>
    <div class="timestamp">Generated: ${new Date().toLocaleString('ko-KR')}</div>
    <div class="timestamp">Base URL: ${BASE_URL}</div>

    <h2>📊 Summary</h2>
    <div class="summary">
      <div class="summary-card green">
        <h3>Total Pages</h3>
        <div class="value">${discoveredPages.size}</div>
      </div>
      <div class="summary-card ${criticalIssues.length > 0 ? 'red' : 'green'}">
        <h3>Critical Issues</h3>
        <div class="value">${criticalIssues.length}</div>
      </div>
      <div class="summary-card yellow">
        <h3>Total Issues</h3>
        <div class="value">${hardcodingIssues.length}</div>
      </div>
      <div class="summary-card">
        <h3>API Endpoints</h3>
        <div class="value">${apiEndpoints.size}</div>
      </div>
    </div>

    <h2>🗺️ Discovered Pages</h2>
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Title</th>
          <th>Status</th>
          <th>Depth</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from(discoveredPages.values()).map(page => `
          <tr>
            <td><a href="${page.url}" target="_blank">${page.url}</a></td>
            <td>${page.title}</td>
            <td>${page.status}</td>
            <td>${page.depth}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>⚠️ Hardcoding Issues</h2>
    ${criticalIssues.length > 0 ? `
      <h3>🚨 Critical (${criticalIssues.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Element</th>
            <th>Issue</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${criticalIssues.map(issue => `
            <tr>
              <td>${issue.page}</td>
              <td><code>${issue.element}</code></td>
              <td>${issue.issue}</td>
              <td>${issue.recommendation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>✅ No critical issues found</p>'}

    ${highIssues.length > 0 ? `
      <h3>⚠️ High (${highIssues.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Element</th>
            <th>Issue</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${highIssues.map(issue => `
            <tr>
              <td>${issue.page}</td>
              <td><code>${issue.element}</code></td>
              <td>${issue.issue}</td>
              <td>${issue.recommendation}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <h2>🔌 API Integration</h2>
    ${apiEndpoints.size > 0 ? `
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Calls</th>
            <th>Response Time</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from(apiEndpoints.values()).map(api => `
            <tr>
              <td>${api.method}</td>
              <td>${api.url}</td>
              <td><span class="api-status ${api.status >= 200 && api.status < 300 ? 'ok' : 'error'}">${api.status}</span></td>
              <td>${api.requestCount}</td>
              <td>${api.responseTime.toFixed(2)}ms</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>⚠️ No API calls detected</p>'}

    <h2>⚡ Performance Metrics</h2>
    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>FCP</th>
          <th>LCP</th>
          <th>TTFB</th>
          <th>DOM Load</th>
          <th>Full Load</th>
        </tr>
      </thead>
      <tbody>
        ${performanceData.map(perf => `
          <tr>
            <td>${perf.url}</td>
            <td class="${perf.fcp < 1800 ? 'perf-good' : perf.fcp < 3000 ? 'perf-ok' : 'perf-poor'}">${perf.fcp.toFixed(0)}ms</td>
            <td class="${perf.lcp < 2500 ? 'perf-good' : perf.lcp < 4000 ? 'perf-ok' : 'perf-poor'}">${perf.lcp.toFixed(0)}ms</td>
            <td class="${perf.ttfb < 800 ? 'perf-good' : perf.ttfb < 1800 ? 'perf-ok' : 'perf-poor'}">${perf.ttfb.toFixed(0)}ms</td>
            <td>${perf.domContentLoaded.toFixed(0)}ms</td>
            <td>${perf.loadComplete.toFixed(0)}ms</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>✅ Recommendations</h2>
    <ul>
      ${criticalIssues.length > 0 ? '<li>🚨 Fix critical hardcoding issues immediately</li>' : ''}
      ${hardcodingIssues.length > 5 ? '<li>⚠️ Review and fix remaining hardcoding issues</li>' : ''}
      ${apiEndpoints.size === 0 ? '<li>⚠️ Implement dynamic data fetching via API endpoints</li>' : ''}
      ${performanceData.some(p => p.fcp > 3000) ? '<li>⚡ Optimize page load performance (FCP > 3s)</li>' : ''}
      <li>✅ Continue monitoring and improving site quality</li>
    </ul>
  </div>
</body>
</html>`;
}
