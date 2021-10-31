---
layout: page_wide
title: IPS Repositories
category: info
show_in_sidebar: true
---

# IPS Repositories

OmniOS takes a layered approach to packaging. In addition to the fairly minimal
software delivered as the core OS, additional packages are provided through
extra repositories. There is an extra repository managed by the OmniOS
Association, and several managed by third parties.

## Core And Extra Repos by the OmniOS Association

The table below shows URLs for the latest stable release. Substitute the
version number for the release you are running.

{:.bordered .responsive-table}
| URL	| Publisher	| Signed | Build Scripts	| Notes	|
| ---	| ---		| ---	| ---			| ---	|
| <https://pkg.omnios.org/{{site.omnios_stable}}/core/>	| omnios	| yes	| [{{site.omnios_stable}}](https://github.com/omniosorg/omnios-build/tree/{{site.omnios_stable}})	| Core OS
| <https://pkg.omnios.org/{{site.omnios_stable}}/extra/>	| extra.omnios	| yes	| [master](https://github.com/omniosorg/omnios-extra)							| Additional packages
| <https://pkg.omnios.org/bloody/core/>			| omnios	| no	| [master](https://github.com/omniosorg/omnios-build)							| Core OS
| <https://pkg.omnios.org/bloody/extra/>			| extra.omnios 	| no	| [master](https://github.com/omniosorg/omnios-extra)							| Additional packages

### Mirrors

There are is also a US mirror for the core OmniOS packages, kindly hosted by
[Joyent](https://www.joyent.com/). To add this mirror to the publisher
configuration use the `-m` option to `set-publisher` as shown below, replacing
_{{site.omnios_stable}}_ with the release you are running:

```terminal
# pkg set-publisher -m https://us-west.mirror.omnios.org/{{site.omnios_stable}}/core/ omnios
```

## Packages by the OmniOS Community

{:.bordered .responsive-table}
| URL	| Publisher	| Maintainer	| Notes	|
| ---	| ---		| ---		| ---	|
| <https://sfe.opencsw.org/localhostomnios><br>[(build scripts)](https://sourceforge.net/p/pkgbuild/code/HEAD/tree/spec-files-extra/trunk/) | localhostomnios   | @sfepackages and 3 more from SFE Community | Blog: <https://sfe.opencsw.org>; open for contribution and actively maintained, weekly updates |

Note that you as a user of these extra repositories are encouraged to get in
touch with the maintainers of these repos. In many cases you can contribute and
help by writing documentation, sending in build instructions for new
software or simply testing packages and sending in results. If you need more
packages then you should ask for them.

Maintainers of add-on repositories are encouraged to share their work with the
community. If you wish to have your repository listed here, please
[get in touch](/about/contact.html).
