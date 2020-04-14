---
title: Getting Started
category: info
show_in_sidebar: true
order: 1
---

# Getting Started with OmniOS

## A note on privilege escalation

OmniOS ships with two different methods for privilege escalation.
[`pfexec`](http://illumos.org/man/pfexec) is the Solaris/OmniOS/illumos
standard which uses profiles to specify privileges, however `sudo` is also
included and supported.

If you created a user through the post-installation menu you
will have been asked if you wish to assign the _Primary Administrator_ role
to that user. That's a user profile effectively enabling root access for
the user via `pfexec`.

The examples on the rest of this page use `pfexec` - if you configured
`sudo`, then that can be used instead.

## Update all packages

The first thing that you should do with a fresh installation of OmniOS is to
make sure that all packages are up-to-date. Packages in OmniOS are managed
using the `pkg` command-line utility.

First make sure the list of available packages is up-to-date:

```terminal
$ pfexec pkg refresh
Refreshing catalog 1/1 omnios
```

and show the available updates (no privileges required):

```terminal
$ pkg list -u
NAME (PUBLISHER)                                  VERSION                    IFO
archiver/gnu-tar                                  1.29-0.151024              i--
...
```

and to apply all updates, simply:

```terminal
$ pfexec pkg update
```

If any of the updates require a reboot, then a new boot environment will be
created and this will be shown in the output.

```terminal
A clone of omnios exists and has been updated and activated.
On the next boot the Boot Environment omnios-1 will be
mounted on '/'.  Reboot when ready to switch to this updated BE.
```

Reboot using `shutdown` or `init`:

```terminal
$ pfexec init 6
... or ...
$ pfexec shutdown -i 6 
```

> Do not be tempted to use `reboot now` as this will result in the boot loader
> trying to load a kernel named _now_, failing and dropping to its forth
> interpreter with an `ok` prompt. If you do this, recovery is possible via
> the following two commands:
```
ok set bootfile=platform/i86pc/kernel/amd64/unix
ok boot
```

## Basic Package Management

`pkg` is the principal method of installing software in OmniOS.
Let's query the package manager for a version of gcc:

```terminal
$ pkg list -a 'developer/gcc?'
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc7                                    7.4.0-151032.0             ---
developer/gcc8                                    8.3.0-151032.0             ---
```

Note that you can ruch a short-form query against the trailing part of package 
name, without globbing support:
```
$ pkg list -a bhyve
NAME (PUBLISHER)                                  VERSION                    IFO
system/bhyve                                      0.5.11-151032.0            ---
system/library/bhyve                              0.5.11-151032.0            i--
system/zones/brand/bhyve                          0.5.11-151032.0            ---
$ # The below will fail because we have gcc7 or gcc8 available, but to match any version of gcc we must use wildcards
$ pkg list -a gcc 
pkg list: no packages matching the following patterns are allowed by installed incorporations, or image variants that are known or installed
  gcc
Use -af to allow all versions.
```

or a long-form query that is run against the entire package name (including 
category, e.g. developer), which supports globbing via the `?` wildcard that
matches any single character, and the `*` wildcard that matches zero or more 
of any character.

```terminal
$ pkg list -a *brand*
NAME (PUBLISHER)                                  VERSION                    IFO
system/zones/brand/bhyve                          0.5.11-151032.0            ---
system/zones/brand/illumos                        0.5.11-151032.0            ---
system/zones/brand/ipkg                           0.5.11-151032.0            i--
system/zones/brand/kvm                            0.5.11-151032.0            ---
system/zones/brand/lipkg                          0.5.11-151032.0            i--
system/zones/brand/lx                             0.5.11-151032.0            ---
system/zones/brand/pkgsrc                         0.5.11-151032.0            ---
system/zones/brand/s10                            0.5.11-151032.0            ---
system/zones/brand/sn1                            0.5.11-151032.0            ---
system/zones/brand/sparse                         0.5.11-151032.0            ---
$ # The below will fail because in order to use wildcards, we must find a match against the *full* package name
$ pkg list -a gcc? 
 
pkg list: no packages matching the following patterns are allowed by installed incorporations, or image variants that are known or installed
  gcc?
Use -af to allow all versions
$ # This is better
$ pkg list -a *gcc? 
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc7                                    7.4.0-151032.0             ---
developer/gcc8                                    8.3.0-151032.0             ---
$ # This will also work in this case
$ pkg list -a */gcc? 
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc7                                    7.4.0-151032.0             ---
developer/gcc8  
$ # For the same results as the short form above
$ pkg list -a  */bhyve 
NAME (PUBLISHER)                                  VERSION                    IFO
system/bhyve                                      0.5.11-151032.0            ---
system/library/bhyve                              0.5.11-151032.0            i--
system/zones/brand/bhyve                          0.5.11-151032.0            ---
$ # The most general search we can pefrorm. Note the differences with the search directly above, 'bhyve' can appear anywhere in the name
$ pkg list -a *bhyve* 
NAME (PUBLISHER)                                  VERSION                    IFO
system/bhyve                                      0.5.11-151032.0            ---
system/bhyve/firmware                             20190904-151032.0          ---
system/bhyve/tests                                0.5.11-151032.0            ---
system/library/bhyve                              0.5.11-151032.0            i--
system/zones/brand/bhyve                          0.5.11-151032.0            ---

```

## Development Environment Setup

If you wish to compile software, you will need to install a 
compiler and supporting utilities. 

> If you're interested in building illumos or OmniOS, refer to
> the [Building OmniOS](/dev/build_instructions.html) page.

To see the list of available compilers, query the package system 
as above:

```terminal
$ pkg list -a 'developer/gcc?'
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc7                                    7.4.0-151032.0             ---
developer/gcc8                                    8.3.0-151032.0             ---
```

You then have two choices: 
- to use the `build-essential` meta-package, available 
from OmniOS r151026 onwards, which will  install the latest compiler version 
along with other packages generally required for a development environment:
```terminal
$ pfexec pkg install build-essential
```
- or to install a desired compiler/version along with the `system/header` package:

```terminal
$ pfexec pkg install developer/gcc8 system/header
```

This second option would give you enough to build simple software but you may also 
want to install the following packages to provide additional utilities.

```terminal
$ pfexec pkg install \
	developer/build/autoconf \
	developer/build/automake \
	developer/build/gnu-make \
	developer/build/make \
	developer/lexer/flex \
	developer/object-file \
	developer/parser/bison
```

If you install multiple versions of `gcc`, then you can switch the links in
`/usr/bin` between versions by changing the pkg system mediator. Alternatively
you can use a specific version by invoking it directly or changing your PATH.

```terminal
$ gcc -v
gcc version 6.4.0 (GCC)
$ pfexec pkg set-mediator -V 5 gcc
$ gcc -v
gcc version 5.5.0 (GCC)
```

## More information

This page is a work-in-progress and contributions are very welcome. The
[system administration page](http://wiki.omniosce.org/GeneralAdministration)
in the wiki provides some further information that may eventually be
incorporated into this page.

