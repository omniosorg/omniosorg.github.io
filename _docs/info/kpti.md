---
title: Mitigating Meltdown (KPTI)
category: info
show_in_sidebar: true
---

## The Meltdown Attack

<img src="/assets/images/meltdown.png" alt="(logo)" align="left"
 width="100px" style="padding-right: 10px">
[Meltdown](https://meltdownattack.com) is an attack which exploits
vulnerabilities in modern processors; it was announced early in 2018.
Using it, any process can determine the entire memory contents of the system
including that used by the kernel itself and also within other zones. Meltdown
has been assigned
[CVE-2017-5754](https://nvd.nist.gov/vuln/detail/CVE-2017-5754).

<div style="clear: both" />

## Mitigation

Given the limitations of the x86 architecture, the mitigation against Meltdown
is to stop mapping kernel text, data etc. into the page table whilst
running userland code; this technique is now commonly known as Kernel Page
Table Isolation (KPTI).

## KPTI in OmniOS

Thanks to the team at [Joyent](https://joyent.com), OmniOS has a KPTI
implementation which is included and enabled by default from release r151026
onwards and will be back-ported to r151022 (LTS) once more experience is
gained; it's available in our _bloody_ release now.

KPTI does have a performance impact as memory caches need to be flushed
whenever a process transitions from user to kernel space or vice versa.
The impact is highly dependant on the workload however, in our experience -
and particularly due to the considered way in which it has
been implemented - this is under 5% for most applications. Joyent have also
enabled the use of additional CPU features (PCID/INVPCID) to further speed
this up when possible. If your CPU has just PCID then it will be used to
improve KPTI speed and if you have INVPCID too you'll get the best
performance.

Two of the engineers responsible for the KPTI implementation have posted
interesting blog articles documenting the experience that are well worth
a read:

* <https://blog.cooperi.net/a-long-two-months>
* <http://blog.movementarian.org/2018/02/pcid-support-on-illumos.html>

## Confirming KPTI Operation

The easiest way to check if KPTI is enabled, and what additional CPU features
are being used, is to check the kernel log:

```
% dmesg | grep KPTI
Mar 18 17:22:42 omnios unix: [ID 551322 kern.info] KPTI enabled (PCID in use, INVPCID not supported)
```

Alternatively, the kernel variables can be queried directly as follows
(requires root). This is the same system as above which has PCID but not
INVPCID.
```
# echo 'kpti_enable/X;x86_use_pcid/X;x86_use_invpcid' | mdb -k
kpti_enable:    1
x86_use_pcid:   1
x86_use_invpcid:0
```

To directly check if your CPU supports PCID/INVPCID, install the _cpuid_
package and check the output:

```
# pkg install cpuid
# cpuid | egrep -i 'context|PCID'
```

or confirm the output from mdb (requires root):

```
echo ::x86_featureset | mdb -k | grep pcid
```

## Disabling KPTI

Should you wish to disable KPTI for any reason, create a file called
_/boot/conf.d/kpti_ containing the following line:
```
kpti=0
```
and restart the system. A message will be printed to the console during boot,
confirming that KPTI has been disabled:

```
unix: forcing kpti to OFF due to boot argument
SunOS Release 5.11 Version omnios-master-5cae57a473 64-bit
```

