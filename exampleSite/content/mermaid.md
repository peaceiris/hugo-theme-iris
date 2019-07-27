+++
author = "peaceiris"
title = "mermaid with Hugo Iris"
description = """
mermaid Demo Slide with hugo-iris.
one
two
three"""
date = "2018-08-03T09:00:00-06:00"
categories = "hugo"
tags = ["hugo-iris"]
eyeCatchingImg = "hugo-iris/mermaid.jpg"
pdf = "hugo-iris/mermaid.pdf"
#qrcode = true
#mathjax = true
mermaid = true
#weight = 1
#draft = true
+++

class: center, middle, inverse

#.fonth2[mermaid]
# -
#.fonth4[Slide Demo]

[hugo-iris - GitHub](https://github.com/peaceiris/hugo-iris)

---

# Mermaid example

<div class="mermaid">
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
</div>

---

# How to use Mermaid .red[*]

```
<div class="mermaid">
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
</div>
```

.footnote[.red[*][mermaid](https://mermaidjs.github.io/)]

---

class: center, middle, inverse

## That's all, thank you!

Slideshow created using [hugo-iris - GitHub](https://github.com/peaceiris/hugo-iris).
