---
layout: post
title: Hole punching a ZFS volume with zpool initialize
synopsis: Playing with 'zpool initialize'
---

I generally do development work for OmniOS bloody in a KVM virtual machine
with a 300G zvol for the disk and that disk is usually only around 10%
full:

```
bloody% zpool list
NAME    SIZE  ALLOC   FREE  CKPOINT  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROT
rpool   298G  34.0G   264G        -         -     7%    11%  1.00x  ONLINE  -
```

Outside of the VM, the zvol is part of a pool which has lz4 compression
enabled and so it starts off using virtually no disk space.
However, since ZFS uses copy-on-write when changing blocks, over time most of
the blocks in the zvol end up being touched and so the zvol size on disk grows
towards 300G.

```
global% zfs list data/omniosce/hdd-bloody
NAME                               USED  AVAIL  REFER  MOUNTPOINT
data/omniosce/hdd-bloody           538G  7.08T   275G  -
```

I thought this would be a good setup to test illumos' new
`zpool initialize` command. This command writes
a pattern of data to all unallocated regions of a pool (or a specific device
in a pool).

The original intention of this new command is actually to ensure that all
blocks in a ZFS vdev are allocated - effectively stretching a new sparse
volume to avoid performance penalties in the future. For that reason the
default data pattern that is written is `0xdeadbeefdeadbeef`.

If I left this as the default, I'd probably still get good space
recovery since blocks containing just this repeated pattern would compress
pretty well, but it's better to write zeroes and have the block not written
to the underlying storage at all.

Changing the default pattern can be done via `mdb` on a live system, or
by setting the value in `/etc/system` and rebooting; this also has the
benefit of changing the default for this value.

```
bloody% pfexec mdb -kwe 'zfs_initialize_value/z0'
zfs_initialize_value:           0xdeadbeefdeadbeef      =       0x0
```

Or, in `/etc/system`:

```
set zfs:zfs_initialize_value=0
```

Now set initialisation running:

```
bloody% pfexec zpool initialize rpool

... a couple of hours later ...

bloody% zpool status
  pool: rpool
 state: ONLINE
  scan: scrub repaired 0 in 1h39m with 0 errors on Sat May 12 15:28:36 2018
config:

NAME     STATE   READ WRITE CKSUM
rpool    ONLINE     0     0     0
  c2t0d0 ONLINE     0     0     0 (100% initialized, completed at ...)

errors: No known data errors
```

and re-checking the disk space used from outside:

```
global% zfs list data/omniosce/hdd-bloody
NAME                       USED  AVAIL  REFER  MOUNTPOINT
data/omniosce/hdd-bloody   308G  7.30T  30.5G  -
```

