# Building the tolaria-setup profile — agent contract

You're working on an **agent-native-setup profile** extracted from
[Tolaria](https://github.com/refactoringhq/tolaria). A profile is two things:
`profile.json` and `templates/` (the files it ships). Everything else here — this file,
README.md — is meta and never ships.

## Rules

- **Fidelity first.** This profile reproduces Tolaria's setup; when upstream improves a
  gate or the contract, re-extract rather than diverging. Parameterize only identity
  (`{{ project_name }}`) and instance-bound values (the Todoist section IDs are prompts).
- **Jinja hazards.** Files shipped verbatim (hooks, workflows, `.chunk/` scripts) may
  contain `${{ … }}` or `{ … }` freely; anything renamed to `.j2` must be checked for
  literal `{{`/`{%` first (GitHub workflow files stay verbatim for exactly this reason).
- **Before calling it done**, run `agent-native-setup profile validate .` and scaffold a
  throwaway project from the profile to confirm the tree lands as intended.
