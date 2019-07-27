+++
author = "peaceiris"
title = "MathJax with Hugo Iris"
description = "MathJax Demo slide with hugo-iris."
date = "2018-08-02T09:00:00-06:00"
categories = "hugo"
tags = ["hugo-iris"]
eyeCatchingImg = "hugo-iris/mathjax.jpg"
pdf = "hugo-iris/mathjax.pdf"
#qrcode = true
mathjax = true
#mermaid = true
#weight = 1
#draft = true
+++

class: center, middle, inverse

#.fonth2[MathJax]
# -
#.fonth4[Slide Demo]

[hugo-iris - GitHub](https://github.com/peaceiris/hugo-iris)

---

# MathJax example

## Quadratic formula .red[*]

In [elementary algebra], the quadratic formula is the solution of the [quadratic equation].
There are other ways to solve the quadratic equation instead of using the quadratic formula,
such as [factoring], [completing the square], or [graphing].
Using the quadratic formula is often the most convenient way.

The general quadratic equation is

$$
ax^{2}+bx+c=0
$$

Here $x$ represents an unknown, while $a$, $b$, and $c$ are [constants] with a not equal to $0$.
One can verify that the quadratic formula satisfies the quadratic equation by inserting the former into the latter.
With the above parameterization, the quadratic formula is:

$$
x={\frac {-b\pm {\sqrt {b^{2}-4ac}}}{2a}}
$$

.footnote[.red[*][Quadratic formula - Wikipedia](https://en.wikipedia.org/wiki/Quadratic_formula)]

[elementary algebra]: https://en.wikipedia.org/wiki/Elementary_algebra
[quadratic equation]: https://en.wikipedia.org/wiki/Quadratic_equation
[factoring]: https://en.wikipedia.org/wiki/Factorization
[completing the square]: https://en.wikipedia.org/wiki/Completing_the_square
[graphing]: https://en.wikipedia.org/wiki/Graph_of_a_function
[constants]: https://en.wikipedia.org/wiki/Constant_term

---

# How to use MathJax .red[*]

## Inline mode

```
The quadratic formula is $ ax^{2}+bx+c=0 $.
```

The quadratic formula is $ ax^{2}+bx+c=0 $.

## Display mode

```
$$
x={\frac {-b\pm {\sqrt {b^{2}-4ac}}}{2a}}
$$
```

$$
x={\frac {-b\pm {\sqrt {b^{2}-4ac}}}{2a}}
$$

.footnote[.red[*][MathJax](https://www.mathjax.org/)]

---

class: center, middle, inverse

## That's all, thank you!

Slideshow created using [hugo-iris - GitHub](https://github.com/peaceiris/hugo-iris).
