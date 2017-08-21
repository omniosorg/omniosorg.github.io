---
layout: post
title: Security Update bzip2 Vulnerability
---

OmniOS Community Edition has updated the bzip2 Package for r151022 and bloody to fix

- CVE-2016-3189

> A remote user can create a specially crafted bzip2 file that, when processed for recovery by the target application, will trigger a use-after-free memory error in bzip2recover and cause the target application to crash.

This update does NOT require a reboot.

