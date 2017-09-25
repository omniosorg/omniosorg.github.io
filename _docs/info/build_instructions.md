---
title: Building OmniOS
category: info
show_in_sidebar: true
---

# Building OmniOS

See also the [illumos developers' guide](http://illumos.org/books/dev/)
if you are interested in contributing to illumos. OmniOS is a
near-optimal platform for developing against
[illumos-gate](https://github.com/illumos/illumos-gate) or our own
downstream
[illumos-omnios](https://github.com/omniosorg/illumos-omnios).

## Overview

Core OmniOS consists of several parts:

* [illumos-omnios](https://github.com/omniosorg/illumos-omnios)
    \- Our fork of [illumos-gate](https://github.com/illumos/illumos-gate).
* [omnios-build](https://github.com/omniosorg/omnios-build)
    \- OmniOS userland packages.
* [pkg5](https://github.com/omniosorg/pkg5)
    \- IPS packaging system.
* [kayak](https://github.com/omniosorg/kayak)
    \- OmniOS installer.
* [g11n](https://github.com/omniosorg/g11n)
    \- Globalisation components (locales, iconv, etc.)

## How to build

The easiest way to build OmniOS is using our
[omni](https://github.com/omniosorg/omni) utility which can be installed from
the [extra.omnios](https://pkg.omniosce.org/bloody/extra) IPS repository.

Each version of OmniOS can only be built on the same version so if you want
to build bloody, you need a machine running up-to-date bloody and the same
for a stable branch such as r151022 - you will need a machine running that
version. A KVM instance works well - just be sure to use the `virtio` interface
for the hard disk.

First, create a GitHub account if you don't have one already and then use
the web interface to fork the five repositories listed above.

Once that's done you can add the `extra.omnios` publisher and install `omni`
The example below is for bloody - if you're building a stable version then
just replace */bloody/* in the publisher URL.

```
# pkg set-publisher -g https://pkg.omniosce.org/bloody/extra extra.omnios
# pkg install developer/omni
```

Next, run the setup tool, providing your github username as an argument as
well as a path to a build area. It's common to create a new ZFS filesystem
for this as shown below.

```
# zfs create -o mountpoint=/build rpool/build
% /opt/ooce/bin/omni setup /build <github username>
```

> Note: It is also possible to build OmniOS in a non-global zone.
> Instructions for setting up a suitable zone can be found in the
> notes for [omni](https://github.com/omniosorg/omni/blob/master/README.md#example-build-zone-setup)

Once setup is complete, update the repositories using the `omni` utility
and build the illumos and omnios components in turn.

```
% /opt/ooce/bin/omni update_illumos
% /opt/ooce/bin/omni update_omnios
% /opt/ooce/bin/omni build_illumos
% /opt/ooce/bin/omni build_omnios
```

