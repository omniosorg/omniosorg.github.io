---
title: pkg(5) Repo Setup
category: makingof
show_in_sidebar: true
---

# Setting Up the Repo Servers

```bash
for release in r151022 bloody; do
    relnum=${release#r1510*}
    [ "$release" = "bloody" ] && relnum=99
    for arch in core extra staging; do

        pub=omnios
        collection=core
        port=100$relnum

        case $release/$arch in
            bloody/staging)	continue ;;	# No staging for bloody
	    */staging)		((port = port + 100)) ;;
	    */extra)		((port = port + 200))
				pub=extra.omnios
				collection=supplemental
				;;
        esac

	## Repo

	pkgrepo create /pkg/$release/$arch
	pkgrepo set -s /pkg/$release/$arch publisher/prefix=$pub
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/collection_type=$collection
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/description="IPS Packages for OmniOS $release $arch"
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/name="OmniOS $release $arch"

	## pkg/server

	svccfg -s pkg/server add ${release}_$arch
	svccfg -s pkg/server:${release}_$arch addpg pkg application
	svccfg -s pkg/server:${release}_$arch setprop pkg/inst_root = /pkg/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/content_root = /pkg/content_root
	svccfg -s pkg/server:${release}_$arch setprop pkg/threads = 100
	svccfg -s pkg/server:${release}_$arch setprop pkg/readonly = false
	svccfg -s pkg/server:${release}_$arch setprop pkg/port = $port
	svccfg -s pkg/server:${release}_$arch setprop pkg/proxy_base = https://pkg.omniosce.org/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/address = 127.0.0.1
	svcadm enable  pkg/server:${release}_$arch
	svcadm restart  pkg/server:${release}_$arch

    done
done
```
