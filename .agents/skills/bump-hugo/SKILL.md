---
name: bump-hugo
description: Guide Hugo version migrations in this Hugo theme. Use when updating the pinned github.com/gohugoio/hugo module in deps/go.mod, refreshing deps/go.sum, deriving scoped exampleSite demos from Hugo release notes, checking theme.toml min_version, validating render hooks/templates, and preparing migration notes or PRs.
---

# Bump Hugo

## Overview

Use this skill to migrate `peaceiris/hugo-theme-iris` to a newer Hugo release without turning the change into unrelated theme redesign or dependency churn.

Follow the repository pattern from prior Hugo bumps: update the pinned Hugo module, read the relevant Hugo release notes, add small example-site coverage only for features or fixes that matter to this theme, then validate the rendered example site.

## Workflow

1. Establish the migration target.
   - Read the user request or linked GitHub issue/PR.
   - Check the current pinned version with `make get-hugo-version`.
   - If the request says "latest" or names only a minor line, verify the actual latest patch from official Hugo release tags or `go list -m -versions github.com/gohugoio/hugo`.
   - Read official Hugo release notes and docs for every relevant minor or patch between the current and target versions.

2. Update the Hugo dependency pin.
   - Treat `deps/` as the only Go module for the Hugo pin update unless the task explicitly asks for broader module updates.
   - Do not run `go get` or `go mod tidy` from the repository root for this migration.
   - From `deps/`, run `go get github.com/gohugoio/hugo@vX.Y.Z`, then `go mod tidy`.
   - Preserve the `deps/go.mod` Go directive in the repository's CI-compatible major.minor form. If `go get` rewrites it to a patch version such as `go 1.21.8`, restore it to `go 1.21` unless the project intentionally changed the CI toolchain to support patch directives.
   - Confirm `deps/go.mod` has the requested Hugo version and `deps/go.sum` changed only as needed.
   - Re-run `make get-hugo-version` from the repository root and confirm it prints the target version. If it prints nothing, `make docker-build` will derive `HUGO_VERSION=v` and fail to pull the Hugo Docker image.

3. Add scoped examples for new Hugo behavior.
   - Prefer `exampleSite/` changes over theme-level API changes unless the new Hugo feature directly benefits theme users.
   - Keep examples small and discoverable from existing example-site content.
   - Derive the example from the release notes instead of copying an older migration's feature list.
   - Update `README.md` only when the migration adds or changes user-facing theme usage.
   - Do not fetch remote data during Hugo builds.

4. Review compatibility surfaces.
   - Inspect `layouts/_default/_markup/` render hooks when release notes mention render hook, Markdown, link, or image behavior.
   - Add targeted content only when it proves or protects the migration behavior.
   - Keep `theme.toml` `min_version` unchanged unless the theme or example site now relies on behavior unavailable in the old minimum version. If changed, set it to the minimum Hugo version that actually provides the required behavior and mention the reason in the PR.

5. Validate.
   - Before Docker validation, confirm `make get-hugo-version` prints the target Hugo version so the Docker image tag is `vX.Y.Z`, not just `v`.
   - Run `make docker-build` as the primary verification command.
   - For visible output changes, run `make dev` and inspect the affected example pages.
   - If a command cannot run locally, record the exact blocker and what was still verified.

## Release Feature Assessment

Use the release notes to decide which, if any, scoped changes are worth adding beyond the dependency bump.

- For Markdown or markup features, add configuration only for the specific extension or renderer behavior being demonstrated. Put the smallest useful examples in an existing Markdown syntax page or a similarly relevant example page.
- For content generation features, prefer local/static data and deterministic output. Avoid remote fetches, clocks, or environment-dependent sources during builds.
- For shortcode, template, function, or partial changes, add a small demo only when it documents a new user-facing capability or protects a real theme behavior.
- For render hook, link, image, or heading fixes, inspect the existing hooks and add targeted content only when the release notes describe behavior this theme already handles or is likely to encounter.
- For configuration changes, keep the setting close to the example site unless the theme itself requires the new behavior.
- For deprecated or removed Hugo behavior, update the affected template/configuration directly and keep compatibility notes in the PR.

## Scope Control

- Do not add examples for every Hugo release-note item. Cover only features, fixes, or deprecations that are relevant to this theme, the example site, or the user's linked issue.
- Do not update unrelated npm, Docker, theme, or example content dependencies as part of a Hugo bump.
- Do not change visual design unless the Hugo migration requires it.
- Do not raise `theme.toml` `min_version` merely because the pinned validation version changed.
- Do not leave a patch-version `go` directive in `deps/go.mod` unless the repository CI has been updated to parse it.
- Keep generated content paths stable and watch for duplicate path warnings.

## PR Notes

- Use a concise summary that states the old and new Hugo versions.
- Mention the `deps/` update explicitly, including the `deps/go.mod` pin change and refreshed `deps/go.sum`.
- List the example-site features added for the migration.
- Include the `theme.toml` `min_version` decision.
- Include the `make docker-build` verification result.
- A suitable commit title is `build: bump hugo from vA.B to vX.Y`.
