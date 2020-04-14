---
title: Migrate rpool to new disk(s)
category: info
show_in_sidebar: true
---

## Migrate rpool to new disk(s)

Migrating the rpool is not just a matter of zfs send and zfs receive since the name of the pool rpool is used literally various places in the core configuration so the name must not be changed. Apart from this the disk(s) containing the rpool also contains the boot block and the boot loader which is not part of the pool and therefore must be dealt with using other tools than zfs. therefore this short guide will give instructions for the simplest and easiest way to accomplish this task.

This guide is using a mirrored rpool as an example so if your own rpool just consists of one disk you can use this guide too just using one disk where the guide talks of two disks.

NB. **It is always a good idea to perform a scrub before doing operations on the pool which is potentially dangerous!.**

## Configuration used in this guide

This is the current rpool:

``` terminal
$ zpool status
  pool: rpool
 state: ONLINE
  scan: scrub repaired 0 in 3h6m with 0 errors on Sat Apr  11 23:21:26 2020
config:

        NAME        STATE     READ WRITE CKSUM
        rpool       ONLINE       0     0     0
          mirror-0  ONLINE       0     0     0
            c1t1d0  ONLINE       0     0     0
            c1t2d0  ONLINE       0     0     0

```

Disks available in the system:

```terminal
AVAILABLE DISK SELECTIONS:
       0. c1t1d0 <VBOX-HARDDISK-1.0-16.00GB>
          /pci@0,0/pci8086,2829@1f,2/disk@1,0
       1. c1t2d0 <VBOX-HARDDISK-1.0-16.00GB>
          /pci@0,0/pci8086,2829@1f,2/disk@2,0
       2. c1t3d0 <VBOX-HARDDISK-1.0-16.00GB>
          /pci@0,0/pci8086,2829@1f,2/disk@3,0
       3. c1t4d0 <VBOX-HARDDISK-1.0-16.00GB>
          /pci@0,0/pci8086,2829@1f,2/disk@4,0

```

The task is to migrate the rpool from the mirror consisting of c1t1d0 and c1t2d0 to a new mirror consisting of c1t3d0 and c1t4d0.

So after completing this guide your rpool should look like this:

``` terminal
$ zpool status
  pool: rpool
 state: ONLINE
  scan: resilvered 1.59G in 0h11m with 0 errors on Sun Apr 12 00:35:53 2020
config:

        NAME        STATE     READ WRITE CKSUM
        rpool       ONLINE       0     0     0
          mirror-0  ONLINE       0     0     0
            c1t3d0  ONLINE       0     0     0
            c1t4d0  ONLINE       0     0     0

```

## Attach the new disk(s) to rpool

The first step is to attach the new disks to the existing rpool using the command **zpool attach** like this:

``` terminal
$ sudo zpool attach rpool c1t1d0 c1t3d0
Password: 
Make sure to wait until resilver is done before rebooting.
```

Running the command **zpool status** after attaching the new disk will give this output:

``` terminal
$ zpool status
  pool: rpool
 state: ONLINE
status: One or more devices is currently being resilvered.  The pool will
        continue to function, possibly in a degraded state.
action: Wait for the resilver to complete.
  scan: resilver in progress since Mon Apr 13 14:24:45 2020
        18.1M scanned out of 1.60G at 1.21M/s, 0h22m to go
    16.1M resilvered, 1.10% done
config:

        NAME        STATE     READ WRITE CKSUM
        rpool       ONLINE       0     0     0
          mirror-0  ONLINE       0     0     0
            c1t1d0  ONLINE       0     0     0
            c1t2d0  ONLINE       0     0     0
            c1t3d0  ONLINE       0     0     0

```

**You must not do anything until resilver is done**. So go and grab a cup of coffee or some other fluid you want to drink.

To monitor progress you can use this command:

``` terminal
$ yes "zpool status; sleep 10"|sh

Use Ctrl+c to quit the command.
```


The above should be done for every new disk which in this case means one more time for c1t4d0

## Install boot block and boot loader to the new disk(s)

The next step is to install the boot block and the boot loader to the new disk(s) using the command **bootadm install-bootloader** like this:

``` terminal
$ sudo bootadm install-bootloader -P rpool
```

## Reboot to test migration was successful

Before detaching the old disk(s) from the rpool we make a reboot to ensure everything was successful. **Remember to change the first boot device in the BIOS to use the new disk (or one of the new disk(s)).**

When rebooting you might see a warning from 'devid register' that device ids has changed in case you need to reorder the disks in the BIOS to be able to change boot device. This is just a warning which will be fixed by creating a new boot_archive either manually or automatically by OmniOSce when you reboot or power down your system.

## Detach old disk(s) from the rpool

If you were able to make a successful reboot on the new disk(s) then the time has come to detach the old disk(s) from the rpool using the command **zpool detach** like this:

``` terminal
sudo zpool detach rpool c1t1d0
sudo zpool detach rpool c1t2d0
```

After detaching the old disk(s) from the rpool you should do a reboot to ensure everything is fine.

If the new disk(s) have a higher capacity than the old disk(s) and you want the new rpool to grow to the new size of the disk(s) you will have to run the following command:

``` terminal
zpool set autoexpand=on rpool
```

When rebooting you might see a warning from 'devid register' that device ids has changed when removing the old disk(s). This is just a warning which will be fixed by creating a new boot_archive either manually or automatically by OmniOSce when you reboot or power down your system.

### Contact

Any problems or questions, please [get in touch](/about/contact.html).