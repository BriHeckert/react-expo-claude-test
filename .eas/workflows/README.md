# EAS Workflows — reference scaffold

These workflow files (and the `submit`/`build` profiles in `../../eas.json`)
are **not runnable yet**. They're scaffolded ahead of time so this repo can be
used as a reference when setting up the real project. Nothing here executes
until the one-time setup below is done — EAS Workflows run on EAS's own
infrastructure, not GitHub Actions, and only fire once this repo is connected
to an EAS project.

## Files

- **`nightly-beta.yml`** — every night, builds both platforms from `main` and
  ships straight to internal testers (TestFlight internal group / Play
  internal track). No human review step at this tier on either platform.
- **`promote-to-external.yml`** — manually triggered. Resubmits an
  _already-built_ artifact from a nightly run to wider testing (TestFlight
  external group / Play beta track), instead of rebuilding.

## One-time setup, before any of this can run

1. **EAS account + project**: `eas login`, then `npx eas-cli@latest init` from
   this repo to link it to an EAS project.
2. **Connect GitHub to EAS**: Expo dashboard → Project Settings → GitHub.
   This is what lets EAS see the `schedule` trigger and any push events at
   all — GitHub Actions and EAS Workflows are separate systems that don't
   talk to each other directly.
3. **iOS**: an Apple Developer Program membership ($99/yr) and an app record
   already created in App Store Connect (bundle ID must match `app.json`).
   Then an App Store Connect API key (`.p8`) — Users and Access → Keys, "App
   Manager" role minimum — stored as an EAS Secret:
   ```
   eas secret:create --name APPLE_ASC_API_KEY --type file --value ./AuthKey_XXXXX.p8
   ```
   Fill in `eas.json`'s `ascAppId`, `ascApiKeyIssuerId`, `ascApiKeyId`
   placeholders, and the TestFlight group name placeholders in both workflow
   files (Internal group for nightly, External group for promotion).
4. **Android**: a Google Play Console account, the app created there, and a
   GCP service account (IAM & Admin → Service Accounts) with a JSON key,
   linked to Play Console (Setup → API access) with release permission.
   Stored as an EAS Secret:
   ```
   eas secret:create --name GOOGLE_SERVICE_ACCOUNT --type file --value ./google-service-account.json
   ```
5. **Slack failure notifications** (optional, `nightly-beta.yml` only): a
   Slack incoming webhook URL, stored as an EAS Secret named
   `SLACK_WEBHOOK_URL`.
6. **Validate before trusting any of this**:
   ```
   npx -y eas-cli@latest workflow:validate .eas/workflows/nightly-beta.yml --non-interactive
   npx -y eas-cli@latest workflow:validate .eas/workflows/promote-to-external.yml --non-interactive
   ```
   This needs a logged-in EAS CLI session and a linked project — run it
   after steps 1–4, not before. It checks build-profile references against
   `eas.json` and does EAS-side schema validation; a local YAML linter isn't
   a substitute for it.

## Known gaps in this scaffold

- The `groups`/review-gate behavior for iOS _external_ promotion is described
  from documentation, not verified against a live run — re-check
  `eas submit --help` when you actually wire this up.
- No cost estimate is baked in here: every nightly run is a real, billed EAS
  build on both platforms, on top of the Apple Developer Program fee. Size
  against your EAS plan's included build minutes before turning the schedule
  on.
