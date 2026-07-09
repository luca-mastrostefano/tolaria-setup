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

## Lifecycle: cutting a release

A release **is** its git tag plus the `content_hash` over `profile.json` + `templates/` that the
[community index][idx] pins. The index stores **no version field** — the tag in its `url`
(`…@vX.Y.Z`) is the only version an adopter can ever see.

The loop, every time you change `profile.json` or anything under `templates/`:

```bash
agent-native-setup profile validate .   # zero errors; resolve every advisory ⚠
# bump `version` in profile.json — pre-1.0, a minor bump counts as breaking (adopters' `update` pauses)
git commit -am "…" && git tag v<version> && git push --follow-tags
agent-native-setup profile publish . --release   # attaches the release asset, refreshes the index entry
```

**Never re-use a version; never move a tag.** A pinned tag is cached forever on an adopter's
machine and never re-fetched, so re-tagging the same version reaches nobody who already has it —
while the moved bytes stop matching the hash the index vouched for, and every *new* install by
name is refused (*"no longer matches the hash vetted in the community index"*). Nothing enforces
this for you: `publish` never checks that you bumped. Bumping `version` rewrites the hash by
itself (the hash covers `profile.json`), so **the tag and the index listing must always move
together** — publish every change you ship, and ship every change you publish.

`publish` hashes your **working tree**, while the release asset is built from the **tag's
committed tree**. `git status --porcelain profile.json templates/` must be empty before you
publish, or the `content_hash` you list won't match the artifact adopters download.

## How adopters pick up a new version

**Not with `update` alone.** `agent-native-setup update` re-resolves the `source` recorded in the
adopter's project; for a name install that is their own copy under
`~/.config/agent-native-setup/profiles/tolaria-setup`, which never re-consults the index. And
`profile add` refuses to overwrite an existing copy. So the real upgrade is:

```bash
rm -rf ~/.config/agent-native-setup/profiles/tolaria-setup \
  && agent-native-setup profile add tolaria-setup && agent-native-setup update
```

Say this in your release notes: an adopter who only runs `update` sees nothing.

[idx]: https://github.com/luca-mastrostefano/agent-native-setup/blob/main/contributions/index.json
