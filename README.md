[![LICENSE](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/peaceiris/hugo-theme-iris/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/peaceiris/hugo-theme-iris.svg)](https://github.com/peaceiris/hugo-theme-iris/releases/latest)
[![release date](https://img.shields.io/github/release-date/peaceiris/hugo-theme-iris.svg)](https://github.com/peaceiris/hugo-theme-iris/releases)
[![release feed](https://img.shields.io/badge/release-feed-yellow)](https://github.com/peaceiris/hugo-theme-iris/releases.atom)
![deploy status](https://github.com/peaceiris/hugo-theme-iris/workflows/Deploy/badge.svg?branch=master&event=push)
[![hugo themes](https://img.shields.io/static/v1?label=Hugo%20Themes&message=IRIS&color=blueviolet)](https://themes.gohugo.io/hugo-theme-iris/)
[![lighthouse score](https://img.shields.io/static/v1?label=Lighthouse%20Score&message=Good&color=green)](https://hugothemeiris.peaceiris.app/report.html)

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
- [Shortcodes](#shortcodes)
  - [button](#button)
  - [li](#li)
  - [mermaid](#mermaid)
  - [repo](#repo)
  - [table](#table)
- [Special Thanks](#special-thanks)
- [Changelog](#changelog)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Overview

This repository includes the [Hugo] theme.

- [Demo site on GitHub Pages](https://hugothemeiris.peaceiris.app/)

### Features

- Dark Theme
- Responsive
- Support Multilingual
- [PageSpeed Insights Scores: Good](https://developers.google.com/speed/pagespeed/insights/?hl=EN&url=https%3A%2F%2Fhugothemeiris.peaceiris.app%2F)
- [Lighthouse Scores: Good](https://hugothemeiris.peaceiris.app/report.html)
- Breadcrumb List
- Syntax Highlighting
- Eye-catching Image
- Disqus Comment System
- Google Analytics
- Open Graph Protocol, OGP Images
- Table of Contents
- [MathJax]: Beautiful math in all browsers.
- [mermaid]: Generation of diagram and flowchart from text in a similar manner as markdown.
- [reveal.js]: Writing slides using Markdown.

### Roadmap

- Share Buttons
- JSON-LD
- Netlify, Netlify CMS
- Categories, Tags, Authors
- Font Awesome
- Related posts, next and previous post



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
cp -r ./themes/hugo-theme-iris/exampleSite/{assets,config,content,data,i18n,static} .
vim ./config/_default/config.yaml  # uncomment 'theme: hugo-theme-iris'
hugo server
```

- http://localhost:1313/

*Customize your site! ʕ◔ϖ◔ʔ*



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



## Shortcodes

### button

```md
<div class="buttons">
  {{< button href="https://gohugo.io/" txt="Hugo Homepage" >}}
  {{< button href="https://github.com/gohugoio/" txt="Hugo GitHub" >}}
  {{< button href="https://discourse.gohugo.io/" txt="Hugo Forum" >}}
  {{< button href="https://twitter.com/GoHugoIO" txt="Hugo Twitter" >}}
</div>
```

<img width="500px" src="https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_button.jpg" alt="Shortcode button">

### li

```md
{{< li >}}
- Hugo
- Golang
- Static Site Generators
{{< /li >}}

{{< li >}}
1. Hugo
1. Golang
1. Static Site Generators
{{< /li >}}
```

<img width="500px" src="https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_li.jpg" alt="Shortcode li">

### mermaid

```md
{{< mermaid >}}
sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
    John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!
{{< /mermaid >}}
```

<img width="500px" src="https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_mermaid.jpg" alt="Shortcode mermaid">

### repo

```md
{{< repo id="peaceiris" name="actions-gh-pages" >}}

{{< repo id="peaceiris" name="actions-hugo" >}}
```

<img width="500px" src="https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_repo.jpg" alt="Shortcode repo">

### table

```md
{{< table >}}
| Key | Value |
|---|---|
| Static Site Generator | Hugo |
| Language | Go |
{{< /table >}}
```

| Mouse out | Mouse over |
|---|---|
| ![Shortcode table mouse out](https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_table_1.jpg) | ![Shortcode table mouse over](https://raw.githubusercontent.com/peaceiris/hugo-theme-iris/master/exampleSite/static/images/shortcode_table_2.jpg) |



## Special Thanks

- [Hugo]
- [Bulma]
<!-- - [reveal.js] -->
<!-- - [MathJax] -->
<!-- - [mermaid] -->
<!-- - Font Awesome -->



## Changelog

- [hugo-theme-iris/CHANGELOG.md](https://github.com/peaceiris/hugo-theme-iris/blob/master/CHANGELOG.md)



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
