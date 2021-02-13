---
title: Cutting a Release
category: dev
show_in_sidebar: true
---

# Cutting a Release

Every 6 months, a new OmniOS stable release is made. Since it is not a
frequent occurence, this page records the required tasks.

## Update data

Before a release, the following data within _illumos-omnios_ should be updated:

* tzdata
* PCI IDs

Ideally these should be upstreamed to illumos-gate too.

## Create repositories

Create the new package repositories on the OOCE package server using the
`create_release` script.

```terminal
ooce# /pkg/create_release r151028
Creating release r151028 (28)
  core (omnios/core) @ 10028
  extra (extra.omnios/supplemental) @ 10228
  staging (omnios/core) @ 10128
```

### pkg/server

Check pkg/server status

```terminal
ooce# svcs '*/pkg/server:r151028*'
STATE          STIME    FMRI
online         12:55:22 svc:/application/pkg/server:r151028_core
online         12:55:24 svc:/application/pkg/server:r151028_extra
online         12:55:27 svc:/application/pkg/server:r151028_staging
```

### nginx

Test the configuration and, if everything is ok, reload.

```terminal
ooce# /opt/ooce/nginx-*/sbin/nginx -t
nginx: the configuration file /etc/opt/ooce/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/opt/ooce/nginx/nginx.conf test is successful
ooce# /opt/ooce/nginx-*/sbin/nginx -s reload
```

Test web browsing to the release, for example -
<https://pkg.omnios.org/r151028>

## Create branches

For each of the following repositories, create a branch for the new release -
`r1510nn` - and create a PR to update the indicated files. **Set up
branch protection in github using the previous branch as a template**

### illumos-omnios

_No files to update in this repository; just create the new branch._

### illumos-kvm

_No files to update in this repository; just create the new branch._

### illumos-kvm-cmd

_No files to update in this repository; just create the new branch._

### omnios-build

* `lib/config.sh` - RELVER
* `tools/test` - remove check against doc/packages
* `doc/packages.md` - remove

### pkg5

_No files to update in this repository; just create the new branch._

### kayak

* `build/build_miniroot` - change _bloody_ to _r1510nn_
* `build/build_zfs_send` - change _bloody_ to _r1510nn_

### gfx-drm

_No files to update in this repository; just create the new branch._

## Update Master Branches

### omnios-build

* `lib/config.sh`

### omnios-extra

* `lib/config.sh`

# Release Testing Checklist

### Installation

* [ ] Upgrade from LTS
* [ ] Upgrade from previous stable

* [ ] ISO installation
* [ ] USB installation
* [ ] PXE installation via pxegrub
* [ ] PXE installation via loader

### TBC...

## Updates Upon Release (website)

* \_config.yml
* releasenotes.md
* schedule.md

