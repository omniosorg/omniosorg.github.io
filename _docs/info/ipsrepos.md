---
title: IPS Repositories
category: info
show_in_sidebar: true
---

# IPS Repositories

OmniOS takes a *layer cake* approach to packaging. The core OS contains
the packages needed to build the OS, plus a few small frills (more
shells, tmux/screen, etc.). Users are encouraged to either create their
own package repositories for additional software they want to run (and where
they like it to be installed) or use repositories published by other users
found in "Extras by OmniOSce Community" below. 

## Core And Extra Repos by OmniOSce

{:.bordered .responsive-table}
| URL                                                         | Publisher    | Signed | Build Scripts                                                                                         | Notes                                       |
|-------------------------------------------------------------|--------------|--------|-------------------------------------------------------------------------------------------------------|---------------------------------------------|
| <https://pkg.omniosce.org/{{site.omnios_stable}}/core/>     | omnios       | yes    | [{{site.omnios_stable}}](https://github.com/omniosorg/omnios-build/tree/{{site.omnios_stable}})       | Core OS components (stable)
| <https://pkg.omniosce.org/{{site.omnios_stable}}/extra/>    | extra.omnios | yes    | [master](https://github.com/omniosorg/omnios-extra)                                                   | Additional packages (stable)
| <https://pkg.omniosce.org/{{site.omnios_oldstable}}/core/>  | omnios       | yes    | [{{site.omnios_oldstable}}](https://github.com/omniosorg/omnios-build/tree/{{site.omnios_oldstable}}) | Core OS components (old stable)
| <https://pkg.omniosce.org/{{site.omnios_oldstable}}/extra/> | extra.omnios | yes    | [master](https://github.com/omniosorg/omnios-extra)                                                   | Additional packages (old stable)
| <https://pkg.omniosce.org/{{site.omnios_lts}}/core/>        | omnios       | yes    | [{{site.omnios_lts}}](https://github.com/omniosorg/omnios-build/tree/{{site.omnios_lts}})             | Core OS components (LTS)
| <https://pkg.omniosce.org/{{site.omnios_lts}}/extra/>       | extra.omnios | yes    | [master](https://github.com/omniosorg/omnios-extra)                                                   | Additional packages (LTS)
| <https://pkg.omniosce.org/bloody/core/>                     | omnios       | no     | [master](https://github.com/omniosorg/omnios-build)                                                   | Core OS components (unstable)
| <https://pkg.omniosce.org/bloody/extra/>                    | extra.omnios | no     | [master](https://github.com/omniosorg/omnios-extra)                                                   | Additional packages (unstable)

## Extras by OmniOSce Community

{:.bordered .responsive-table}
| URL                                      | Publisher          | Maintainer                             | Build Scripts                                                               | Notes                                                                        |
|------------------------------------------|--------------------|----------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------|
| <http://sfe.opencsw.org/localhostomnios> | localhostomnios    | @sfepackages and 3 more from SFE Community| <https://sourceforge.net/p/pkgbuild/code/HEAD/tree/spec-files-extra/trunk/> | Blog: https://sfe.opencsw.org; open for contribution and actively maintained, weekly updates                                                        |
| <https://ips.qutic.com/>                 | application        | [qutic development](https://qutic.com) | <https://github.com/jfqd/omnios-userland>                                   | Userland packages; pull requests welcome; last update 2018-01                               |          
| <http://pkg.niksula.hut.fi/>             | niksula.hut.fi     | pkg@niksula.hut.fi                     | <https://github.com/niksula/omnios-build>                                   | Signed packages; see the [instructions](http://pkg.niksula.hut.fi/)          |last update 2018-05
| <http://pkg.cs.umd.edu/>                 | cs.umd.edu         | Sergey Ivanov                          |                                                                             |                                                                              |last update 2017-08
| <http://scott.mathematik.uni-ulm.de/>    | uulm.mawi          | Steffen Kram                           | [stefri/omnios-build](https://github.com/stefri/omnios-build)               |last update 2016, is changing servers, may come back in 2019                                                                          |
| <http://www.opencsw.org/>                | SysV packages      | OpenCSW                                | <https://sourceforge.net/p/gar/code/HEAD/tree/>                             | A collection of SysV packages (i.e. for use with the old pkgadd(1M) command) |

Note that you as a user of these extra repositories are encouraged to get in touch with the maintainers of these repos. In many cases you can contribute and help improving by writing documentation, sending in build instructions for new software or simply testing packages and send in results. If you need more packages then you should ask for them.

Maintainers of add-on repositories are encouraged to share their work with the
community. If you wish to have your repository listed here, please get in
touch [in the Lobby](https://gitter.im/omniosorg/Lobby) or via
[#omnios on Freenode](http://webchat.freenode.net?randomnick=1&channels=%23omnios&uio=d4).

Note that ms.omniti.com and perl.omniti.com hold packages built
specifically for OmniTI's own use. While there is nothing secret or
astonishing therein, non-OmniTI users may wish to see the
[template branch](https://github.com/omniti-labs/omnios-build/tree/template)
which may be used as the basis to build one's own packages.

