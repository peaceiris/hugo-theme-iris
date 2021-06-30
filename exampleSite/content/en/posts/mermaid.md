---
title: mermaid Graph Support
description: Generation of diagram and flowchart from text in a similar manner as markdown
publishdate: 2020-01-02T01:00:00.000Z
draft: false
eyecatch: "https://user-images.githubusercontent.com/30958501/123906097-8858f400-d9ae-11eb-9db0-f2e8fe5a17a0.png"
toc: true
math: false
---



## mermaid

[mermaid-js/mermaid: Generation of diagram and flowchart from text in a similar manner as markdown](https://github.com/mermaid-js/mermaid)



## Example

### Input

Use `mermaid` shortcode.

```md
{{</* mermaid */>}}
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
{{</* /mermaid */>}}
```

### Output

```
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
