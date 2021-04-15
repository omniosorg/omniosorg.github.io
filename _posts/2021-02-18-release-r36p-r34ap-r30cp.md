---
layout: post
title: OmniOS Community Edition r151030cp, r151034ap, r151036p
synopsis: OpenSSL & Python Security fixes.
---
OmniOS weekly releases for w/c 15th of February 2021 are now available.

## All supported OmniOS releases have been updated with the following changes:

### Security Fixes in all releases

* OpenSSL updated to 1.1.1j, fixing
  [CVE-2021-23840](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-23840),
  [CVE-2021-23841](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-23841).

* The legacy OpenSSL 1.0.2 has also been patched to mitigate the above CVEs.

* All shipped Python versions have been updated to address
  [CVE-2021-3177](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-3177).

### Other Changes in all releases

* Adding a second disk to an Azure instance caused a kernel panic.

### Additional changes in r151030cp

* A memory leak in the SMB client has been addressed.

* The ZFS I/O pipeline is now able to use the pageout reserve memory pool
  in order to flush pages to disk under low memory conditions.

* The hardware database has been updated.

* Timezone data has been updated.

### Additional changes in r151036p

* The ZFS I/O pipeline is now able to use the pageout reserve memory pool
  in order to flush pages to disk under low memory conditions.


For further details, please see
[https://omnios.org/releasenotes](/releasenotes.html)

---

Any problems or questions, please [get in touch](/about/contact.html).

