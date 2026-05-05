# Repository Guidelines

## Project Structure & Module Organization

This repository is a Hugo theme with an example site used for development and validation. Theme templates live in `layouts/`, including partials, shortcodes, default render hooks, and page templates. Theme styles and generated assets live under `assets/theme/`, with SCSS in `assets/theme/scss/`. Content, configuration, translations, static files, and data for the demo site are in `exampleSite/`. Archetype templates are in `archetypes/`, install/setup helpers are in `scripts/`, and Hugo dependency version metadata is tracked in `deps/`.

## Build, Test, and Development Commands

- `npm ci`: install root development tools and hooks.
- `make npm-ci`: install `exampleSite` npm dependencies.
- `make dev` or `npm run dev`: run the example site with `hugo server`.
- `make test` or `npm test`: render the example site in memory with warnings, debug output, and template metrics.
- `make build-staging`: build the staging example site with minification and diagnostics.
- `make build-prod` or `npm run build`: build the production example site into `exampleSite/public`.
- `make docker-dev`, `make docker-test`, `make docker-build`: run the same workflows through Docker Compose using the Hugo version from `deps/go.mod`.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, two-space indentation, final newline, and no trailing whitespace. `Makefile` recipes must use tabs. Keep Hugo templates idiomatic: partials in `layouts/partials/`, shortcodes in `layouts/shortcodes/`, and lowercase hyphenated filenames such as `share-buttons.html`. Keep SCSS changes scoped to `assets/theme/scss/` unless generated CSS is intentionally maintained.

## Testing Guidelines

There are no unit tests in this theme. Treat a clean Hugo render as the required regression test. Run `npm test` before commits that touch templates, assets, configuration, content examples, or dependencies. For dependency automation changes, run `npm run test:renovate`. When UI output changes, validate locally with `make dev` and include screenshots or a short visual note in the PR.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits, for example `build: bump hugo from v0.124 to v0.125`, `chore(deps): update node.js to v24`, and `ci: increase timeout for renovate job`. Keep commits focused and use a lowercase type such as `feat`, `fix`, `chore`, `ci`, or `docs`. Pull requests should describe the change, link related issues, list verification commands, and include screenshots for visible theme changes.

## Agent-Specific Instructions

When acting as an automated contributor in this repository, communicate with the user in Japanese unless they request another language.
Use English for repository-facing content, including documentation, code comments, commit messages, and pull request text, unless the task explicitly requires another language.
