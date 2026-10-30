# CLAUDE.md

Teaching website **classrooms.app** (Gymnasium Biel-Seeland, ICT/Informatik). It is a detached fork of [teaching-dev](https://github.com/GBSL-Informatik/teaching-dev) ("tdev"), built on Docusaurus 3 + React 19 + MobX. Content is in **German (Swiss spelling: `ss`, never `ß`)**.

## Commands

```bash
yarn start              # dev server (localhost:3000) + package-docs watcher
yarn build              # prebuild runs `sync` (material → versioned_docs) first
yarn sync               # copy material into class versions per material.config.yaml
yarn typecheck          # tsc
yarn format             # prettier --write .   (CI runs format:check on push/PR)
yarn test               # vitest (tests in updateSync/tests, packages/*/tests)
yarn updateTdev         # pull upstream teaching-dev changes (see below)
```

Node `>=24.13`, yarn workspaces (`packages/**`). `DOCS_ONLY=1` skips loading class versions for a faster dev start. Env vars are documented in [README.md](README.md); `.env` is gitignored.

## Upstream vs. own code — the most important rule

`yarn updateTdev` overwrites everything listed under `trackedElements` in [updateTdev.config.yaml](updateTdev.config.yaml) with the upstream copy from `../teaching-dev`. **Do not put custom changes in tracked paths** — they will be lost:

- `src/` (except `src/theme/MDXComponents.tsx`, `src/theme/Admonition`, `src/theme/DocItem/Footer`)
- `packages/tdev/`, `updateSync/`, `docusaurus.config.ts`, `tsconfig.json` (copied from upstream `tsconfig.tdev.json`), `.prettierrc`, `.prettierignore`, `vitest.config.ts`, `static/bry-libs`, `static/pyodide.sw.js`

Site-specific code belongs in:

| Path | Purpose |
| --- | --- |
| [siteConfig.ts](siteConfig.ts) | Never touched by tdev. Title, navbar, footer, Algolia, versions, docs options, extra plugins, `apiDocumentProviders`. |
| [website/](website/) | Own components, stores, api, helpers, css, pages. Shadows `src/` via path aliases. |
| [navbarItems.ts](navbarItems.ts) | Dev-only navbar links. |
| `src/theme/MDXComponents.tsx` | Globally available MDX components (not overwritten, but watched). |

### Path aliases

`@tdev-components/*`, `@tdev-hooks/*`, `@tdev-models/*`, `@tdev-stores/*`, `@tdev-api/*`, `@tdev-plugins/*` resolve to `website/<x>/*` **first**, then `src/<x>/*`. `@tdev/*` covers `website/`, `src/`, and `packages/tdev/`. `@tdev-original/*` always points at the upstream `src/`. So a file in `website/components/Foo` overrides `src/components/Foo` if both exist.

### Own MobX stores

Register new stores in [website/stores/SiteStore.ts](website/stores/SiteStore.ts) (constructed with the `RootStore`); access via `useStore('siteStore')` (see `AttendanceCheck` for an example).

## Content model

- **`docs/<Material>/`** — the single source of all teaching material, versioned in git. Topics often carry a year suffix (`Programmieren-2025`, `Programmieren-2026`) when reworked; older material moves to `docs_archive/` (not built).
- **`material.config.yaml`** — maps material to classes:
  ```yaml
  30Gg:
    - material: Programmieren-2026   # path relative to docs/
      as: 03-Programmieren           # path inside versioned_docs/version-30Gg/
      ignore: [index-fms.mdx]        # optional, top-level entries only
  ```
- **`versioned_docs/version-<class>/`** — one Docusaurus version per class (`versions.json`). `yarn sync` copies material in and writes a per-version `.gitignore` so synced copies aren't committed. Files *not* coming from material (e.g. the class `index.mdx`, `termine_hs26.json` schedules) are hand-written and tracked. **Edit material in `docs/`, never the synced copies in `versioned_docs/`.**
- Class names: e.g. `29Ge`, `30Gg` (year of graduation + class). Special versions: `draft`, `demo-probe`.
- Use `yarn add docs/<X>/ --to="30Gg,30Gh" --as="03-X"`, `yarn addClass`, `yarn remove` to edit the config from the CLI (they re-sync automatically). See [packages/tdev/material-sync/README.mdx](packages/tdev/material-sync/README.mdx).
- **Submodules** (private): `docs/confidential` (exams, probes) and `website/pages/confidential`. Never move confidential content into public paths.
- `tdev-website/` — upstream tdev documentation site (`SITE_CONFIG_PATH=tdev-website/siteConfig.ts yarn start`); not part of classrooms.app.

## Writing MDX content

- Every page needs a unique `page_id: <uuid v4>` in frontmatter. Interactive documents need their own unique UUID: `<TaskState id="…" />`, `<QuillV2 id="…" />`, `<String id="…" />`, ` ```py live_py id=… `. **Always generate fresh UUIDs** (`uuidgen | tr A-Z a-z`) — never copy existing ones; IDs key persisted student data.
- Common components (globally registered, no import needed): `TaskState`, `Solution`, `QuillV2`, `String`, `Quiz`, `ChoiceAnswer`, `TrueFalseAnswer`, `Hint`, `Steps`, `Tabs`/`TabItem`, `Figure`, `Answer`, `DefBox`. Others (e.g. `Video`, `OsTabs`, `Semesterplan`, `AttendanceCheck`) must be imported from `@tdev-components/...`.
- Custom admonitions: `:::aufgabe`, `:::key[Title]`, `:::insight`, `:::definition`, `:::rule`, `:::convention` (plus defaults).
- Python: ` ```py live_py ` for runnable editors (options `slim`, `readonly`, `title=…`, `showLineNumbers`); Brython and Pyodide are both available.
- Images go in a sibling `img/` folder; size with `![--width=400px](img/x.png)`. Videos: `::video[./img/x.mp4]{autoplay loop=true}`. Scripts in `bin/` convert/compress media (`mov2mp4.sh`, `mp4_*`).
- VS Code snippets in `.vscode/*.code-snippets` scaffold quizzes, components, MobX stores.

## Formatting

Prettier: 4-space indent, single quotes, no trailing commas, print width 110. `.md`/`.mdx` and most `docs/**` assets are prettier-ignored.

## Deployment

Push to `main` → GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) checks out with submodules, runs `yarn build`, deploys to GitHub Pages (`CNAME`: classrooms.app). Old class versions are archived to standalone sites via [bin/archive-version.sh](bin/archive-version.sh).
