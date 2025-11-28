import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * SajuWooju Enterprise - Complete UI/UX Testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // 하드코딩 탐지는 순차 실행
  forbidOnly: !!process.env.CI,
  retries: 0, // 하드코딩 탐지는 재시도 불필요
  workers: 1, // 단일 워커로 네트워크 추적 명확히
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/hardcoding-report.json' }]
  ],

  use: {
    baseURL:
      process.env.PLAYWRIGHT_TEST_URL ||
      'https://sajuwooju-enterprise-mpyih11cm-kevinglecs-projects.vercel.app',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    // 네트워크 요청 추적 활성화
    navigationTimeout: 45000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-chrome',
      use: {
        ...devices['iPad Pro 11'],
        hasTouch: true,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],

  // 배포된 사이트 테스트이므로 webServer 불필요
});
