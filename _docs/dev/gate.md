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
user@omniosce:~$ pfexec pkg install illumos-tools
user@omniosce:~$ pfexec zfs create -o mountpoint=/build rpool/build
user@omniosce:~$ cd /build
user@omniosce:/build$ git clone https://github.com/illumos/illumos-gate
user@omniosce:/build$ sed '/CODEMGR_WS=.*/s^^CODEMGR_WS=/build/illumos-gate^' \
    < /opt/onbld/env/omnios-illumos-gate > gate.env
user@omniosce:/build$ chmod +x illumos-gate/usr/src/tools/scripts/nightly.sh
user@omniosce:/build$ illumos-gate/usr/src/tools/scripts/nightly.sh gate.env
```

