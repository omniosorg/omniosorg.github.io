---
title: OmniOS zones
category: setup
order: 21
show_in_sidebar: false
---

## Managing zones in OmniOS

OmniOS is an excellent choice as a virtualisation platform as it supports both
lighweight Operating System virtualisation and full hardware virtualisation
using _zones_.

A zone is a virtualised instance of OmniOS that behaves like a separate
system even with functioning alongside other zones on the same machine.
System resources are shared across zones and can be shared and capped
using a variety of techniques.

In OmniOS, virtualised systems are configured as _branded_ zones of
various types. Even hardware virtualisation is run within a zone in order to
take advantage of the afforded resource controls and to add a second layer of
protection around the isolation already provided by the hypervisor. 
OmniOS' _Crossbow_ network architecture allows for a wide range of software
defined networking solutions to be implemented alongside zones.

<div class="fa-orange" style="padding-top: 0.5em">
<i class="far fa-3x fa-pull-left fa-exclamation-triangle"></i>
<b>Note:</b> The zone framework in OmniOS has evolved over time and this page
reflects the situation as of <b>release r151030</b>.
</div>

## Available zone types

### ipkg branded zones

An _ipkg_ branded zone runs a full copy of OmniOS, with independently
managed software. For routine patching, ipkg zones must be upgraded
separately but core packages such as the system libraries should be kept
close to the version installed in the global zone (GZ).

If a package update in the global zone requires the creation of a new boot
environment (BE), then each ipkg zone will also get a new BE that will
be switched to when the global zone is restarted into its new BE.

When performing major version upgrades, ipkg zones must be detached
first and then re-attached later; re-attach will trigger a full software
update to bring the zone back into sync with the global zone.

> **Note:** ipkg BEs are linked to the global zone BE under which they were
> created. This means that rolling back the GZ to a previous BE will also roll
> back the zone. For this reason, zone data which should be shared across BEs
> should be allocated to a dedicated dataset, see XXX below.

ipkg zones are useful for some situations, but have generally been
superseded by lipkg zones (see below) which automatically keep core
system packagse synchronised with the global zone.

### lipkg (linked-ipkg) branded zones

A linked-ipkg (_lipkg_) zone is an extension of an ipkg zone which has its
installed software set linked to that within the global zone. By default,
when performing a package update from the global zone, core system packages
within lipkg zones are automatically updated at the same time.
It is possible to extend this to upgrade all packages and to upgrade multiple
lipkg zones in parallel via command line options or pkg properties.
See XXX below.

A further benefit over ipkg zones is that major version upgrades can be
performed without having to detach and re-attach the zones.

Like ipkg zones, lipkg zones can have multiple boot environments, created
either locally within the zone or managed automatically from the GZ as BEs are
created/destroyed there.

Even though the software image is linked to the global zone, it is perfectly
possible to have a different set of packages installed in an lipkg zone
as long as system consistency rules are met.

### sparse branded zones

A _sparse_ zone is a linked-ipkg zone where several of its filesystems are
directly shared with the global zone. This makes a sparse zone very small
indeed (and quick to build) but they are only suitable for software packages
that do not need to install files under shared filesystems such as _/usr_;
those being read-only within the zone.

> Most properly packaged third-party software installs under _/opt_ with
> associated files and data in _/etc/opt_ and _/var/opt_ and works really
> well in a sparse zone.

Given their small size, low overhead and ease of maintenance, it is common to
use sparse zones for running individual services such as an NTP, DHCP or DNS
server.

### pkgsrc branded zones

A _pkgsrc_ zone is a sparse zone which is pre-configured to use Joyent's
binary package repository. This provides access to over 20,000 ready-built
packages ready to install and use. Within a pkgsrc zone, use the `pkgin`
command to manage these packages which are all installed under the
_/opt/local_ directory.

### lx branded zones

An _lx_ zone provides an environment for running binary applications
build for GNU/Linux. User-level code, including an entire Linux distribution,
can be run inside the zone.

### bhyve branded zones

A _bhyve_ zone runs a virtual machine instance under the bhyve hypervisor.

### kvm branded zones

A _kvm_ zone runs a virtual machine instance under the KVM hypervisor.

### illumos branded zones

An _illumos_ zone runs an independant illumos distribution under the shared
OmniOS kernel. Subject to the constraints imposed by the shared kernel, it can
be used to run a different version of OmniOS userland or even a different
illumos distribution.

# Creating zones

## Creating a top-level dataset

Every zone on a system has at least one dedicated ZFS dataset and it's good
practice to create a parent dataset under which all zones will live. A
common convention is to mount this dataset as _/zones_ and create it at the
top level of a pool.

On a small server which just has a root pool, the following command will
create this top-level dataset, a container to hold zones:

```terminal
omnios# zfs create -o mountpoint=/zones rpool/zones
```

## Zone pre-requisites

> There are many different ways of creating and managing zones in OmniOS as
> the framework has evolved over the years. What follows is considered best
> practice from release r151030 onwards.

* **Zone brand** - the default zone brand in OmniOS is _lipkg_ but any of
  the brands shown above can be used.
* **ZFS root dataset** - each zone needs at least one ZFS dataset which is
  used as the root filesystem for the zone. This is created automatically
  during zone installation.
* **Network interace** (optional) - it's generally useful to give the zone
  access to a network and this is most often done using a crossbow
  virtual network interface card (VNIC). The VNIC can be attached to a real
  physical interface on the host machine, or to a virtual switch (etherstub).
* **ZFS additional dataset** (optional) - in order to maintain data within
  the zone which is shared across different boot environments, a zone usually
  has at least one additional ZFS dataset to hold this.

## Creating a zone

Zones are created using the `zonecfg` command. To create a new zone, start
the utility with the name of the zone passed to the _-z_ argument, then
create a zone of the correct brand.

> In the examples that follow, a _pkgsrc_-branded zone named '_test_' is used.

```terminal
omnios# zonecfg -z test
test: No such zone configured
Use 'create' to begin configuring a new zone.
zonecfg:test> create -t pkgsrc
zonecfg:test> set zonepath=/zones/test
zonecfg:test> exit
```

This is the minimal configuration for a new zone. The _-t_ argument to the
create command specifies the type of zone required and the zonepath specifies
where the zone's root filesystem dataset should be created.

To view the zone configuration so far, use the zonecfg _info_ command:

```terminal
omnios# zonecfg -z test info
zonename: test
zonepath: /zones/test
brand: pkgsrc
autoboot: false
bootargs:
pool:
limitpriv:
scheduling-class:
ip-type: exclusive
hostid:
fs-allowed:
```

## Adding a network interface

### Example 1

Add a single network interface called _net0_ and automatically associate it
with the appropriate NIC in the global zone. If preferred, a NIC name can
be used in place of _auto_. One benefit of defining the IP addressing
information within the zone configuration is that protection is automatically
applied which prevents the zone administrator from assigning an arbitrary
address to the interface.

```terminal
omnios# zonecfg -z test
zonecfg:test> add net
zonecfg:test:net> set physical=test0
zonecfg:test:net> set global-nic=auto
zonecfg:test:net> set allowed-address=172.27.10.100/24
zonecfg:test:net> set defrouter=172.27.10.254
zonecfg:test:net> end
zonecfg:test> add attr
zonecfg:test:attr> set name=resolvers
zonecfg:test:attr> set type=string
zonecfg:test:attr> set value=1.1.1.1,1.0.0.1
zonecfg:test:attr> end
zonecfg:test> add attr
zonecfg:test:attr> set name=dns-domain
zonecfg:test:attr> set type=string
zonecfg:test:attr> set value=omnios.org
zonecfg:test:attr> end
zonecfg:test> exit
```

### Example 2

Create a VNIC manually and assign it to the zone without specifying network
information. The VNIC will need to be configured from within the zone.

> Note that in this case there is no protection applied to the interface
> to prevent the zone administrator from assigning an arbitrary address.

```terminal
omnios# dladm show-phys
LINK         MEDIA                STATE      SPEED  DUPLEX    DEVICE
igb0         Ethernet             up         1000   full      igb0
omnios# dladm create-vnic -l igb0 test0
omnios# zonecfg -z test
zonecfg:test> add net
zonecfg:test:net> set physical=test0
zonecfg:test:net> end
zonecfg:test> exit
```

## Changing the system default scheduler

If you plan to run a number of zones on an OmniOS system, consider changing
the system scheduler to the Fair-Share-Scheduler (FSS) so that zones get
an equal share of system resources. See the
[FSS(7) manual page](https://illumos.org/man/FSS) for more details.

The following command sets FSS as the default scheduler for the system:
```terminal
omnios# dispadmin -d FSS
```

By default each zone will get an equal share of system resources; each
zone has a cpu-shares value of 1. This value can be adjusted on a per-zone
basis to assign relative priority to zones.

The following will give the _test_ zone twice the priority of all others.
```terminal
omnios# zonecfg -z test set cpu-shares=2
```

## Installing the zone

Once a zone is configured, it must be installed. This creates the root dataset,
installs the appropriate software and applies an initial configuration.
Depending on the type of zone, this may take a while.

```terminal
omnios# zoneadm -z test install
A ZFS file system has been created for this zone.

       Image: Preparing at /zones/test/root.
Sanity Check: Looking for 'entire' incorporation.
   Publisher: Using omnios (https://pkg.omnios.org/bloody/core/).
   Publisher: Using extra.omnios (https://pkg.omnios.org/bloody/extra/).
       Cache: Using /var/pkg/publisher.
  Installing: Packages (output follows)
Packages to install: 197
Mediators to change:   3
 Services to change:   5

DOWNLOAD                                PKGS         FILES    XFER (MB)   SPEED
Completed                            197/197     1292/1292      4.5/4.5      --

PHASE                                          ITEMS
Installing new actions                     5638/5638
Updating package state database                 Done
Updating package cache                           0/0
Updating image state                            Done
Creating fast lookup database                   Done
 Postinstall: Copying SMF seed repository ... done.
Installing pkgsrc bootstrap...
        Done: Installation completed in 71.886 seconds.
```

## Adding a second dataset

As described above, ipkg, lipkg, sparse and pkgsrc zones have
boot environments (BEs) which are linked to boot environments in the global
zone. Whenever a new BE is created in the global zone, these zone types
also get a new BE and as the global zone is rolled back and forth between
BEs, so are the zones. This means that if the zone holds data for processing
that should be shared across BEs then it should be placed in a separate
dedicated dataset.

The dataset can be created anywhere, but the following example creates it
within the zone's top-level dataset and mounts it at _/data_ within the zone;
the zone must be installed before the second dataset can be created.

```terminal
omnios# zfs create -o mountpoint=/data rpool/zones/test/data
omnios# zfs set zoned=on rpool/zones/test/data
omnios# zonecfg -z test 'add dataset; set name=rpool/zones/test/data; end'
```


---
---
---

# To-do

* separate datasets for cross-BE data
* pkg update -r -C & properties
* persistent datasets
* system scheduler
* resource controls


