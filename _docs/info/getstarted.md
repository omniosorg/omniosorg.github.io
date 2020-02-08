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

## Development Environment Setup

If you wish to compile software, you will need to install a compiler and
supporting utilities. To see the list of available compilers, query the
package system as follows:

> If you're interested in building illumos or OmniOS, refer to
> the [Building OmniOS](/dev/build_instructions.html) page.

```terminal
$ pkg list -a 'developer/gcc?'
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc5                                    5.5.0-0.151024             ---
developer/gcc6                                    6.4.0-0.151024             ---
```

Note that our query is run against the **entire package name**, including its category (in this case, developer), however a short form can be used. For example, `bhyve` would match against `system/bhyve`, `system/bhyve/firmware`, `system/library/bhyve`, and `system/zones/brand/bhyve`, but `gcc` would not match against `gcc5` due to the extra `5`. Globbing is provided (remember to use quotes if using e.g. bash), using the `?` and `*`  wildcards to match one or zero or more instances of any character respectively. Therefore, for the most general search for a term, use the following:

```terminal
$ pkg list -a '*gcc*'
NAME (PUBLISHER)                                  VERSION                    IFO
developer/gcc44                                   4.4.4-151032.0             ---
developer/gcc44/libgmp-gcc44                      5.0.2-151032.0             ---
developer/gcc44/libmpc-gcc44                      0.8.2-151032.0             ---
developer/gcc44/libmpfr-gcc44                     3.1.0-151032.0             ---
developer/gcc5                                    5.5.0-0.151024             ---
developer/gcc6                                    6.4.0-0.151024             ---
sfe/developer/gcc (localhostomnios)               4.9.4-0.151030.3           ---
sfe/developer/gcc-46 (localhostomnios)            4.6.4-0.0.151012           ---
sfe/developer/gcc-48 (localhostomnios)            4.8.5-0.0.151014           ---
sfe/developer/gcc-49 (localhostomnios)            4.9.4-0.151030.3           ---
sfe/developer/gcc-54 (localhostomnios)            5.4.0-0.0.151014           ---
sfe/developer/gcc-7 (localhostomnios)             7.3.0-0.0.151022           ---
sfe/developer/gcc/src (localhostomnios)           7.3.0-0.0.151022           ---
sfe/system/library/gcc-46-runtime (localhostomnios) 4.6.4-0.0.151012           ---
sfe/system/library/gcc-48-runtime (localhostomnios) 4.8.5-0.0.151014           ---
sfe/system/library/gcc-49-runtime (localhostomnios) 4.9.4-0.151030.3           ---
sfe/system/library/gcc-54-runtime (localhostomnios) 5.4.0-0.0.151014           ---
sfe/system/library/gcc-7-runtime (localhostomnios) 7.3.0-0.0.151022           ---
sfe/system/library/gcc-runtime (localhostomnios)  4.9.4-0.151030.3           ---
system/library/gcc-runtime                        8-151032.0                 i--
```


We can then install the desired version along with the `system/header` package:

```terminal
$ pfexec pkg install developer/gcc6 system/header
```

This will give you enough to build simple software but you may also want to
install the following packages to provide additional utilities.

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

> From OmniOS r151026 onwards, a `build-essential` meta-package will be
> available to install the latest compiler version along with other packages
> generally required for a development environment.

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

