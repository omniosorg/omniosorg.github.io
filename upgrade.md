---
layout: page_wide
title: Upgrading OmniOS
show_in_menu: false
show_in_sidebar: true
---

# Upgrading to a New OmniOS Release

The following table shows the supported upgrade paths between OmniOS versions.
Paths not shown have not been tested and are **not supported**.

<div class="fa-orange" style="padding-top: 0.1em">
<i class="far fa-3x fa-pull-left fa-exclamation-triangle"></i>
<h2>Upgrade notes:</h2>
</div>
* The grub boot loader is not supported as of the r151054 LTS release.
  [Migrate to the replacement loader](/info/loader.html) prior to upgrading.
* Before upgrading, check that you have
  [removed any legacy options from your OpenSSH configuration file](/info/sunssh.html).
  Failure to do so may result in the SSH service not starting after upgrade.

{:.bordered .responsive-table}
| From Release			| 	 	| To Release(s)
| ------------			|		| -------------
| r151052 (stable)		| &#8594;	| r151054 (LTS)
| r151050 (stable)		| &#8594;	| r151052 (stable), r151054 (LTS)
| r151048 (stable)		| &#8594;	| r151050 (stable), r151052 (stable), r151054 (LTS)
| r151046 (LTS)			| &#8594;	| r151048 (stable), r151050 (stable), r151052 (stable), r151054 (LTS)
| r151044 (stable)		| &#8594;	| r151046 (LTS)
| r151042 (stable)		| &#8594;	| r151044 (stable), r151046 (LTS)
| r151040 (stable)		| &#8594;	| r151042, r151044 (stable), r151046 (LTS)
| r151038 (LTS)			| &#8594;	| r151040, r151042, r151044 (stable), r151046 (LTS)
| r151036 (stable)		| &#8594;	| r151038 (LTS)
| r151034 (stable)		| &#8594;	| r151036 (stable), r151038 (LTS)
| r151032 (stable)		| &#8594;	| r151034, r151036 (stable), r151038 (LTS)
| r151030 (LTS)			| &#8594;	| r151032, r151034, r151036 (stable), r151038 (LTS)
| r151028 (stable)		| &#8594;	| r151030 (LTS)
| r151026 (stable)		| &#8594;	| r151028 (stable), r151030 (LTS)
| r151024 (stable)		| &#8594;	| r151026, r151028 (stable), r151030 (LTS)
| r151022 (LTS)			| &#8594;	| r151024, r151026, r151028 (stable), r151030 (LTS)
| r151022 (OmniTI version)	| &#8594;	| r151022 (LTS), r151024 (stable) [(See note below)](#installing-the-omnios-ca-certificate)

## Performing the Upgrade

> The upgrade process creates a clone of the current boot environment in order
  to upgrade it. Any changes made to the current boot environment after the
  update is started will be lost once you reboot into the new one. This
  includes changes to log files so you may wish to disable services that
  produce data or log entries that you don't want to lose before starting.

* Make sure the global zone can reach the network.

* Create a backup boot environment for safety:
  ```terminal
  # beadm create <appropriate-backup-name>
  ```

* Change the publisher in the global zone and all linked zones
  (e.g. _lipkg_ and _sparse_ branded zones).
  For example, going to _{{site.omnios_stable}}_:
  ```terminal
  # pkg set-publisher -r -O https://pkg.omnios.org/{{site.omnios_stable}}/core omnios
  # pkg set-publisher -r -O https://pkg.omnios.org/{{site.omnios_stable}}/extra extra.omnios
  ```

* If you have any _ipkg_ branded zones, detach them following the instructions
  below.

* Perform the update, optionally specifying the new boot-environment name:
  ```terminal
  # pkg update -f -r --be-name={{site.omnios_stable}}
  ```
  This will create a new BE and install the new packages into it. When this
  is complete, reboot your system. The new BE will now be the default
  option in loader.

* Reboot
  ```terminal
  # init 6
  ```

* If applicable, re-attach any _ipkg_ zones:
  ```terminal
  # zoneadm -z <zonename> attach -u
  ```

### _ipkg_-branded zones **only** - detach procedure

For _ipkg_ branded zones only, it is necessary to shut down and detach prior
to upgrading:
  ```terminal
  # zoneadm -z <zonename> shutdown
  ... use the following command to check when the zone has shut down ...
  # zoneadm -z <zonename> list -v
  # zoneadm -z <zonename> detach
  ```
  It is also a good idea to take a ZFS snapshot of the zone root in
  case it's needed for rollback (such as if there are issues with the zone
  upgrade.)
  ```terminal
  # zfs snapshot -r /path/to/zone@<old-release>
  ```

### Troubleshooting

In case a boot environment (BE) is not updating to the latest release, try to enable an older BE (in the example below `omnios-r151044`) and reboot. Then, update the BE.
Make sure to use a new BE for the update.

For example:

```terminal
# beadm activate omnios-r151044
# init 6
# pkg update -f -r --be-name={{site.omnios_stable}}
```

## Installing the OmniOS CA Certificate

**If upgrading from OmniTI OmniOS** first install the OmniOS CA certificate:

```
# wget -P /etc/ssl/pkg https://downloads.omnios.org/ssl/omniosce-ca.cert.pem
# openssl x509 -fingerprint -in /etc/ssl/pkg/omniosce-ca.cert.pem -noout
SHA1 Fingerprint=8D:CD:F9:D0:76:CD:AF:C1:62:AF:89:51:AF:8A:0E:35:24:4C:66:6D
```


