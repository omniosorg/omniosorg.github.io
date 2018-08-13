---
layout: page
title: Upgrading OmniOS
show_in_menu: false
show_in_sidebar: true
---

# Upgrading to a New OmniOS Release

The following table shows the supported upgrade paths between OmniOS versions.
_Upgrading from versions not listed below has not been tested and is
not supported._

{:.bordered .responsive-table}
| From Release			| 	 	| To Release(s)
| ------------			|		| -------------
| r151022 (OmniTI version)	| &#8594;	| r151022 (LTS), r151024 (stable)
| r151022 (LTS)			| &#8594;	| r151024 (stable), r151026 (stable)
| r151024 (stable)		| &#8594;	| r151026 (stable)

## Installing the OmniOSce CA Certificate

**If upgrading from OmniTI OmniOS** first install the OmniOSce CA certificate:

```
# wget -P /etc/ssl/pkg https://downloads.omniosce.org/ssl/omniosce-ca.cert.pem
# openssl x509 -fingerprint -in /etc/ssl/pkg/omniosce-ca.cert.pem -noout
SHA1 Fingerprint=8D:CD:F9:D0:76:CD:AF:C1:62:AF:89:51:AF:8A:0E:35:24:4C:66:6D
```

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

* Change the publisher in the global zone and in _lipkg_ branded zones.
  For example, going to _{{site.omnios_stable}}_:
  ```terminal
  # pkg set-publisher -r -O https://pkg.omniosce.org/{{site.omnios_stable}}/core omnios
  ```

* Shut down and detach any _ipkg_ branded zones:
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

* Re-attach any _ipkg_ zones:
  ```terminal
  # zoneadm -z <zonename> attach -u
  ```

