# react-expo-claude-test

An [Expo](https://expo.dev) app, Expo Router-based, on SDK 57.

## Get started

```bash
npm install
npx expo start
```

From the CLI output you can open the app in a [development
build](https://docs.expo.dev/develop/development-builds/introduction/), an
[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/),
an [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Expo
Go](https://expo.dev/go).

## Project structure

- `src/app/` — [file-based routes](https://docs.expo.dev/router/introduction).
  Routes stay thin: `src/app/index.tsx` just renders a feature component, it
  doesn't hold logic itself. **Nothing else belongs in this directory** —
  Expo Router bundles every file under it via `require.context`, including
  test files, so a colocated `*.test.tsx` here would ship test-only code into
  the production bundle.
- `src/screens/` — the actual screen components (and their tests), rendered
  by a thin route.
- `src/utils/TestUtils.tsx` — the provider-wrapping custom `render`/`screen`
  for component tests. Import `render`/`screen` from here, not directly from
  `@testing-library/react-native`, so tests stay wired to whatever global
  providers the app grows over time.

## Quality gate

```bash
npm run lint        # eslint-config-expo/flat
npm run format       # prettier --check
npm run format:write  # prettier --write
npm run typecheck    # tsc --noEmit
npm test             # jest
npx expo-doctor       # SDK/dependency sanity check
```

All of the above run in CI on every pull request — see
[`.github/workflows/pr-checks.yml`](.github/workflows/pr-checks.yml). It also
runs `npx expo export` for both `ios` and `android` — a JS bundle export (not
a native compile) that exercises Metro bundling and config-plugin resolution
for each platform — no external credentials needed for any of this.

Run the exact same sequence locally before opening a PR:

```bash
npm run check
```

**What this CI doesn't catch**: a native compile error, or a real
App Store/Play Store build. `expo export` and `expo-doctor` narrow that gap
but don't close it — see the EAS section below for where real builds happen.

## Native builds and store releases (EAS)

`eas.json` and `.eas/workflows/` are scaffolded as **reference, not yet
active** — they need an EAS account, Apple/Google credentials, and a few
placeholder values filled in before anything will run. See
[`.eas/workflows/README.md`](.eas/workflows/README.md) for the full setup
checklist. Once wired up:

- `nightly-beta.yml` builds both platforms from `main` nightly and ships to
  internal testers only (TestFlight internal group / Play internal track) —
  no human review step at that tier on either store.
- `promote-to-external.yml` is manually triggered to resubmit an
  already-built artifact to wider testing, without rebuilding.

## Agent tooling (Claude Code)

This repo runs on the [Chassis](https://github.com/willowtreeapps/chassis)
Claude Code plugin — roles, skills (`/plan`, `/dispatch`, `/review`,
`/deliver`, `/checkup`, `/onboard`, ...), and doctrine for how agents should
work in this repo. `chassis:checkup` reports on install/project health;
`chassis:dispatch` routes implementation work to the right role. Chassis's
own persistent memory (`~/.chassis`) lives outside this repo — it's shared
across every project you use it on, not specific to this one.

The official `expo` Claude Code plugin is also enabled, providing Expo/EAS
domain skills (e.g. `eas-app-stores`, `eas-workflows`) consulted when working
on native-build or store-release tasks.
