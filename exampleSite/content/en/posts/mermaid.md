---
title: mermaid Graph Support
description: Generation of diagram and flowchart from text in a similar manner as markdown
publishdate: 2020-01-02T01:00:00.000Z
# draft: true
# eyecatch: images/mermaid.jpg
# tags: ["hugo"]
toc: true
# math: true
mermaid: true
# weight: 1
twitter:
  username: piris314
  hashtags: ["hugo"]
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
