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


Use `make docker-test` and `make docker-build` to validate the example site.
Docker commands use the compiler included in the Hugo image and do not require
installing Hugo or Dart Sass on the host.

For native development, first install the Hugo version from
`make get-hugo-version`, Go, the Node.js version in `.nvmrc`, and the official
[standalone Dart Sass 1.108.2](https://github.com/sass/dart-sass/releases/tag/1.108.2)
for your platform. Extract Dart Sass outside the project and add its directory
to your shell's `PATH` so `sass --version` prints `1.108.2`. The npm `sass`
package does not provide the embedded protocol Hugo requires. Then run:

```sh
npm ci
make npm-ci
npm test
make build-staging
make build-prod
make dev
```

CI installs Hugo and Dart Sass through `peaceiris/actions-hugo`; the
`dart-sass-version` input in `.github/workflows/ci.yml` pins the compiler version.

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
