#!/usr/bin/env node

// Boots the dev server the smoke lane runs against, on a fixed port, and forwards
// signals so Playwright's `webServer` (and the Chunk shard runner, which invokes
// this directly) can start/stop it cleanly.
//
// Assumes a Vite-style `pnpm dev --host --port --strictPort` app. Swap the spawn
// command below if your dev server takes different flags.
//
// TOLARIA_VITE_CACHE_DIR: a per-port cache dir so parallel smoke shards don't
// stomp each other's Vite cache. The name is shared with .chunk/run-playwright-shards.sh
// (which sets it) — rename in both places together if you change it.

import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const port = process.argv[2] ?? process.env.PORT ?? '41741'
const viteCacheDir = process.env.TOLARIA_VITE_CACHE_DIR ?? join(tmpdir(), `vite-smoke-${port}`)

const child = spawn(
  'pnpm',
  ['dev', '--host', '127.0.0.1', '--port', port, '--strictPort'],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      TOLARIA_VITE_CACHE_DIR: viteCacheDir,
    },
    stdio: ['pipe', 'inherit', 'inherit'],
  },
)

function forwardSignal(signal) {
  if (child.killed) return
  child.kill(signal)
}

process.on('SIGINT', () => forwardSignal('SIGINT'))
process.on('SIGTERM', () => forwardSignal('SIGTERM'))

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
