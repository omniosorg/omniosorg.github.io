---
title: bhyve Hypervisor
category: info
show_in_sidebar: true
---

## The bhyve hypervisor

bhyve, pronounced _beehive_, is a hypervisor/virtual machine manager that
supports most processors which have hardware virtualisation support.

## History

bhyve was originally integrated into FreeBSD by NetApp in around 2011 where it
became part of the base system with FreeBSD 10.0-RELEASE. It continued to
evolve and was ported to illumos by Pluribus Networks in around 2013 and they
[contributed the resulting code](https://illumos.topicbox.com/groups/developer/Taf050a88c2f91ba3-M3ef6d369c99010b186c44f49)
to the illumos community in late 2017.
From there, [Joyent](https://www.joyent.com/) worked on integrating bhyve
into their illumos fork, bringing it up-to-date with bhyve from FreeBSD-11.1
and making many improvements along the way. The intention that they have
stated is for them to continue to work closely with the FreeBSD maintainers so
that improvements make it back where appropriate. Some slides on Joyent's work
in this area were
[presented at bhyvecon 2018](https://www.youtube.com/watch?v=90ihmO281GE)

With many thanks to all of the above, bhyve has been integrated into OmniOS
and is available from release v11 r151028.

## FAQ

### What is the status of bhyve in OmniOS

bhyve is supported from release r151028.

### Why bhyve?

OmniOS already has a type-2 hypervisor, KVM, so why are we introducing
bhyve?

* bhyve already has significantly better performance than KVM and tuning
  continues;
* Joyent are putting a lot of development time into bhyve and this looks like
  their future direction for SmartOS;
* KVM uses QEMU in userspace which is a large general-purpose CPU emulator;
  this is a case where simpler is better - bhyve is streamlined and
  single-purpose;
* illumos KVM is fairly old now and the upstream in Linux has changed a lot
  since it was first ported; to the point where re-syncing would effectively
  require another major porting effort;
* The bhyve licence is compatible with illumos meaning that it can be
  fully integrated rather than having to remain separate as KVM does;
* It will be easier to keep up-to-date with upstream changes in FreeBSD
  and to contribute improvements back.

### What's the future of KVM in OmniOS?

We have no immediate plans to remove KVM from OmniOS although we would
encourage moving to bhyve once it is stable and supports your guest
operating system.

### What host Processors are supported?

bhyve on OmniOS comes with a utility to test for processor support (see below),
but most intel processors with Extended Page Table (EPT) support will work.
Refer to [Intel's processor search tool](https://ark.intel.com/Search/FeatureFilter?productType=processors&ExtendedPageTables=true) for a complete list.

bhyve also supports AMD processors with SVM and nested paging support.

To check if bhyve will work on your hardware, download the `bhhwcompat`
utility from https://downloads.omnios.org/misc/bhyve/bhhwcompat

```terminal
% curl -o /tmp/bhhwcompat https://downloads.omnios.org/misc/bhyve/bhhwcompat
% chmod +x /tmp/bhhwcompat
% pfexec /tmp/bhhwcompat
CPU vendor string: GenuineIntel
... CPU supports VMX
... VMX support is enabled in BIOS
... VMX supports EPT
... VMX supports VPID
... VNX supports single INVEPT
... VMX supports all INVEPT

bhyve is supported on this system.
```

### Which guest operating systems are supported?

bhyve supports many operating systems including OmniOS, SmartOS, \*BSD, Linux,
and Windows.

### Can I run KVM and bhyve at the same time?

Yes, KVM and bhyve can run concurrently as of OmniOS r151028.

## Installation

bhyve is supported via a dedicated zone brand. Virtual machines run within
a non-global zone to which resource controls can be applied if desired.
Please refer to
[our bhyve and KVM branded zone documentation](/info/bhyve_kvm_brand.html)
for more information.

### Contact

If you have any problems or questions, please get in touch via
[the lobby](https://gitter.im/omniosorg/Lobby) or
[#omnios on Freenode](http://webchat.freenode.net?randomnick=1&channels=%23omnios&uio=d4)

