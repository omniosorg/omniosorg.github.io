---
title: pkg(5) Repo Setup
category: makingof
show_in_sidebar: true
---

# Setting Up the Repo Servers

```bash
port=10000
for release in r151022 bloody; do
    for arch in core extra staging; do
        if [ $arch = staging  -a $release = bloody ]; then
           continue
        fi
        ((port++))
        pub=omnios
        collection=core
        if [ $arch = extra ]; then
           pub=extra.omnios
           collection=supplemental
        fi
	pkgrepo create /pkg/$release/$arch
	pkgrepo set -s /pkg/$release/$arch publisher/prefix=$pub
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/collection_type=core
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/description="IPS Packages for OmniOS $release $arch"
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/name="OmniOS $release $arch"
	svccfg -s pkg/server add ${release}_$arch
	svccfg -s pkg/server:${release}_$arch addpg pkg application
	svccfg -s pkg/server:${release}_$arch setprop pkg/inst_root = /pkg/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/content_root = /pkg/content_root
	svccfg -s pkg/server:${release}_$arch setprop pkg/threads = 1200
	svccfg -s pkg/server:${release}_$arch setprop pkg/readonly = false
	svccfg -s pkg/server:${release}_$arch setprop pkg/port = $port
	svccfg -s pkg/server:${release}_$arch setprop pkg/proxy_base = https://pkg.omniosce.org/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/address = 127.0.0.1
	svcadm enable  pkg/server:${release}_$arch
	svcadm restart  pkg/server:${release}_$arch
    done
done
```
