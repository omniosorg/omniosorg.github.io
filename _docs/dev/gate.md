---
title: Building illumos-gate
category: dev
show_in_sidebar: true
---

# Building illumos-gate on OmniOS

Assuming that you are familiar with the illumos build process, here is how
to quickly build stock illumos-gate on OmniOS. Alternatively you can use
our `omni` utility as described on our
[build instructions page](/dev/build_instructions.html).

```shell_session
$ pfexec pkg install illumos-tools
$ pfexec zfs create -o mountpoint=/build rpool/build
$ cd /build
$ git clone https://github.com/illumos/illumos-gate
$ cd illumos-gate
$ chmod +x usr/src/tools/scripts/nightly.sh
$ ./usr/src/tools/scripts/nightly.sh /opt/onbld/env/omnios-illumos-gate
```

