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
make up
```



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
git checkout master
git pull upstream master
```
