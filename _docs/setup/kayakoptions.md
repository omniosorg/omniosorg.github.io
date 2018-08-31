---
title: Kayak Client Configuration
category: setup
order: 89
show_in_sidebar: true
---

# Kayak Client Configuration

A Kayak client's configuration file is a snippet of bash script that
gets executed during the installation process. When installation begins,
the client config is fetched from the Kayak server to `/tmp/_install_config`.

A sample client config is in `/usr/share/kayak/sample/000000000000.sample` and
looks like this:

```
BuildRpool c0t0d0 c0t1d0
SetHostname instalz
SetTimezone UTC
EnableDNS example.com
SetDNS 80.80.80.80 1.1.1.1
#
# Substitute your interface name for "e1000g0" below
Postboot '/sbin/ipadm create-if e1000g0'
Postboot '/sbin/ipadm create-addr -T dhcp e1000g0/v4'
#
# For static networking, edit the following for your environment
#   and remove the second ipadm line above.
# Postboot '/sbin/ipadm create-addr -T static -a 192.168.1.2/24 e1000g0/v4'
# Postboot '/sbin/route -p add default 192.168.1.1'
#
# Uncomment to disable automatic reboot
# NO_REBOOT=1
```

Strictly speaking, the only mandatory component is `BuildRpool` but
you will probably want to set things like the hostname, timezone and DNS
and set up networking. See below for additional Postboot examples.

## BuildRpool

Arguments are one or more of:

* Disk device names like _c0d0_ (IDE, legacy-mode SATA) or _c0t0d0_
  (SCSI/AHCI/SAS/FC), space-separated;
* Size comparisons: either &lt; or &gt; may be specified along with a number
  of megabytes to indicate that you want only devices less than or equal to,
  or greater than or equal to that size, respectively;
* Patterns: indicated by a leading _~_, patterns are fed to
   [egrep(1)](http://illumos.org/man/1/egrep)
  to limit the list of devices to those whose descriptions match the pattern.

Arguments may be combined. If multiple arguments are comma-separated,
the terms are ANDed together so that only devices matching *all*
constraints are considered. Any space-separated arguments are evaluated
separately.

Each device will be formatted with an SMI disklabel and partitioned such
that encompasses the full size of the disk. At this time, partitioning
is not configurable.

If multiple devices are matched by the argument(s), a simple n-way
mirror will be created.

Examples:

{:.bordered .responsive-table}
| Command                            | Description                                                                                                      |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|
| BuildRpool c0t0d0                  | Use c0t0d0 only                                                                                                  |
| BuildRpool c0t0d0 c0t1d0           | Use c0t0d0 and c0t1d0 only (makes a 2-way mirror)                                                                |
| BuildRpool <161000                 | Use all devices whose size is less than or equal to 161,000 MB                                                   |
| BuildRpool >80000,<1000000         | Use all devices whose size is greater than or equal to 80,000 MB and less than or equal to 1,000,000 MB (1 TB)   |
| BuildRpool ~SEAGATE                | Use all devices whose description contains the string SEAGATE                                                    |
| BuildRpool c0t0d0 ~INTELSSD,<40000 | Use c0t0d0 and all devices whose description contains INTELSSD and whose size is less than or equal to 40,000 MB |

## SetHostname

Takes a single argument and sets the hostname in the running miniroot
environment as well as placing it in `/etc/nodename` in the installed
environment.

## AutoHostname

Takes one optional argument, the suffix for the automatically generated
hostname. Defaults to *omnios*.

The hostname is calculated based on the mac of the first Ethernet
interface.

For example a nic with the following MAC address *03:E7:A4:B6:7B:2A*:

`AutoHostname` results in a hostname of `03-e7-a4-b6-7b-2a-omnios`.

`AutoHostname kayak` results in a hostname of `03-e7-a4-b6-7b-2a-kayak`.

## SetTimezone

Updates the value of TZ in `/etc/default/init` in the installed
environment. The value should be the name of a timezone information
file in .

## EnableDNS

Enable name resolution using DNS for IPv4 and IPv6. The first argument
is the default domain. Remaining arguments, if any, will be the list of
search domains.

By default, the DNS resolver searches the default domain, so if that's
the only domain you care to search, you need not specify an explicit
search path.

Use **SetDNS** to specify one or more name servers.

For example:

```
EnableDNS
```

results only in nsswitch.conf being updated, leaving resolv.conf
untouched.

```
EnableDNS example.com
```

results in a resolv.conf as follows. Search will use example.com.

```
domain example.com
search example.com
```

```
EnableDNS prod.example.com dev.example.com
```

results in a resolv.conf as follows. Search will use prod.example.com
followed by dev.example.com. In other words, order matters for the
search path.

```
domain prod.example.com
search prod.example.com dev.example.com
```

See [resolv.conf(4)](http://illumos.org/man/4/resolv.conf) for details.

Additionally, when EnableDNS is specified,
[/etc/nsswitch.conf](http://illumos.org/man/4/nsswitch.conf) is updated
with “dns” appended to the `hosts:` and `ipnodes:` line, after files.

## SetDNS

Specify one or more servers to use for name resolution.

**note:** Call `EnableDNS` first if you want to specify a default or
search domain. SetDNS implicitly calls EnableDNS without
arguments if no resolv.conf file already exists.

For example:

```
SetDNS 8.8.8.8 8.8.4.4
```

results in resolv.conf having the following appended.

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

```
SetDNS 2001:4860:4860::8888 8.8.8.8
```

results in resolv.conf having the following appended.

```
nameserver 2001:4860:4860::8888
nameserver 8.8.8.8
```

## UseDNS

**Deprecated as of October 1st, 2014**

UseDNS is now a wrapper for backwards compatibility and should not be used;
internally it uses EnableDNS and SetDNS.

## Postboot

These are commands that get run verbatim and in the order specified upon
initial boot of the installed system.

## Static IP Config

See the sample config above.

## NO\_REBOOT

If this is set to a non-null value, the installer will not reboot upon
completion. This is helpful if you are debugging an installation
problem.

