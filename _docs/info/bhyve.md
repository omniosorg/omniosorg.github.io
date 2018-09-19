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
and is available **for beta testing** from release v11 r151026 (and in the
bloody release right now).

## FAQ

### What is the status of bhyve in OmniOS

bhyve is available for *beta testing* at present and not recommended for
production use. It is expected to be considered stable and officially
supported from release r151028 and will be included alongside KVM in the
next LTS version (r151030).

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
operating system. bhyve is expected to be fully supported from OmniOS
release r151028 and will be included alongside KVM in the next LTS version
(r151030).

### What host Processors are supported?

bhyve on OmniOS comes with a utility to test for processor support (see below),
but most intel processors with Extended Page Table (EPT) support will work.
Refer to [Intel's processor search tool](https://ark.intel.com/Search/FeatureFilter?productType=processors&ExtendedPageTables=true) for a complete list.

bhyve also has support for AMD processors but this has not been widely tested
with the illumos port. Specifically, nothing has been done to remove AMD
support but no work has been done on it either.

### What guest operating systems are supported?

bhyve supports many operating systems including OmniOS, SmartOS, \*BSD, Linux,
Windows - however, in illumos, most testing so far has concentrated on Linux
guests.

### Can I run KVM and bhyve at the same time?

No, only one hypervisor can use the processor hardware virtualisation
at a time. It is possible to run KVM in full software emulation mode
alongside bhyve, but this is not recommended.
Mike Gerdts of Joyent did a nice write-up of this
[in his blog](https://mgerdts.github.io/2018/03/20/bhyve-kvm-mutual-exclusion.html).

## Installation

> The following information is presented as-is for anyone who wishes to
> experiment with this new feature; in the future OmniOS will support easy
> provisioning of bhyve virtual machines in non-global zones.
> For now, if you want any help, please get in touch via one of the methods
> in the _Contact_ section below.

It is expected that bhyve will be updated many times during the life of
the r151026 release and so it is not installed by default. To install, just
add the `system/bhyve` package:

```
% pfexec pkg install system/bhyve
```

This also installs some other dependant packages such as the required firmware
and ACPI compiler.

To check if bhyve will work on your hardware, run bhhwcompat:

```
% pfexec bhhwcompat -v
processor does not support VMX operation
```

or, hopefully:
```
% pfexec bhhwcompat -v
bhyve is supported on this host.
```

## Starting a VM

What follows is a basic overview on how to start a VM in the global zone
for testing.

### Create a virtual NIC (VNIC)

Create a virtual network interface on top of the selected link. Here, the
new VNIC is named `bhyve0` and it is based on the physical interface `igb0`:

```
# dladm create-vnic -l igb0 bhyve0
# dladm show-vnic
LINK         OVER         SPEED  MACADDRESS        MACADDRTYPE         VID
bhyve0       igb0         100    2:8:20:38:a5:d6   random              0
```

### Create a ZFS volume for the virtual hard drive

Prepare a volume for the VM:

```
# zfs create -V 30G rpool/hdd/bhyve0
```

### Grab an ISO:

```
# mkdir -p /export/iso
# cd /export/iso
# wget ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/11.1/FreeBSD-11.1-RELEASE-amd64-disc1.iso
```

### Start the Virtual Machine

```
pfexec bhyve \
        -H \
        -B "1,product=OmniOS HVM" \
        -s 0,amd_hostbridge \
        -s 1,lpc \
        -l bootrom,/usr/share/bhyve/firmware/BHYVE.fd \
        -l com1,stdio \
        -c 4 \
        -m 1G \
        -s 2:0,ahci-cd,/export/iso/FreeBSD-11.1-RELEASE-amd64-disc1.iso \
        -s 3:0,virtio-blk,/dev/zvol/rdsk/rpool/hdd/bhyve0 \
        -s 5:0,virtio-net-viona,bhyve0 \
	-s 30,fbuf,vga=off,tcp=0.0.0.0:5900,wait,w=1024,h=768 \
	-s 31,xhci,tablet \
        testvm
```

You should be able to connect to the host machine via VNC to continue the
boot and finish installation. If you wish to skip VNC support, just remove
the _fbuf_ and _xhci_ lines. To connect to the serial console, use
`nc -U /tmp/test.cons`.

### Stop the Virtual Machine

```
% pfexec bhyvectl --vm=testvm --destroy
```

### More Options

```
pfexec bhyve
        -H
        -B "1,product=OmniOS HVM"
        
        # amd_hostbridge is needed for at least Free/OpenBSD
        # Options are none, hostbridge or amd_hostbridge
        # NB: For 'hostbridge' vendor and device are set to a NetApp id
        -s 0,amd_hostbridge
        
        # LPC PCI-ISA bridge providing connectivity to com1, com2, and bootrom
        -s 1,lpc
        
        -l bootrom,/usr/share/bhyve/firmware/BHYVE_CSM.fd
        
        # SmartOS does not support the 'wait' attribute.
        # They attach com1 to the zone console when inside a zone allowing zlogin -C to the guest.
	# You can connect to a socket console using `nc -U /tmp/test.cons`
        -l com1,socket,/tmp/test.cons,wait
        # -l com1,stdio
        
        -c 4    # CPUs
        -m 1G   # RAM
        
        -s 2:0,ahci-cd,/build/iso/smartos-latest.iso
       
        # boot disk is always 3:0
        -s 3:0,virtio-blk,/dev/zvol/rdsk/rpool/hdd-bhyve
        
        # Other disks 4:n - limits to 8 disks but could put others on 6:x etc.
        -s 4:0,virtio-blk,/dev/zvol/rdsk/rpool/hdd-bhyve1
        -s 4:1,virtio-blk,/dev/zvol/rdsk/rpool/hdd-bhyve2
        
        # Can also do the following for multiple disks on the same controller but only for ahci
        #-s 4:0,ahci,hd:/dev/zvol/rdsk/rpool/hdd-bhyve1,hd:/dev/zvol/rdsk/rpool/hdd-bhyve2
        
        # 'primary' net on :0, others :1+
        -s 5:0,virtio-net-viona,bhyve0
        -s 5:1,virtio-net-viona,bhyve1
        
        # VM name
        test
        
 Also, with UEFI bootrom:
 
        -s 30,fbuf,vga=off,tcp=10.0.0.1:5900,wait,w=1024,h=768
        -s 31,xhci,tablet
```

### Contact

bhyve in OmniOS is an experimental feature. If you have any problems or
questions, please get in touch via
[the lobby](https://gitter.im/omniosorg/Lobby) or
[#omnios on Freenode](http://webchat.freenode.net?randomnick=1&channels=%23omnios&uio=d4)

