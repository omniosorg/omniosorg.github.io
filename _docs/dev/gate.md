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

```
$ pfexec pkg install illumos-tools
$ pfexec zfs create -o mountpoint=/build rpool/build
$ cd /build
build$ git clone https://github.com/illumos/illumos-gate
build$ sed '/CODEMGR_WS=.*/s^^CODEMGR_WS=/build/illumos-gate^' \
    < /opt/onbld/env/omnios-illumos-gate > gate.env
build$ chmod +x illumos-gate/usr/src/tools/scripts/nightly.sh
build$ illumos-gate/usr/src/tools/scripts/nightly.sh gate.env
```

