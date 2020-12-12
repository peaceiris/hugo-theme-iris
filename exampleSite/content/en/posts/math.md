---
title: MathJax Support $E=mc^2$
description: Beautiful math in all browsers $E=mc^2$
publishdate: 2020-01-01T01:00:00.000Z
# draft: true
# eyecatch: images/mathjax.jpg
# tags: ["hugo"]
toc: true
math: true
# weight: 1
twitter:
  username: piris314
  hashtags: ["hugo"]
---



## MathJax

[mathjax/MathJax: Beautiful math in all browsers](https://github.com/mathjax/MathJax)



## Inline Example

### Input

```tex
Inline $E = mc^2$
```

### Output

Inline $E = mc^2$



## Basic Example

### Input

```tex
$$
\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}
$$
```

### Output

$$
\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}
$$



## Math Shortcode

See also [this thread](https://discourse.gohugo.io/t/use-goldmark-mathjax-extension/25721).

### Input

```md
{{</* math */>}}
\begin{vmatrix}a & b\\
c & d
\end{vmatrix}
{{</* /math */>}}
```

### Output

{{< math >}}
\begin{vmatrix}a & b\\
c & d
\end{vmatrix}
{{< /math >}}
