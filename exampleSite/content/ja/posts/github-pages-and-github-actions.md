---
title: GitHub Pages and GitHub Actions
description: GitHub Actions による GitHub Pages へのデプロイ
publishdate: 2019-11-01T01:00:00.000Z
# draft: true
eyecatch: 'https://user-images.githubusercontent.com/30958501/121798925-0c4b7600-cc64-11eb-89eb-92d2e8f746db.jpg'
# tags: ["GitHub Actions"]
toc: true
# math: true
# weight: 1
canonicalURL: https://github.com/peaceiris/actions-gh-pages
---



## GitHub Actions for GitHub Pages

> GitHub Actions for GitHub Pages 🚀 Deploy static files and publish your site with Static Site Generators
> <cite>[peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)</cite>

This is a **GitHub Action** to deploy your static files to **GitHub Pages**.
This deploy action can be combined simply and freely with [Static Site Generators](https://www.staticgen.com/ "StaticGen")
(Hugo, mdBook, MkDocs, Gatsby, GitBook, etc.).

```yaml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
    publish_dir: ./public
```

The above example step will deploy `./public` directory to `gh-pages` branch.



## Example workflow

Here is an example workflow for Hugo project.
Creat YAML file `.github/workflows/gh-pages.yml` and push to your remote default branch.

```yaml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    deploy_key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
    publish_dir: ./public
```
