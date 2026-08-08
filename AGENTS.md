# Agent guide — start here

> Audience: an agent working inside a widget repo scaffolded from
> `create-grist-widget` (this file travels with the scaffold), or working on
> this template's own source under
> `templates/grist-widget-template-vite/` inside the `grist-widget-sdk`
> monorepo. This repo is a **distribution artifact** — `main` is force-pushed
> from a fresh scaffold on every release, not developed on directly upstream.
> If you're in the monorepo working on the SDK itself, read the root
> `AGENTS.md` instead.

## The widget contract

`src/App.tsx` is the whole widget — one file, three exports:

```tsx
export const GRIST_OPTIONS: UseGristOptions = { requiredAccess: "read table" }
export const WIDGET_METADATA = { title: "...", description: "..." } as const
export function App() {
  const w = useGrist()
  // ...
}
```

`src/main.tsx` wires it into Grist: `GristWidgetProvider` (reads `GRIST_OPTIONS`) →
`GristBoundary` → `GristSdkAlerts` → `<App />`. Access level, column mapping, and
rendering all live in `src/App.tsx` — that's the one file to edit.

## Operating contract

1. **Widgets use the SDK.** No direct `window.grist.*` calls — use `useGrist()` and the
   other `grist-widget-sdk` hooks.
2. **`pnpm dev` shows the showcase hub today, not a seeded preview.** Opened outside Grist
   it renders `TemplateLanding` (onboarding + links to released versions); the widget
   itself only renders once actually embedded in a Grist document. An offline, seeded
   `pnpm dev` loop is planned but not shipped in this template yet — don't describe one as
   if it exists.
3. **No test command yet.** `package.json` has no `test` script in this template today —
   don't invent one or assume `pnpm test` works here.
4. **Always develop on `dev`, release by merging to `main`.** Commit and push to `dev` for
   every change — it auto-deploys a live preview at `.../dev/` that self-reloads inside an
   open Grist document a few seconds later. Bump `package.json`'s `version` *before*
   opening the `dev` → `main` PR: merging without a version bump publishes nothing (the
   release build silently no-ops whenever that version's directory already exists — the PR
   merges cleanly and CI reports success either way).

## Commands

| Intent | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev server (showcase hub outside Grist) | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| Type-check | `pnpm typecheck` |
| Preview a production build | `pnpm preview` |

## Path map

| Concept | Path |
| --- | --- |
| The widget | `src/App.tsx` |
| Grist wiring / embed vs. showcase detection | `src/main.tsx` |
| ui primitives | `src/components/ui/` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Deploy script (version guard, channel logic) | `scripts/deploy.mjs` |
| Full walkthrough (dev loop, deploying, embedding) | `README.md` |
| Changelog | `CHANGELOG.md` |

## One-time repo settings

Only needed once, after the first push triggers the deploy workflow's first run (it
creates a `gh-pages` branch — these settings can't be applied before that exists):

1. Settings → Pages → Source → **Deploy from a branch** → branch `gh-pages`, folder
   `/ (root)`. Not `main` — pointing Pages at `main` serves this repo's raw, unbuilt source
   instead of the built site (symptom: a blank page with a `/src/main.tsx` 404).
2. If that first workflow run fails with a permissions error pushing to `gh-pages`:
   Settings → Actions → General → Workflow permissions → **Read and write permissions**.
   Most repos don't need this; it depends on account/org defaults.

Full detail, including the two live URLs (`/latest/` and `/v<version>/`): `README.md`.

## Anti-patterns

- Calling `window.grist.*` inside widget code instead of the SDK's hooks
- Describing a `pnpm test` command or a seeded offline `pnpm dev` preview — neither exists
  in this template yet
- Merging `dev` into `main` without bumping `package.json`'s `version` first
