---
title: lighthouse を GitHub Actions で実行する
description: GitHub Actions で lighthouse を実行してサイトパフォーマンスをテストする。
publishdate: 2019-10-01T01:00:00.000Z
# draft: true
eyecatch: images/lighthouse-github-actions.jpg
# tags: ["GitHub Actions"]
# toc: true
# math: true
# mermaid: true
# weight: 1
twitter:
  username: piris314
  hashtags: ["GitHubActions"]
---



## lighthouse

No Docker action.



## Example lighthouse workflow

```yaml
name: lighthouse

on:
  # push:
  schedule:
    - cron: '23 23 * * 0'

jobs:

  test:
    runs-on: ubuntu-18.04
    steps:
    - uses: actions/checkout@v2

    - name: Install lighthouse
      run: sudo npm i -g lighthouse

    - name: Run lighthouse
      run: |
        lighthouse \
          --chrome-flags="--headless" \
          --output html --output-path /tmp/report.html \
          'https://peaceiris.com'
        mkdir ./public
        cp /tmp/report.html ./public/report.html

    - name: Upload result
      uses: actions/upload-artifact@master
      with:
        name: report
        path: /tmp/report.html
```



## Deploy result to GitHub Pages

```yaml
name: lighthouse

on:
  # push:
  schedule:
    - cron: '23 23 * * 0'

jobs:

  test:
    runs-on: ubuntu-18.04
    steps:
    - uses: actions/checkout@v2

    - name: Install lighthouse
      run: sudo npm i -g lighthouse

    - name: Run lighthouse
      run: |
        lighthouse \
          --chrome-flags="--headless" \
          --output html --output-path /tmp/report.html \
          'https://peaceiris.com'
        mkdir ./public
        cp /tmp/report.html ./public/report.html

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v2.4.0
      env:
        ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        PUBLISH_BRANCH: gh-pages
        PUBLISH_DIR: ./public
      with:
        keepFiles: true
```
