---
layout: post
title: r151022/LTS - beta patch for KPTI & Lazy FPU
---

We now have a beta patch available for r151022 to resolve the
[CVE-2017-5754 (Meltdown)](/info/kpti.html) and CVE-2018-3665 (Lazy FPU)
vulnerabilities.

This is a large patch which touches a lot of the low-level code in the kernel
and so we would appreciate wider testing by users of the
LTS r151022 version before rolling this out through the standard package
update process.

To install the patch into a new boot-environment, follow the steps below as
root (or prefix each with `pfexec` or `sudo` as appropriate for your
environment). Note the `'*'` argument on the second  _apply-hot-fix_ command.

```terminal
# pkg apply-hot-fix https://downloads.omniosce.org/pkg/r151022/pkg-pub-r.p5p
# pkg apply-hot-fix -vr --be-name=r22_kpti_fpu \
    https://downloads.omniosce.org/pkg/r151022/kpti_fpu.p5p '*'
# init 6
```

... after reboot ...

```terminal
# mdb -ke ::sec
= Meltdown (CVE-2017-5754)
    Status: PROTECTED
            KPTI is enabled
            PCID is in-use
            INVPCID is not supported by this processor
= Lazy FPU (CVE-2018-3665)
    Status: PROTECTED
            System is using eager FPU register restore
```

To revert, just activate the previous boot environment and reboot.
Please [report any problems](/about/contact.html) that you encounter; thanks.

All being well, this update will be rolled out to r151022 in the next
week or two.

