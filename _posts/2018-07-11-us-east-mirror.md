---
layout: post
title: US mirror now available
---

Thanks to
Dan McDonald ([kebe.com](http://kebe.com/~danmcd/))
we now have a US mirror for our [downloads](/download-us-east.html) and core
package repositories.

To add this mirror to your configured _omnios_ publisher, use the -m
parameter to pkg set-publisher as shown below, replacing
_{{site.omnios_stable}}_ with the version that you are running.

```terminal
# pkg set-publisher -r -m https://us-east.mirror.omnios.org/{{site.omnios_stable}}/core omnios
```

The mirror can be used for all [currently supported releases](/schedule.html)
and _bloody_.

