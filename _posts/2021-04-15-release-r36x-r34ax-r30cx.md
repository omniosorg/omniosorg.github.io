---
layout: post
title: OmniOS Community Edition r151030cx, r151034ax, r151036x
synopsis: Weekly releases
---
OmniOS weekly releases for w/c 12th of April 2021 are now available.

There are important fixes for r151030 and r151034 for users who use ZFS
encryption and snapshot clones, some fixes for the _mlxcx_ driver in
r151034, a _curl_ update to 7.76.1 in all releases and more.


### All releases

* _curl_ updated to 7.76.1

### r151034 and r151036

* Changing the encryption key on a ZFS dataset with clones did not update the
  clones themselves, rendering them inaccessible.

### r151036 only

* SMB shares from an _lofs_ mount would fail.

* Reaping many process with shared mappings of files on ZFS was extremely slow.

* In rare cases, a kernel panic could occur during system boot due to a race
  condition in the mlxcx driver.

* The pkg depot server would periodically hang when accessed over low-latency
  connections.

* The _dma_ mailer could spin when trying to create a new local mailbox.

For further details, please see
[https://omniosce.org/releasenotes](/releasenotes.html)

---

Any problems or questions, please [get in touch](/about/contact.html).

