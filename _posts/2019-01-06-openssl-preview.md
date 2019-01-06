---
layout: post
title: Previewing OpenSSL 1.1.1 on OmniOS r151028
synopsis: Previewing OpenSSL 1.1.1 on OmniOS r151028
---

We've had a number of requests for updating the OpenSSL package in OmniOS
r151028 to version 1.1.1, which have led to the creation of a new
`library/security/openssl/preview` package. This allows updating to
openssl 1.1.1 on r151028 ahead of the r151030 release (scheduled for May).
We're using this package on our own servers to enable TLS/1.3 for various
services.

## Installation

In order to make the switch, first ensure that you are on the latest
version of the `library/security/openssl` package. It should be dated
_20181214_ or later.

```terminal
omnios$ pkg list -v openssl
FMRI                                                                       IFO
pkg://omnios/library/security/openssl@1.1.0.10-151028.0:20181214T120225Z   i--
```

Then install the new preview package:

```terminal
omnios$ openssl version
OpenSSL 1.1.0j  20 Nov 2018

omnios$ pfexec pkg install openssl/preview

omnios$ openssl version
OpenSSL 1.1.1a  20 Nov 2018
```

## Reverting

Due to the way the packages are structured, reverting to version 1.1.0
requires an additional step over just removing the preview package:

```terminal
omnios$ pfexec pkg uninstall openssl/preview

omnios$ pfexec pkg revert --tagged openssl-preview

omnios$ openssl version
OpenSSL 1.1.0j  20 Nov 2018
```

