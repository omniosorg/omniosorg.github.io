---
title: ZRepl Quick Start Guide
layout: page
category: info
show_in_sidebar: true
---

# ZRepl Quick Start Guide

The goal of this guide is to give a quick overview of zrepl, and to demonstrate implementing zrepl to provide continuous backup of a client server. After completing this guide you will also be better prepared to follow the more in-depth [zrepl documentation](https://zrepl.github.io/).

### Introduction to zrepl

zrepl is a one-stop, integrated solution for ZFS replication. zrepl is open source and is written in GO and uses Go modules to manage dependencies.

zrepl enables filesystem replication (both push and pull modes) over secure transport channels such as TLS & SSH. Advanced features include resumable send and receive of replicated datasets, as well as compressed and encrypted options.

Further, zrepl provides automatic snapshot management via periodic filesystem snapshots, flexible pruning, age-based fading and bookmarks to avoid divergence between sender and receiver.

Operation is supported with sophisticated monitoring & logging. Live progress reporting is available via the `zrepl status` subcommand. Comprehensive structured logging is available in human readable, logfmt and json formats. Further, zrepl is fully integrable with syslog.


## Using zrepl to Provide Continuous Backup of a Client Server

The following demonstrates the requirements of our test implementation. Here, we backup a ZFS-based server (`client`) to a central zrepl server (`master`), using a zrepl push job.

* Production server `client` with filesystems to back up:
  * `rpool/var/db`
  * `rpool/home` and all its child filesystems
  * except `rpool/home/paranoid` belonging to a user doing backups themselves
* Backup server `master` with:
  * Filesystem `storage/zrepl/sink/client` + children dedicated to backups of `client`

Our backup solution should fulfill the following requirements:

* Periodically snapshot the filesystems on `client` every 10 minutes
* Incrementally replicate these snapshots to `storage/zrepl/sink/client/*` on `master`
* Keep only very few snapshots on `client` to save disk space
* Keep a fading history (24 hourly, 30 daily, 6 monthly) of snapshots on `master`
* The network is untrusted - zrepl should use TLS to protect its communication and our data.

### Analysis

We can model this situation as two jobs:

* A push job on *client*:
  * Creates the snapshots
  * Keeps a short history of local snapshots to enable incremental replication to backups
  * Connects to the zrepl daemon process on backups
  * Pushes snapshots *master*
  * Prunes snapshots on *master* after replication is complete
* A sink job on *master*:
  * Accepts connections & responds to requests from *client*
  * Limits *client* access to filesystem sub-tree `storage/zrepl/sink/client`


## Implementing zrepl

With the above requirements and provided solution, we can now implement zrepl to provide the continuous backup of the client server.

### Creating the ZFS Pool and ZFS Dataset that will be used for the zrepl master

As this is just an introduction I have chosen to create a zfs pool from a regular file as opposed to a physical device. The following will allow for the necessary creation of the zfs pools and datasets for the purposes of this guide.

#### Create ZFS Pool from File:

```
root@master:# mkdir /file-backed-storage
root@master:# mkfile 10g /file-backed-storage/zrepl
root@master:# zpool create storage /file-backed-storage/zrepl
root@master:# zpool list
NAME      SIZE  ALLOC   FREE  CKPOINT  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROOT
rpool     928G  43.8G   884G        -         -     0%     4%  1.00x  ONLINE  -
storage  9.50G   123K  9.50G        -         -     0%     0%  1.00x  ONLINE  -
```

#### Create ZFS Datasets:


```terminal
root@master:# zfs create storage/zrepl
root@master:# zfs create storage/zrepl/sink
root@master:# zfs list -r storage
NAME                 USED  AVAIL  REFER  MOUNTPOINT
storage              555K  9.20G    24K  /storage
storage/zrepl         48K  9.20G    24K  /storage/zrepl
storage/zrepl/sink    24K  9.20G    24K  /storage/zrepl/sink
```

The above created a parent dataset for zrepl, where further datasets can be created. In this example I also created the dataset `sink` that will be used in this tutorial.
### TLS Certificates

We use the TLS client authentication transport to protect our data on the wire. To keep this tutorial focused on ZRepl, I have skipped the setup of certificates. For further information on certificates, please visit the zrepl TLS Transport [documentation](https://zrepl.github.io/configuration/transports.html#transport-tcp-tlsclientauth) and pay special attention to the note regarding **Subject Alternative Names**.

### Setup the Master zrepl Instance

It is a very simple procedure to install and run zrepl on OmniOS providing that you have a zrepl configuration file that suits your requirements. Following, I install zrepl, create a configuration file that suits our needs as discussed above and start and verify the zrepl service.

### Install zrepl on master:

```terminal
root@master:# pkg install zrepl
```

Create the configuration file:

```terminal
root@master:# cat << EOF > ~/root:# cat << EOF > /etc/opt/ooce/zrepl/zrepl.yml
# zrepl main configuration file.
# For documentation, refer to https://zrepl.github.io/
#
global:
  logging:

    - type: "stdout"
      level:  "debug"
      format: "human"

jobs:
- name: sink
  type: sink
  serve:
      type: tls
      listen: ":8888"
      ca: "/etc/pki/tls/master/root-ca.crt"
      cert: "/etc/pki/tls/master/certs/master.omnios.org.crt"
      key:  "/etc/pki/tls/master/private/master.omnios.org.key"
      client_cns:
        - "client.omnios.org"
  root_fs: "storage/zrepl/sink"
EOF
```

Start the `master` zrepl server and verify:

```terminal
root:# svcadm enable zrepl
root:# svcs zrepl
STATE          STIME    FMRI
online         13:13:59 svc:/system/zrepl:default
```

That takes care of the master zrepl instance!

### Setup the *client* zrepl Instance

Follow the same procedure as above for the client, as follows:

### Install zrepl on client:

```terminal
root@client:# pkg install zrepl
```

Create the configuration file:

```terminal
# zrepl main configuration file.
# For documentation, refer to https://zrepl.github.io/
#
global:
  logging:

    - type: "stdout"
      level:  "debug"
      format: "human"
jobs:
- name: client_to_master
  type: push
  connect:
    type: tls
    address: "master.omnios.org:8888"
    ca: "/etc/pki/tls/client/root-ca.crt"
    cert: "/etc/pki/tls/client/certs/client.omnios.org.crt"
    key: "/etc/pki/tls/client/private/client.omnios.org.key"
    server_cn: "master.omnios.org"
  filesystems: {
    "rpool/var/db": true,
    "rpool/home<": true,
    "rpool/home/paranoid": false
  }
  snapshotting:
    type: periodic
    prefix: zrepl_
    interval: 10m
  pruning:
    keep_sender:
    - type: not_replicated
    - type: last_n
      count: 10
    keep_receiver:
    - type: grid
      grid: 1x1h(keep=all) | 24x1h | 30x1d | 6x30d
      regex: "^zrepl_"
EOF
```

Start the `client` zrepl server and verify:

```terminal
root@client:# svcadm enable zrepl
root@client:# svcs zrepl
STATE          STIME    FMRI
online         13:13:59 svc:/system/zrepl:default
```

We now have a working *client*/*master* zrepl implementation working.

## Verify and Monitor

Allowing some time for the client to generate and send snapshots to the master, the following commands can be run to verify and monitor the zrepl service.

To demonstrate that the master is receiving snapshots from the client, use the following command to display the received snapshots:

```terminal
root@master:# zfs list -r -t snapshot storage
NAME                                                                                   USED  AVAIL  REFER  MOUNTPOINT
storage/zrepl/sink/client.omnios.org/rpool/home/philip@zrepl_20201123_150322_000      0      -    55K  -
```

On the client we can view the operation of zrepl with the `zrepl status` command as follows:

```terminal
root@client:# zrepl status
Job: client_to_master
    Type: push
    Replication:
        Attempt #1
        Status: done
        Progress: [============================================>------] 95.0 KiB / 106.1 KiB @ 0 B/s
          rpool/home/philip DONE (step 1/1, 95.0 KiB/106.1 KiB)
    Pruning Sender:
        Status: Done
        Progress: [================================================================================>] 1/1 snapshots
        rpool/home/philip Completed  (destroy 1 of 11 snapshots)
    Pruning Receiver:
        Status: Done
        Progress: [>] 0/0 snapshots
        rpool             skipped: filesystem is placeholder
        rpool/home        skipped: filesystem is placeholder
        rpool/home/philip Completed  (destroy 0 of 1 snapshots)
    Snapshotting:
        Status: Waiting
        Sleep until: 2020-11-23 15:13:22.746455715 +0000 UTC
            rpool/home/philip SnapDone 200ms snap name: "zrepl_20201123_150322_000"
```

Along with the above, we can also check the zrepl service log:

```terminal
root@master:# tail -f  /var/svc/log/system-zrepl:default.log
```

> **Note:** In the `zrepl.yml` configuration file, the log level has been set as `level:  "debug"`. This is handy when initially setting up zrepl however it is advised to lower this level, when you are confident with your zrepl implementation.

## Sample Backup

Finally, we can inspect the snapshot contents via the `zfs clone` subcommand:

```terminal
root@master:# zfs clone storage/zrepl/sink/client.omnios.org/rpool/home/philip@zrepl_20201124_140320_000 storage/tmp
root@master:# ll /storage/tmp/
total 75
drwxr-xr-x   5 philip   other         17 Nov 23 17:35 .
drwxr-xr-x   5 root     root           5 Nov 24 14:09 ..
-rw-------   1 philip   other       1384 Nov 23 22:26 .bash_history
-rw-r--r--   1 philip   other         30 Nov 12 14:21 .bash_profile
-rw-r--r--   1 philip   other        304 Nov 23 16:32 .bashrc
-rw-r--r--   1 philip   other        371 Nov  6 10:34 .kshrc
...
```

## Looking forward:

For further information on zrepl, the following links have been provided:

* [zrepl Documentation Site](https://zrepl.github.io/)
* [zrepl BSDCan 2018 Talk](https://www.youtube.com/watch?v=c1LKeyP1mos)
* [GitHub Repo](https://github.com/zrepl/zrepl)
