import { defineConfig } from '@playwright/test'

// Curated Playwright "smoke" lane. This is the config the pre-push hook and the
// Chunk sidecar runners (.chunk/run-playwright-smoke.sh, run-playwright-shards.sh)
// require by name — the `playwright:smoke` package.json script MUST start with the
// literal prefix `playwright test --config playwright.smoke.config.ts ` or the
// Chunk runner throws ("Unexpected playwright:smoke script format").
//
// Only tests tagged `@smoke` run here; keep the suite under ~5 minutes.

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:41741'
const port = new URL(baseURL).port || '41741'
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER
  ? process.env.PLAYWRIGHT_REUSE_SERVER === '1'
  : process.env.CI !== 'true'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  workers: 1,
  grep: /@smoke/,
  use: {
    baseURL,
    headless: true,
    // If your app needs pre-seeded browser state (dismissed onboarding, an auth
    // cookie, feature flags), add a `storageState` here, e.g.:
    //   storageState: {
    //     cookies: [],
    //     origins: [{ origin: baseURL, localStorage: [{ name: 'my-app:onboarded', value: '1' }] }],
    //   },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `node scripts/playwright-smoke-server.mjs ${port}`,
    url: baseURL,
    reuseExistingServer,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
