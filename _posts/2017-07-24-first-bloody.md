---
layout: post
title: Our first Bloody Update
---

With the urgent security updates and bug fixes for r151022 out of the way we
have spent the last week concentrating on getting bloody updated, including
new ISO, USB and PXE images.  In addition to bringing us up-to-date with the
latest from illumos, we have also bumped many of the userland packages to
their latest released versions.  They’ve passed initial regression testing,
but we could use your help in putting them through their paces a bit more,
so if you have some spare cycles please grab the ISO and set up a bloody
system for testing.  Downloads can be found at
[https://downloads.omniosce.org/media/bloody/](downloads.omniosce.org/media/bloody)

We have also started enabling test suites for userland packages where one is
available in the hope of catching more regressions early and automatically. 
This release also contains the first core bugfix in OmniOSce history.  We
got a report to our issue tracker that both lx and native zones were not
shutting down properly.  Andy quickly identified the likely culprit and
backed out the offending commit and published an updated within hours.

This website has also matured considerabl, it looks
much better now than a few days ago and it comes with much more content.  We
already integrated two contributions from Rich Murphey @rich-murphey (thank
you).  If you would also like to contribute, please send us your pull
requests … the source of the website btw is on
[https://github.com/omniosorg/omniosor.github.com](github.com/omniosorg/omniosor.github.com).

## bloody update 20170721

`uname -v` shows `omnios-master-fab442e53b`

## Updated packages

|packages|old|new|
+--------+-------+
|automake     |   1.15.0 | 1.15.1|
|bind         |   9.10.4P8 | 9.10.5P3|
|dbus         |   1.11.12 | 1.11.14|
|expat        |    2.2.0 | 2.2.2|
|git          |  2.13.0 | 2.13.3|
|gnu-diffutils|        3.5 | 3.6|
|ipmitool     |   1.8.16 | 1.8.18|
|iso-codes    |    3.74 | 3.75|
|mercurial    |     4.1.3 | 4.2.2|
|nghttp2      |  1.21.1 | 1.24.0|
|openssh      |  7.4p1 | 7.5p1|
|openssl      |  1.0.2k | 1.0.2l|
|pciutils     |       3.5.4 | 3.5.5|
|pcre         |   8.40 | 8.41|
|pipe-viewer  |      1.6.0 | 1.6.6|
|screen       |     4.5.1 | 4.6.1|
|sqlite       |     3.3.18 | 3.19.3|
|sudo         |   1.8.7 | 8.20.2|
|tmux         |   2.3 | 2.5|
|vim          |  8.0.567 | 8.0.586|
