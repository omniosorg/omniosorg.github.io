---
layout: post
title: Security Update bzip2 Vulnerability
---

OmniOS Community Edition has updated the bzip2 Package for r151022 and bloody to fix

- CVE-2016-3189

> A remote user can create a specially crafted bzip2 file that, when processed for recovery by the target application, will trigger a use-after-free memory error in bzip2recover and cause the target application to crash.

This release does NOT require a reboot.

Full release notes can be found at 

[https://github.com/omniosorg/omnios-build/blob/r151022/doc/ReleaseNotes.md](https://github.com/omniosorg/omnios-build/blob/r151022/doc/ReleaseNotes.md)

To upgrade, utter:

```
$ pkg update -r
```

You can also just upgrade the packages

```
$ pkg update -r git mercurial
```

Any problems or questions, please get in touch via the Lobby at

[https://gitter.im/omniosorg/Lobby](https://gitter.im/omniosorg/Lobby)
