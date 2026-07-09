# tolaria-setup — Tolaria's agent-native engineering setup, as a profile

🌐 Part of the [agent-native-setup registry](https://lucamastrostefano.com/agent-native-setup/) — browse all community profiles.

An [agent-native-setup](https://github.com/luca-mastrostefano/agent-native-setup) profile
extracted from **[Tolaria](https://github.com/refactoringhq/tolaria)** — a production
Tauri + React + Rust app with an unusually disciplined agent workflow. Scaffolding from
this profile reproduces that workflow in a new repo:

- **The contract** — `AGENTS.md` (with `CLAUDE.md`/`GEMINI.md` compatibility shims):
  direct-to-main flow, mandatory TDD (Red → Green → Refactor, one cycle per commit),
  release-readiness checklist, never `--no-verify`.
- **Code health as a ratchet** — CodeScene gates at file level (every touched file leaves
  with a higher score), plus repo-level Hotspot/Average thresholds in
  `.codescene-thresholds` that only move up; Codacy + Semgrep for security findings.
- **Two-tier git gates** — `.husky/pre-commit` (lightweight lint) and `.husky/pre-push`
  (build + coverage floors + Playwright smoke + CodeScene), with optional
  **Chunk sidecar lanes** (`.chunk/`) that move the heavy gates to remote runners.
- **The ADR system** — `docs/adr/` (Nygard format, YAML frontmatter,
  `proposed → active → superseded` lifecycle, never-edit-supersede rule) with the
  `/create-adr` command, plus living `ARCHITECTURE.md` / `ABSTRACTIONS.md` /
  `GETTING-STARTED.md` skeletons the contract keeps in sync with code.
- **Task-loop commands** — `/laputa-next-task` and `/laputa-done` glue the agent to a
  Todoist board (pick → work → QA → complete → self-dispatch). Opt-in via a prompt; the
  section IDs are prompts too.
- **CI** — the quality workflow (lint/build/coverage/CodeScene/docs), docs deploy, and
  auto-update PRs.

## Use it

**One command, no install.**

```bash
brew install uv   # if you don't have uv yet — docs.astral.sh/uv
uvx --from git+https://github.com/luca-mastrostefano/agent-native-setup agent-native-setup \
  -o ./my-app --profile git+https://github.com/luca-mastrostefano/tolaria-setup.git
```

Append `@v0.2.0` to the profile URL to pin a release. `profile validate` classifies this
profile as **unsafe** — it ships git hooks and onboarding steps that run on your machine —
so the wizard shows what it will do and asks you to approve before writing anything (a
headless `-y` run needs `--allow-code`).

Already have the engine installed? `agent-native-setup my-app -o ./my-app --profile
git+https://github.com/luca-mastrostefano/tolaria-setup.git` does the same.

The prompts ask about the Todoist loop; everything else lands as-is. `ONBOARDING.md` in
the scaffolded project walks through the one-time wiring (husky + package scripts,
CodeScene/Codacy credentials, `.env.local`, Chunk).

## What to know before adopting

- **Stack-shaped**: the hooks and CI assume pnpm + TypeScript (+ optionally Rust/Tauri and
  Playwright). Other stacks can keep the contract and the ADR system and rewrite the gates.
- **Faithful, not genericized**: `AGENTS.md` §2 (Product Rules) and the QA-scripts
  reference keep Tolaria's product specifics on purpose — they're the best example of what
  *your* product rules should look like. Onboarding tells the agent to adapt or prune them.
- **External services**: CodeScene, Codacy, and optionally Chunk (CircleCI), Sentry,
  PostHog, Todoist, Lara. All referenced by env var / secret name only — nothing embedded.
- **MCP**: Tolaria's MCP server is a product component (it ships inside the app), so it is
  deliberately not part of this profile; the `.claude` permission allowlist for the
  CodeScene MCP is.

## Attribution

The templates are derived from the publicly available Tolaria repository
(<https://github.com/refactoringhq/tolaria>), read and parameterized into a profile. This
project is not affiliated with, endorsed by, or maintained by Tolaria's authors.

Tolaria is licensed under AGPL-3.0. The licensing of these derived templates is currently
being clarified with Tolaria's maintainers; the `LICENSE` file in this repository may
change as a result. If you are considering depending on this profile, be aware that its
terms are not yet settled.
