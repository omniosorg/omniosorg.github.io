---
title: Cutting a Release
category: dev
show_in_sidebar: true
---

# Cutting a Release

Every 6 months, a new OmniOS stable release is made. Since it is not a
frequent occurence, this page records the required tasks.

## Create repositories

Create the new package repositories on the OOCE package server

### Filesystems

Create new filesystems to hold the package repositories following the existing
pattern.

### pkg server

Use the pattern from <https://omniosce.org/makingof/setuprepo> to
create new repositories on the next available port numbers.

### nginx

On the OOCE package server, create a new file
`/etc/opt/ooce/nginx/ips/r1510nn.conf` by copying that from the previous
release and replacing the release number therein.

Test the configuration with `/opt/ooce/nginx-*/sbin/nginx -t` and, assuming
it is successful, reload with `/opt/ooce/nginx-*/sbin/nginx -s reload`

## Create branches

For each of the following repositories, create a branch for the new release -
`r1510nn` - and create a PR to update the indicated files. **Set up
branch protection in github using the previous branch as a template**

### illumos-omnios

* `usr/src/tools/env/omnios-illumos-gate.sh`
* `usr/src/tools/env/omnios-illumos-omnios.sh`

### omnios-build

* `build/release/root/etc/release`
* `lib/config.sh`
* `tools/test` - remove check against doc/packages

### pkg5

_No files to update in this repository; just create the new branch._

### kayak

* `build/build_miniroot` - change _bloody_ to _r1510nn_
* `build/build_zfs_send` - change _bloody_ to _r1510nn_

## Update Master Branches

### illumos-omnios

* `usr/src/tools/env/omnios-illumos-omnios.sh` - ONNV\_BUILDNUM

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

