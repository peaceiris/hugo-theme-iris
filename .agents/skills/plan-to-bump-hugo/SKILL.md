---
name: plan-to-bump-hugo
description: Create or draft GitHub planning issues for Hugo version bumps in this Hugo theme repository. Use when the user asks to plan a Hugo migration, bump/upgrade Hugo, create an issue like an earlier Hugo migration plan, or open a new issue describing tasks, references, and validation for a future Hugo upgrade.
---

# Plan To Bump Hugo

## Overview

Create a focused planning issue for a Hugo version migration. Base the issue on the repository's current pinned Hugo module, the requested or latest appropriate target version, and the Hugo release notes between those versions.

The plan should explicitly state that the Hugo dependency update happens inside the `deps/` Go module, not at the repository root.

## Workflow

1. Determine the current pinned Hugo version from `deps/go.mod`:

   ```bash
   rg 'github.com/gohugoio/hugo' deps/go.mod
   ```

2. Determine the target version:
   - If the user provided a full version, use that version after checking it exists.
   - If the user provided a minor line, target the latest patch in that minor line.
   - If the user asked for the next upgrade without a version, choose the latest patch in the next minor line after the current pinned version.
   - Do not jump multiple minor lines unless the user asks for that.

3. Collect context before writing the issue:
   - Read the relevant Hugo release notes from the current version exclusive through the target version inclusive.
   - If the user provided an example issue or PR, inspect it for tone, structure, and scope.
   - If no example was provided, inspect recent repository issues or PRs about Hugo migrations and use the closest match as a style reference.
   - Check repository files that may influence the plan, especially `deps/go.mod`, `deps/go.sum`, `theme.toml`, `exampleSite/`, `layouts/`, `README.md`, and build scripts.

4. Identify migration work:
   - Always include updating the Hugo pin in `deps/go.mod` and refreshing `deps/go.sum`.
   - Mention that the update commands should be run from `deps/` and that the resulting `deps/` diff should be reviewed for necessary transitive changes only.
   - Include `theme.toml` `min_version` only when the theme or example site will rely on behavior introduced by the target Hugo version.
   - Add example-site tasks for new Hugo features only when they are relevant to this theme and can be demonstrated with local/static data.
   - Include checks for render hooks, templates, shortcodes, content rendering, markup configuration, image handling, multilingual behavior, and deprecations when release notes indicate risk.
   - Keep the plan scoped to the Hugo bump. Avoid unrelated redesign, dependency churn, formatting churn, or opportunistic refactors.

5. Draft the issue body with the structure below. Keep language concrete and actionable.

6. Create the issue only when the user asked to create/open a GitHub issue. If the request was only to draft or plan, return the title and body without creating it. Use `gh issue create --title ... --body-file ...` for creation, then report the issue URL.

## Issue Template

Use this structure:

```markdown
## Summary

Plan the migration from Hugo `<current>` to `<target>`.

When an example issue or PR is relevant: Follow the pattern from <example issue or PR>.

<One or two short paragraphs summarizing the most relevant Hugo changes in this version range and why the issue targets `<target>` rather than an earlier patch in the same minor line.>

## Tasks

- Update the pinned Hugo module in `deps/go.mod` from `<current>` to `<target>`.
- Refresh `deps/go.sum` from the `deps/` Go module and review the diff for necessary transitive dependency changes only.
- Update `theme.toml` `min_version` if the theme or example site starts relying on `<target-minor>`-only behavior.
- Add or update example-site coverage for <feature or behavior>, using local/static data only when builds are involved.
- Check whether existing render hooks, templates, shortcodes, and markup configuration need changes for the Hugo release notes in scope.
- Keep the migration scoped; avoid unrelated theme redesign or dependency churn.

## References

- <prior repository issue or PR URL, if useful>
- <Hugo release URL for each relevant release>
- <Hugo documentation URL for each feature that appears in the task list>

## Test plan

- `make docker-build`
- Run `make dev` and visually confirm:
  - the new or updated example-site coverage renders correctly,
  - existing shortcodes, render hooks, and multilingual pages still render,
  - no unexpected warnings appear during local development.
```

Adjust the visual confirmation bullets to match the planned change. Remove bullets that do not apply, but keep `make docker-build` as the primary verification command for Hugo theme migrations.

## GitHub Notes

Prefer GitHub CLI or the GitHub connector for repository data. Useful CLI calls:

```bash
gh api repos/gohugoio/hugo/releases/latest --jq '.tag_name'
gh api repos/gohugoio/hugo/releases/tags/<target-version-with-leading-v> --jq '{name: .name, html_url: .html_url, body: .body}'
gh issue list --repo peaceiris/hugo-theme-iris --search 'Hugo migration OR Hugo bump OR Hugo upgrade' --json number,title,url,body --limit 10
gh pr list --repo peaceiris/hugo-theme-iris --search 'Hugo migration OR Hugo bump OR Hugo upgrade' --json number,title,url,body --limit 10
```

When creating the issue, write the body to a temporary file outside the repository and pass it with `--body-file` so no planning artifact is left in the working tree.
