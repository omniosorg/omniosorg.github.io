---
title: Migrate KVM to bhyve
category: info
show_in_sidebar: true
---

# Migrating an OmniOS virtual machine from KVM to bhyve

This is a walk-through of how I moved a development OmniOSce bloody virtual
machine from KVM to bhyve under an OmniOS r151028 global zone. In the end,
this process turned out to be much easier than I feared; the main thing was
making sure that the root pool was mountable on the new system.

> Before proceeding, snapshot the disk zvols in case anything goes wrong.

# Set the root disk serial number

Switching an illumos guest like OmniOS from KVM to bhyve will result in the
rpool disk gaining a new controller number *and* a new serial number. This will
make the root pool unimportable and the new VM will just panic. The first step
therefore is to manually set the serial number to the same as that which bhyve
will create.

The KVM machine was managed via [kvmadm](http://www.kvmadm.org)
and so a number of kvmadm commands appear below.

bhyve constructs disk serial numbers based on their underlying physical
path. Specifically `BHYVE-` followed by the first 12 characters from the MD5
checksum of that path, separated into groups of 4 and separated by hyphens:

```terminal
gz$ kvm list bloody | grep hdd
            "disk_path" : "/dev/zvol/rdsk/data/omniosce/hdd-bloody",
gz$ echo '/dev/zvol/rdsk/data/omniosce/hdd-bloody\c' | digest -a md5 | cut -c1-12 | tr '[a-z]' '[A-Z]' | sed 's/..../-&/g'
-B066-A256-5589
```

So in this case, the default disk serial number under bhyve will be
> BHYVE-B066-A256-5589

Let's update the KVM configuration with this new serial number:

```terminal
gz$ pfexec kvmadm edit bloody
...
gz$ kvmadm list bloody
...
      "disk" : [
         {
            "cache" : "none",
            "model" : "virtio",
            "boot" : "true",
            "disk_path" : "/dev/zvol/rdsk/data/omniosce/hdd-bloody",
            "disk_size" : "300G",
            "index" : "0",
            "serial" : "BHYVE-B066-A256-5589"
         },
...
```

and then restart the KVM machine to check that the new serial number has
been applied:

```terminal
gz$ pfexec kvmadm restart bloody
...
bloody$ iostat -En
c2t0d0           Soft Errors: 0 Hard Errors: 0 Transport Errors: 0
Vendor: Virtio Product: Block Device Revision: 0000 Serial No: BHYVE-B066-A256-5589
Size: 322.12GB <322122547200 bytes>
Media Error: 0 Device Not Ready: 0 No Device: 0 Recoverable: 0
Illegal Request: 0 Predictive Failure Analysis: 0
```

# Configure the OS for serial console:

The first line configures _loader_ to use the serial console only and the
remaining commands change the default OS console to ttya.

```terminal
bloody# echo -h > /boot/config
bloody# cat << EOM > /boot/conf.d/serial
console="ttya,text"
os_console="ttya"
ttya-mode="115200,8,n,1,-"
EOM
```

# Check disk ashift

bhyve virtual disks default to an 8K sector size, so check the ashift
of the existing root pool so that the disk can be configured for a lower
sector size if necessary.

```terminal
bloody$ zdb | grep ashift
            ashift: 9
```

In my case, the original KVM disk was using 512B sectors so I configured
the bhyve disks with the same as you can see in the configuration below.

# Configure the bhyve zone

Based on this KVM configuration:

```terminal
gz$ kvm list bloody
{
   "bloody" : {
      "disk" : [
         {
            "boot" : "true",
            "index" : "0",
            "cache" : "none",
            "disk_size" : "300G",
            "disk_path" : "/dev/zvol/rdsk/data/omniosce/hdd-bloody",
            "serial" : "BHYVE-B066-A256-5589",
            "model" : "virtio"
         },
         {
            "cache" : "none",
            "index" : "1",
            "serial" : "HONALULU",
            "disk_size" : "8G",
            "disk_path" : "/dev/zvol/rdsk/data/omniosce/hdd-bloody2",
            "model" : "virtio"
         }
      ],
      "vcpus" : "16",
      "nic" : [
         {
            "over" : "switch10",
            "index" : "0",
            "nic_name" : "omniosr0",
            "model" : "virtio"
         }
      ],
      "ram" : "8192",
      "serial" : [
         {
            "serial_name" : "console",
            "index" : "0"
         }
      ],
      "time_base" : "utc",
      "hpet" : "false",
      "vnc" : "socket"
   }
}
```

I ended up with this bhyve zone config. Note that I elected to stay with
legacy boot, although OmniOS can actually EFI boot with a serial console
with a little more work:


```terminal
gz# zonecfg -z bloody info
zonename: bloody
zonepath: /data/zone/bloody
brand: bhyve
autoboot: false
bootargs:
pool:
limitpriv:
scheduling-class:
ip-type: exclusive
hostid:
fs-allowed:
net:
        address not specified
        allowed-address not specified
        defrouter not specified
        global-nic not specified
        mac-addr not specified
        physical: omniosr0
        vlan-id not specified
device:
        match: /dev/zvol/rdsk/data/omniosce/hdd-bloody*
attr:
        name: ram
        type: string
        value: 8G
attr:
        name: vcpus
        type: string
        value: sockets=2,cores=4,threads=2
attr:
        name: bootdisk
        type: string
        value: data/omniosce/hdd-bloody,sectorsize=512/512
attr:
        name: disk
        type: string
        value: data/omniosce/hdd-bloody2,serial=HONALULU,sectorsize=512/512
attr:
        name: bootrom
        type: string
        value: BHYVE_CSM
```

# Boot it up

Now to boot up the new bhyve VM. I connected to the zone console in one
session and then started the zone in another.

```terminal
gz# zlogin -C bloody
[Connected to zone 'bloody' console]

[NOTICE: Zone booting up]
/boot/config: -h

Consoles: serial port a
... elided ...

    ____   __  __  _   _  _
   / __ \ |  \/  || \ | || |                          .:   ..
  | |  | ||      ||  \| || |                         .o,  .o.
  | |__| || |\/| || , `_||_|  ____                   :d.  ld.   .'
   \____/ |_|  |_||_|\/ __ \ / ___|                  cd;  cd;   l.
                     | |  | ||(__                    .dd'  ld,  cc
         community   | |__| | ___)|                   .;oc. 'l:. c;
              edition \____/ |____/                      .''...;;.,c.
                                                                'c:.'
 +=============Welcome to OmniOS===========+       .c.
 |                                         |      .ddd::loo;.    ;:.
 |  1. Boot Multi User [Enter]             |      ;ddddddl.      .;;:.
 |  2. Boot [S]ingle User                  |      :dddddl           lddo,
 |  3. [Esc]ape to loader prompt           |      .ddddd;             .;do
 |  4. Reboot                              |       .odddo.              .o
 |                                         |         ;dddo,              .
 |  Options:                               |           ,lddo,.;'
 |  5. Configure Boot [O]ptions...         |             .;oddd:.
 |  6. Select Boot [E]nvironment...        |              ...;oddl,
 |                                         |               ,l,.'cdddc.
 |                                         |              .cdddc..:dddc.
 |                                         |                 .;odc..,oddl.
 +=========================================+                  .odddl'.;dddc.
                                                              :ddddddl..cddo'

Loading unix...
Loading /platform/i86pc/amd64/boot_archive...
Loading /platform/i86pc/amd64/boot_archive.hash...
Booting...

SunOS Release 5.11 Version omnios-master-c6cc2b6b38 64-bit
Copyright (c) 1983, 2010, Oracle and/or its affiliates. All rights reserved.
Copyright (c) 2017-2018 OmniOS Community Edition (OmniOSce) Association.
NOTICE: hma_vmx_init: CPU does not support VMX
vioif0: DL_ATTACH_REQ failed: DL_SYSERR (errno 22)
vioif0: DL_BIND_REQ failed: DL_OUTSTATE
vioif0: DL_PHYS_ADDR_REQ failed: DL_OUTSTATE
vioif0: DL_UNBIND_REQ failed: DL_OUTSTATE
Hostname: bloody

bloody console login:
```

So far, so good!

```terminal
bloody console login: root
Password:
Last login: Sat Aug 25 15:30:56 2018 on console
Oct  5 12:35:34 bloody login: [ID 644210 auth.notice] ROOT LOGIN /dev/console
OmniOS 5.11     omnios-master-c6cc2b6b38       October 2018
bloody#
bloody# zpool status
  pool: rpool
 state: ONLINE
  scan: scrub repaired 0 in 1h39m with 0 errors on Sat May 12 15:28:36 2018
config:

        NAME        STATE     READ WRITE CKSUM
        rpool       ONLINE       0     0     0
          c2t0d0    ONLINE       0     0     0

errors: No known data errors

bloody# cpuid | grep -i hyper
  RAZ (hypervisor)
Maximum hypervisor CPUID leaf: 0x40000000
Hypervisor vendor string: 'bhyve bhyve '
BHYVE hypervisor detected

bloody# dladm show-link
LINK        CLASS     MTU    STATE    BRIDGE     OVER
vioif1      phys      1500   up       --         --
```

To move the network interface back to _vioif0_, I did the following:

```terminal
bloody# sed -i /vioif/d /etc/path_to_inst
bloody# init 6
...

bloody# dladm show-phys
LINK         MEDIA                STATE      SPEED  DUPLEX    DEVICE
vioif0       Ethernet             up         1000   full      vioif0
bloody# ping 1.1.1.1
1.1.1.1 is alive
```

