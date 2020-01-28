[![LICENSE](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peaceiris/hugo-theme-iris/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/hugo-theme-iris.svg)](https://github.com/peaceiris/hugo-theme-iris/releases/latest)
[![release date](https://img.shields.io/github/release-date/peaceiris/hugo-theme-iris.svg)](https://github.com/peaceiris/hugo-theme-iris/releases)
[![release feed](https://img.shields.io/badge/release-feed-yellow)](https://github.com/peaceiris/hugo-theme-iris/releases.atom)
![deploy status](https://github.com/peaceiris/hugo-theme-iris/workflows/Deploy/badge.svg?branch=master&event=push)
[![hugo themes](https://img.shields.io/static/v1?label=Hugo%20Themes&message=IRIS&color=blueviolet)](https://themes.gohugo.io/hugo-theme-iris/)

<h2 align="center">
Hugo IRIS Theme
</h2>

<div align="center">
<img src="https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/images/tn.png" alt="thumbnail" width="500px">
</div>



## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
  - [Features](#features)
  - [Roadmap](#roadmap)
- [Getting Started](#getting-started)
  - [Get Hugo](#get-hugo)
  - [Initialize New Hugo Project](#initialize-new-hugo-project)
- [Hugo Modules](#hugo-modules)
- [Hosting](#hosting)
  - [Netlify](#netlify)
  - [GitHub Pages using Actions](#github-pages-using-actions)
- [Special Thanks](#special-thanks)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Overview

This repository includes the [Hugo] theme.

- [Demo site on GitHub Pages](https://hugothemeiris.peaceiris.app/)

### Features

- Dark theme
- Responsive
- Support Multilingual
<!-- - PageSpeed Insights Scores: Mobile `100`, Desktop `100` -->

### Roadmap

- Netlify, Netlify CMS
- Writing slides using Markdown. ([reveal.js])
- [MathJax]: Beautiful math in all browsers.
- [mermaid]: Generation of diagram and flowchart from text in a similar manner as markdown.



## Getting Started

### Get Hugo

You can find the minimum supported Hugo version in [theme.toml] `min_version`. Using Hugo extended version is desirable.

[theme.toml]: https://github.com/peaceiris/hugo-theme-iris/blob/master/theme.toml

### Initialize New Hugo Project

```sh
mkdir ./homepage && cd ./homepage
git init
git submodule add https://github.com/peaceiris/hugo-theme-iris.git ./themes/hugo-theme-iris
cd ./themes/hugo-theme-iris
git checkout vx.x.x
cd ../..
git commit "Add theme"
cp -r ./themes/hugo-theme-iris/exampleSite/{assets,config,content,data,static} .
vim ./config/_default/config.yaml  # uncomment 'theme: hugo-theme-iris'
hugo server
```

- http://localhost:1313/

*Customize your site! ʕ◔ϖ◔ʔ*

> If your Hugo is not an extended version, you need to copy `resources`.



## Hugo Modules

Get and Update.

```sh
hugo mod get -u github.com/peaceiris/hugo-theme-iris
```

`config/_default/config.yaml`

```yaml
module:
  imports:
    - path: github.com/peaceiris/hugo-theme-iris
```



## Hosting

### Netlify

<!-- Deploy to Netlify Button -->
<!-- https://www.netlify.com/docs/deploy-button/ -->
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/peaceiris/hugo-theme-iris)

### GitHub Pages using Actions

The following actions are useful to deploy your site to GitHub Pages using GitHub Actions.

- [peaceiris/actions-hugo: GitHub Actions for Hugo](https://github.com/peaceiris/actions-hugo)
- [peaceiris/actions-gh-pages: GitHub Actions for GitHub Pages](https://github.com/peaceiris/actions-gh-pages)



## Special Thanks

- [Hugo]
- [Bulma]
<!-- - [reveal.js] -->
<!-- - [MathJax] -->
<!-- - [mermaid] -->



## Maintainer

- [peaceiris homepage](https://peaceiris.com)



## Contributing

To contribute to this Hugo theme.

You can find more detail in our [Contributing Guide].



## License

- [MIT License - peaceiris/hugo-theme-iris](https://github.com/peaceiris/hugo-theme-iris/blob/master/LICENSE)



---

<div align="right">
<a href="#table-of-contents">Back to TOC ☝️</a>
</div>



<!-- Internal References -->
[Contributing Guide]: https://github.com/peaceiris/hugo-theme-iris/blob/master/CONTRIBUTING.md

<!-- External References -->
[Hugo]: https://gohugo.io/
[Bulma]: https://bulma.io/
[reveal.js]: https://github.com/hakimel/reveal.js/
[MathJax]: https://www.mathjax.org/
[mermaid]: https://github.com/knsv/mermaid
