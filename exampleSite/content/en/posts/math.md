---
title: MathJax Support $E=mc^2$
description: Beautiful math in all browsers $E=mc^2$
publishdate: 2020-01-01T01:00:00.000Z
draft: false
eyecatch: "https://user-images.githubusercontent.com/30958501/121796747-647b7b80-cc56-11eb-8490-52d5899e561c.jpg"
toc: true
math: true
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
