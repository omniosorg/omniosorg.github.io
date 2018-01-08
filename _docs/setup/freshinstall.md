---
title: Installation Walk-through
category: setup
order: 20
show_in_sidebar: true
---

# A Fresh Installation Walk-through

The following screenshots step through a fresh installation of the
OmniOS operating system on a blank hard drive. To perform this
installation, one may use a bootable CD, USB drive, or [PXE](/setup/pxe.html).
Images for these formats are available on [our downloads page](/download.html).

> The information below is for an installation of r151024. Installation of
> the LTS r151022 differs in some regards; in particular there is no
> post-installation configuration menu.

## Virtual machine notes

OmniOS works well within a virtual machine environment such as Virtualbox,
VMware, Xen, KVM or Bhyve. The following configuration is recommended for
such deployments.

{:.bordered .responsive-table}
| Architecture | 64-bit (x86-64) |
| Memory Size | 1GiB (minimum) |
| Hard Disk | 8GiB (minimum) |

## Booting from the image

Upon booting from CD, USB or PXE, the OmniOSce installer
displays several boot options. To install, one may press <kbd>return</kbd>
or let it time out and the installation will continue.

![Loader screen](../assets/images/install_loader.png?raw=true "Loader screen")

Enter the number corresponding to the keyboard layout of your
choice, and press <kbd>enter</kbd>.

![Choose keyboard layout](../assets/images/install_keyboard.png?raw=true "Choose keyboard layout")

After selecting the keyboard layout, the top-level installation menu will be
shown. This provides a number of options but for a simple installation onto
a clean hard disk select option one (<kbd>1</kbd>) and press <kbd>return</kbd>.

![Install, shell or reboot](../assets/images/install_menu.png?raw=true "Install, shell or reboot")

Select a disk that will hold the operating system from the displayed table
of disks. The first line on this screen shows the currently selected disks;
when you are happy with this list, enter zero (<kbd>0</kbd>) to proceed with
the installation. If several drives are selected, they are mirrored for
redundancy.

![Choose disk](../assets/images/install_disks.png?raw=true "Choose disk")

Next choose a name for the root pool. This is the name of the ZFS pool
that will be created using the previously selected disks and used for
the OmniOS installation.
The default name is `rpool` and should usually be left unchanged.
To accept the default just press <kbd>return</kbd>.

![Name the root pool](../assets/images/install_rpool.png?raw=true "Name the root pool")

Enter a hostname for the installed system, and press <kbd>return</kbd>.

![Set hostname](../assets/images/install_hostname.png?raw=true "Set hostname")

To select a time-zone, first choose a continent or ocean from the displayed
menu. If you wish to enter a POSIX time-zone string directly select option
<kbd>11</kbd>.

![Set timezone](../assets/images/install_tzcontinent.png?raw=true "Set timezone")

The installer will offer to confirm the current time in the chosen time zone.
If the displayed time is correct, type <kbd>1 enter</kbd>

![Verify timezone](../assets/images/install_tzverify.png?raw=true "Verify timezone")

The installer now begins to install the operating system image onto the hard
drive and shows progress to the screen.

![Installation progress](../assets/images/install_progress.png?raw=true "Installation progress")

When finished writing to the hard drive, the installer
displays status information. Type <kbd>enter</kbd> to proceed.

![Installation complete](../assets/images/install_complete.png?raw=true "Installation complete")

The post-installation menu provides an option to configure some basic system
parameters before first boot, as well as options to reboot or halt the system.

![Post-installation](../assets/images/install_postmenu.png?raw=true "Post-installation")

Selecting option <kbd>1</kbd> shows a menu through which some initial system
parameters such as IP address and passwords can be configured.

![Post-config](../assets/images/install_postconfig.png?raw=true "Post-config")


When finished, the system can be rebooted via the menu.

The splash screen loading from the hard drive looks almost the same
as that from the CD or USB drive. One can press <kbd>return</kbd> or let it
time out to boot the operating system.

![Splash screen](../assets/images/install_loader_hdd.png?raw=true "Splash screen")

On first boot, the service manifest database is built and a rolling count
is shown. Subsequent boots will be much faster.

![Boot Progress](../assets/images/install_smf.png?raw=true "Boot Progress")

Log messages can make it difficult to see the login prompt.

Simply hit <kbd>enter</kbd> to get another login prompt.

![Boot complete](../assets/images/install_booted.png?raw=true "Boot complete")

Unless configured explicitly in the post-installation configuration menu,
the password for user `root` will be blank (just press <kbd>return</kbd>).

![Login prompt](../assets/images/install_loginprompt.png?raw=true "Login prompt")

Installation is complete, and root is logged in.

![Login as root](../assets/images/install_loggedin.png?raw=true "Login as root")

Refer to the [getting started guide](/info/getstarted.html) for next steps.

