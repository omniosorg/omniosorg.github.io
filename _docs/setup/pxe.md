---
title: Installation via PXE Boot
category: setup
order: 88
show_in_sidebar: true
---

# OmniOS Installation via PXE Boot

These instructions show how to set up an OmniOS r151024 (or later) system
as a network install server from which other OmniOS systems can be built.

## Install packages

Start by installing the packages necessary to run the kayak build server.

```
pfexec pkg install kayak kayak-kernel tftp isc-dhcp
```

The `kayak-kernel` package contains the illumos kernel, minimal root
filesystem for installation and two PXE binaries - grub and the illumos
loader; either can be used.

The `kayak` package contains a minimal HTTP server that can be used to
serve system images and configuration files. It is not necessary to use this;
any web server accessible by the client during build can serve these
components. For this example walk-through, the `kayak` service is used.

## Fetch the ZFS installation image

```
cd /var/kayak/kayak
wget {{site.download_path}}/stable/{{site.download_prefix}}{{site.omnios_stable}}{{site.omnios_stable_suffix}}.zfs.bz2
```

> It is possible to customise this image prior to deployment if desired.

## Create a client configuration script

Kayak client configurations are written in bash and are run within the context
of the kayak framework during installation. An example file can be found in
`/usr/share/kayak/sample/000000000000.sample`.

The configuration file should be placed in `/var/kayak/kayak` with a name
matching the client's MAC address, all in capitals, e.g. `010203ABCDEF`.

> The installation process will try the full MAC address first and then
> start removing characters from the end until it finds a configuration
> file. This allows you to create a file that will apply to a group of
> machines with the same MAC address prefix. To create a generic file of
> last resort, call it `0`

Example (root password is `test` in this example):

```
BuildRpool c1t0d0
RootPW '$5$JQkyMDvv$pPzEUsvP/rLwURyrpwz5i1SfVqx2QiEoIdDA9ZrG271'
SetRootPW
SetHostname omniosce
SetTimezone UTC
EnableDNS example.com
SetDNS 1.1.1.1 80.80.80.80
Postboot '/sbin/ipadm create-if e1000g0'
Postboot '/sbin/ipadm create-addr -T dhcp e1000g0/kayak'
SendInstallLog
```

## Configure DHCP

Add an entry to `/etc/dhcpd.conf` for the server you want to build.
Here's a complete working example:

```
subnet 10.0.0.0 netmask 255.255.255.0 { }

host omniosce {
	filename "pxeboot";
	next-server 10.0.0.5;
	option host-name "omniosce";
	hardware ethernet 01:02:03:AB:CD:EF;
	fixed-address 10.0.0.100;
}

```

Filename can either be `pxeboot` to use the illumos loader or `pxegrub` to
use grub.
`next-server` is the IP address of your kayak server.

## Enable the Services

```
pfexec svcadm enable kayak tftp/udp6 dhcp:ipv4
```

> If you have something already running on port 80, it's possible to change the
> port the kayak server uses by running (where 8080 is the port you want):
> `/var/svc/method/svc-kayak -u nobody -g nobody -p 8080`
> but if you're running a full fledged webserver on port 80, it might be better
> to just use that server to serve the directory. 

## Using the illumos loader (filename "pxeboot")

The configuration for builds using the illumos loader can be found
on the kayak server under `/tftpboot/boot/loader.conf.local`
You can customise the line starting with `boot-args=` to change the location
from which the ZFS image and client configuration are fetched. The default
URLs are set as `http:///` which means that they will be fetched from the
`next-server` as defined in the DHCP configuration.

## Using grub (filename "pxegrub")

The configuration file for grub boots is `/tftpboot/boot/grub/menu.lst`.
Customise the line starting with `kernel$` to change the location from
which the ZFS image and client configuration are fetched. As for loader,
a URL containing /// indicates that the `next-server` from DHCP should be
used.

