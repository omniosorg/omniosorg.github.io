---
layout: post
title: Automatic boot environment naming
synopsis: Automatic boot environment naming
---

Here's a sneak preview of a new feature that has been added to the `pkg`
utility in our bloody release and is being back-ported to r151026; automatic
boot environment naming. It's a small change but one that makes it easier
to keep track and I've been wanting it for a while.

At present, if a package update means that a new boot environment (BE)
is required then it will be automatically named by appending a suffix
to the current BE name (or incrementing any existing suffix). It's possible
to override the BE name via `pkg update --be-name=xxx` but if you don't
remember to do this then you end up with a list of boot environments
like this:

```terminal
r151026$ beadm list
BE         Active Mountpoint Space Policy Created
omnios     -      -          4.48M static 2018-04-06 09:56
omnios-1   -      -          7.45M static 2018-04-06 22:30
omnios-2   -      -          5.45M static 2018-04-20 17:55
omnios-3   NR     /          5.95G static 2018-07-25 10:07
```

The new feature uses an image property to define the template to be used
when naming a new BE as a result of an update. The template can contain
tokens (documented on the _pkg(1)_ man page) such as _%r_ to indicate the
release version. The recommended value for this template is `omnios-r%r` as
shown here. The default value for this property is empty in r151026 so it
needs setting explicitly.

```terminal
r151026$ pfexec pkg set-property auto-be-name omnios-r%r
```

Now let's try an update:

```terminal
r151026$ pkg list -u
NAME (PUBLISHER)                                  VERSION                    IFO
SUNWcs                                            0.5.11-0.151026            i--
release/name                                      0.5.11-0.151026            i--
service/network/smtp/dma                          0.11-0.151026              i--
system/zones/brand/lx                             0.5.11-0.151026            i--

r151026$ pfexec pkg update
            Packages to update:   4
       Create boot environment: Yes
Create backup boot environment:  No

DOWNLOAD                                PKGS         FILES    XFER (MB)   SPEED
Completed                                4/4       494/494      7.1/7.1  5.7M/s

PHASE                                          ITEMS
Removing old actions                             4/4
Installing new actions                           4/4
Updating modified actions                    686/686
Updating package state database                 Done
Updating package cache                           4/4
Updating image state                            Done
Creating fast lookup database                   Done
Reading search index                            Done
Updating search index                            4/4
Updating package cache                           3/3

A clone of r151026i exists and has been updated and activated.
On the next boot the Boot Environment omnios-r151026m will be
mounted on '/'.  Reboot when ready to switch to this updated BE.

-------------------------------------------------------------------------------
Find release notes:                        https://omniosce.org/releasenotes
-------------------------------------------------------------------------------
Get a support contract:                    https://omniosce.org/support
Sponsor OmniOS development:                https://omniosce.org/patron
Contribute to OmniOS:                      https://omniosce.org/joinus
-------------------------------------------------------------------------------
```

The template is applied and the new BE gets a sensible name:

```terminal
r151026$ beadm list
BE                Active Mountpoint Space Policy Created
omnios            -      -          4.48M static 2018-04-06 09:56
omnios-1          -      -          7.45M static 2018-04-06 22:30
omnios-2          -      -          5.45M static 2018-04-20 17:55
omnios-3          N      /          5.95G static 2018-07-25 10:07
omnios-r151026m   R      -          6.07G static 2018-07-25 10:21
```

It's still possible to override the name via the `--be-name` option and if
the update does not change the release then a suffix will be applied just
as before.

> This feature is coming to r151026m - scheduled for release w/c 30.7.2018

