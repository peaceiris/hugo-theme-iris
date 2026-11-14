## Contributing Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Find Similar Issues or Pull Requests](#find-similar-issues-or-pull-requests)
- [Develop](#develop)
- [Create Commit and Push](#create-commit-and-push)
- [Open Pull Request](#open-pull-request)
- [Update Local Repository](#update-local-repository)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Find Similar Issues or Pull Requests

Nothing? Then, open a new issue first, and discuss problems or proposals.



## Develop

```sh
# (1) Fork this repository on GitHub.

# (2) Clone your fork repository to your local.
git clone https://github.com/<username>/hugo-theme-iris.git
cd ./hugo-theme-iris

# (3) Start Hugo Server with Docker.
make docker-dev
```


For native development, install the Hugo version from `make get-hugo-version`,
Go, and the Node.js version in `.nvmrc`, then run:

```sh
npm ci
make npm-ci
make setup-sass
npm test
make build-staging
make build-prod
make dev
```

CI uses the same `make setup-sass` command. The installer pins Dart Sass and
checksums in `exampleSite/scripts/setup-dart-sass.sh`; update them together.
Make adds its installation directory to PATH for native commands. For direct
`hugo` commands, export
`PATH="${HOME}/.local/share/hugo-theme-iris/dart-sass:${PATH}"` first.
`SASS_INSTALL_DIR` can override this directory (outside the project).
The installer supports Linux (glibc) and macOS on x64/arm64 and can be rerun.
Docker commands continue to use the compiler included in the Hugo image and do
not require installing Dart Sass on the host.

`make fetch-data` uses an authenticated GitHub CLI to refresh repository data,
then runs `exampleSite/scripts/fetch_images.mjs` with the Node.js version in
`.nvmrc`. The image downloader uses only Node.js built-ins. It scans
`exampleSite/content/**/*.md` for PNG/JPG/JPEG URLs on
`user-images.githubusercontent.com`, caches them under `assets/images` using
SHA-256 filenames, and skips existing files. Failed image downloads are logged
and do not stop the remaining downloads.

Run `make test-fetch-images` for offline downloader tests. These also run through
`npm test` and the CI staging build.


## Create Commit and Push

```sh
git checkout -b feat-something-option
vim ./path/to/files
git add ./path/to/files
git commit -m "feat: Add something option"
git push origin feat-something-option
```



## Open Pull Request

On Github.



## Update Local Repository

```sh
git remote add upstream https://github.com/peaceiris/hugo-theme-iris.git
git checkout main
git pull upstream main
```
