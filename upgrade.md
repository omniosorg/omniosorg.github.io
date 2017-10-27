---
layout: page
title: Upgrading OmniOS
show_in_menu: false
---

# Upgrading to a New OmniOS Stable Release

The following table shows the supported upgrade paths between OmniOS versions.
Upgrading from versions not listed below has not been tested.

{:.bordered}
| From Release			| 	 	| To Release(s)
| ------------			|		| -------------
| r151022 (OmniTI version)	| &#8594;	| r151022 (LTS), r151024 (Stable)
| r151022 (LTS)			| &#8594;	| r151024 (Stable)
| r151023 (bloody)		| &#8594;	| r151024 (Stable)

## Updating Installed Packages

Prior to upgrading, ensure that you have the latest updates for the
current release installed on the system. Check that `pkg list -u` produces
no output and update if necessary before proceeding.

## Performing the Upgrade

> The upgrade process creates a clone of the current boot environment in order
  to upgrade it. Any changes made to the current boot environment after the
  update is started will be lost once you reboot into the new one. This
  includes changes to log files so you may wish to disable services that
  produce log entries you don't want to lose before starting.

* Make sure the global zone can reach the network.
* Create a backup boot environment for safety:
  ```
  # beadm create <appropriate-backup-name>
  ```
* Change the publisher in the global zone.
  For example, going from r151022 to r151024:
  ```
  # pkg set-publisher \
    -G https://pkg.omniosce.org/r151022/core \
    -g https://pkg.omniosce.org/r151024/core \
    omnios
  ```
* Change the publisher in each native `lipkg` branded zone:
  ```
  # pkg -R /path/to/zone/root set-publisher 
    -G https://pkg.omniosce.org/r151022/core \
    -g https://pkg.omniosce.org/r151024/core \
    omnios
  ```
* Shut down and detach any `ipkg` branded zones:
  ```
  # zoneadm -z <zonename> shutdown
  ... use the following command to check when the zone has shut down ...
  # zoneadm list -z <zonename> -v
  # zoneadm -z <zonename> detach
  ```
  It is also a good idea to take a ZFS snapshot of the zone root in
  case it's needed for rollback (such as if there are issues with the zone
  upgrade.) 
  ```
  # zfs snapshot -r /path/to/zone@<old-release>
  ```
* Perform the update, optionally specifying the new boot-environment name:
  ```
  # pkg update --be-name r151024
  ```
  This will create a new BE and install the new packages into it. When this
  is complete, reboot your system. The new BE will now be the default
  option in loader.
* Reboot
  ```
  # init 6
  ```
* Re-attach any `ipkg` zones:
  ```
  # zoneadm -z <zonename> attach -u
  ```


