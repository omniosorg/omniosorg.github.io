---
title: Creating a simple zone
category: setup
order: 21
show_in_sidebar: true
---

# Creating a simple zone

The following steps show how to create a simple sparse-branded zone on a
freshly installed OmniOS r151026 server.

### Create a dataset to hold the zones

Each zone ends up with its own ZFS dataset and it's good practice to create
a parent dataset under which the zones will live. Since this test server only
has a root ZFS pool, we'll create it under there but mount it at /zone.

```terminal
root@omniosce:~# zfs create -o mountpoint=/zone rpool/zone
root@omniosce:~# df -h | grep zone
rpool/zone            7.27G    23K      6.77G     1%    /zone
```

### Install the zone brand package

The _ipkg_ and _lipkg_ brands are installed by default, but others
need to be installed before they can be used. For this
example, we'll use the _sparse_ brand so let's install it:

```terminal
root@omniosce:~# pkg list '*/brand/*'
NAME (PUBLISHER)                                  VERSION                    IFO
system/zones/brand/ipkg                           0.5.11-0.151026            i--
system/zones/brand/lipkg                          0.5.11-0.151026            i--

root@omniosce:~# pkg install brand/sparse
           Packages to install:  1
       Create boot environment: No
Create backup boot environment: No

DOWNLOAD                                PKGS         FILES    XFER (MB)   SPEED
Completed                                1/1         14/14      0.0/0.0 33.2k/s

PHASE                                          ITEMS
Installing new actions                         26/26
Updating package state database                 Done
Updating package cache                           0/0
Updating image state                            Done
Creating fast lookup database                   Done
Reading search index                            Done
Updating search index                            1/1
Updating package cache                           1/1
```

### Create a virtual NIC (VNIC) for the zone

```terminal
root@omniosce:~# dladm show-link
LINK        CLASS     MTU    STATE    BRIDGE     OVER
e1000g0     phys      1500   up       --         --

root@omniosce:~# dladm create-vnic -l e1000g0 firstzone0
```

### Create the zone

In this example, we're creating a zone with the _sparse_ brand. To create
_lipkg_ or _ipkg_ brand zones, just substitute the desired brand for sparse.
We're also configuring an allowed address property on the network interface -
this is optional but if set it will apply layer-3 protection to the VNIC so
that the IP address cannot be changed from within the zone and will be
automatically configured.

```terminal
root@omniosce:~# zonecfg -z firstzone
firstzone: No such zone configured
Use 'create' to begin configuring a new zone.
zonecfg:firstzone> create
zonecfg:firstzone> set brand=sparse
zonecfg:firstzone> set ip-type=exclusive
zonecfg:firstzone> set zonepath=/zone/firstzone
zonecfg:firstzone> add net
zonecfg:firstzone:net> set physical=firstzone0
zonecfg:firstzone:net> set allowed-address=10.0.0.154/24
zonecfg:firstzone:net> set defrouter=10.0.0.1
zonecfg:firstzone:net> end
zonecfg:firstzone> verify
zonecfg:firstzone> commit
zonecfg:firstzone> exit
```

### Install the zone

```terminal
root@omniosce:~# zoneadm -z firstzone install
A ZFS file system has been created for this zone.

       Image: Preparing at /zone/firstzone/root.
Sanity Check: Looking for 'entire' incorporation.
   Publisher: Using omnios (https://pkg.omniosce.org/r151026/core/).
       Cache: Using /var/pkg/publisher.
  Installing: Packages (output follows)
Packages to install: 186
Mediators to change:   2
 Services to change:   5

DOWNLOAD                                PKGS         FILES    XFER (MB)   SPEED
Completed                            186/186     1448/1448      4.8/4.8  212k/s

PHASE                                          ITEMS
Installing new actions                     5497/5497
Updating package state database                 Done
Updating package cache                           0/0
Updating image state                            Done
Creating fast lookup database                   Done
 Postinstall: Copying SMF seed repository ... done.
        Done: Installation completed in 68.616 seconds.

```

### Boot the zone

```terminal
root@omniosce:~# zoneadm -z firstzone boot
```

### Log in

```terminal
root@omniosce:~# zlogin firstzone
[Connected to zone 'firstzone' pts/2]
OmniOS 5.11     omnios-r151026-b6848f4455       June 2018
root@firstzone:~#
root@firstzone:~# ipadm show-addr
ADDROBJ           TYPE     STATE        ADDR
lo0/v4            static   ok           127.0.0.1/8
firstzone0/_a     from-gz  ok           10.0.0.154/24
lo0/v6            static   ok           ::1/128
```


