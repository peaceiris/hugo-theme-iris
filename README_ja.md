# hugo slide manager

このリポジトリでは、[Hugo] のプレゼンテーション用テーマを管理・公開しています。

マークダウン記法でスライドを作成することができる JavaScript ライブラリ [remark] を採用しています。
remark 単体でもスライドの作成は可能ですが、Hugo Theme に組み込むことで、
「複数スライドの管理」と「CSSの切り替え」を実現しました。

また、JavaScriptライブラリ [MathJax] と [mermaid] を導入しているので、
スライドにTex記法で数式を埋め込んだり、遷移図やシーケンス図を表示することもできます。

- 英語のスライドですが [Demo] を用意しています。
- [English README is here.](https://github.com/peaceiris/hugo-slide-manager/blob/master/README.md)

<!-- ![Screenshot](https://raw.githubusercontent.com/eueung/hugo-remark-twemoji/master/images/screenshot.png) -->



## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [機能](#%E6%A9%9F%E8%83%BD)
  - [Top page](#top-page)
  - [Switch CSS](#switch-css)
  - [MathJax](#mathjax)
  - [mermaid](#mermaid)
  - [PDFで出力](#pdf%E3%81%A7%E5%87%BA%E5%8A%9B)
  - [ホーム画面に追加](#%E3%83%9B%E3%83%BC%E3%83%A0%E7%94%BB%E9%9D%A2%E3%81%AB%E8%BF%BD%E5%8A%A0)
    - [iOS Safari](#ios-safari)
    - [Android](#android)
- [テーマの導入](#%E3%83%86%E3%83%BC%E3%83%9E%E3%81%AE%E5%B0%8E%E5%85%A5)
  - [ダウンロード](#%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)
  - [git clone](#git-clone)
  - [git submodule add](#git-submodule-add)
- [設定](#%E8%A8%AD%E5%AE%9A)
  - [config.toml](#configtoml)
  - [スライド](#%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89)
  - [スタイル](#%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB)
  - [Favicon](#favicon)
- [スライドを公開する](#%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89%E3%82%92%E5%85%AC%E9%96%8B%E3%81%99%E3%82%8B)
  - [GitHub Pages で公開](#github-pages-%E3%81%A7%E5%85%AC%E9%96%8B)
  - [Netlify で公開](#netlify-%E3%81%A7%E5%85%AC%E9%96%8B)
  - [その他](#%E3%81%9D%E3%81%AE%E4%BB%96)
  - [スライドを保存](#%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89%E3%82%92%E4%BF%9D%E5%AD%98)
  - [公開したスライドをぜひ共有させてください](#%E5%85%AC%E9%96%8B%E3%81%97%E3%81%9F%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89%E3%82%92%E3%81%9C%E3%81%B2%E5%85%B1%E6%9C%89%E3%81%95%E3%81%9B%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84)
- [Special Thanks](#special-thanks)
- [Author](#author)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## 機能

- Top page: スライドの一覧を表示するトップページ
- Switch CSS: `config.toml` の変数を変えることでCSSファイルを変更
- [MathJax]: Tex記法での数式の表示
- [mermaid]: 遷移図やシーケンス図の表示

### Top page

トップページで作成したスライドの一覧を表示できます。

### Switch CSS

`config.toml` の変数を変更することで、読み込み CSS ファイルをしていできます。
CSS は標準で用意されているものの他に、ユーザーが独自に作成することも可能です。

### MathJax

Tex

### mermaid

### PDFで出力

ブラウザーでスライドを表示して印刷する時に、PDF形式で保存することができます。

- [PDF sample]

### ホーム画面に追加

#### iOS Safari

#### Android



## テーマの導入

### ダウンロード

Inside the folder of your Hugo site run:

```sh
cd themes
git clone
```

For more information read the official [setup guide](//gohugo.io/overview/installing/) of Hugo.

### git clone

### git submodule add



## 設定

### config.toml

The following `config.toml` is used for the demo site mentioned above.

```toml
baseurl         = "/"
theme           = "slide-manager"
languageCode    = "en-us"
title           = ""
canonifyurls    = true

[params]
  googleAnalytics = ""
  name            = "peaceiris"
  description     = ""
  customCSS      = ["custom.css"]
```

### スライド

```
+++

+++

```

### スタイル

Usually you'll maintain your own custom CSS.
This has to be declared in the `config.toml`.
Sample style is included in the `exampleSite/static/css` folder.

Have fun!

### Favicon

- faviconの生成・ダウンロード
    - https://www.favicon-generator.org/
- 64x64.ico の生成
    - https://www.icoconverter.com/
- static に配置



## スライドを公開する

スライドを公開する際は、いずれの方法においても、

- `config.toml` の中で `baseurl` を適切に定義する。
- `hugo` コマンドで生成される `public` の中身を公開する。

ことが必要になります。

### GitHub Pages で公開

- [Host on GitHub | Hugo]

GitHub Pages でスライドを公開する際は、次のリンク先で説明されている方法がオススメです。

- [Deployment of Project Pages From Your gh-pages branch]

### Netlify で公開

### その他

- 自前のサーバーで公開
- NOW
- GitLab Pages
- Firebase hosting

### スライドを保存

ブラウザでページを保存すれば必要なリソースがダウンロードされるので、
オフラインでもローカル環境でスライドの閲覧が可能。

### 公開したスライドをぜひ共有させてください

このテーマを利用してスライドを作成し、GitHub Pages などを利用して一般にスライドを公開した場合。
よろしければ、このテーマの利用事例としてスライドを紹介させてください。
Issues でスライドの概要とリンクを教えてください。
もしくは [piris314@Twitter] にリプライなり DM なりをくださっても構いません。
スライドはこの README とデモページで紹介させていただきます。



## Special Thanks

- [Hugo]
- [remark]
- [MathJax]
- [mermaid]



## Author

- This repo: [peaceiris]



## License

This theme is released under the [MIT License].



[Demo]: https://peaceiris.github.io/open-slides/
[Hugo]: https://gohugo.io/
[MIT License]: https://github.com/peaceiris/hugo-slide-manager/blob/master/LICENSE
[remark]: https://github.com/gnab/remark
[MathJax]: https://www.mathjax.org/
[mermaid]: https://github.com/knsv/mermaid

[Host on GitHub | Hugo]: https://gohugo.io/hosting-and-deployment/hosting-on-github/
[Deployment of Project Pages From Your gh-pages branch]: https://gohugo.io/hosting-and-deployment/hosting-on-github/#deployment-of-project-pages-from-your-gh-pages-branch
[peaceiris]: https://github.com/peaceiris
[piris314@Twitter]: https://twitter.com/piris314
