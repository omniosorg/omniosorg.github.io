---
title: Installation Walk-through
category: setup
order: 20
show_in_sidebar: true
---

# A Fresh Installation Walk-through

The following screenshots step through a fresh installation of the
OmniOS operating system on a blank hard drive using the standard
dialogue-based installer. For the old plain text installer, please
see our [text-installer walk-through page](/setup/freshinstall_txt.html).

To perform this installation, one may use a bootable CD, USB drive,
or [PXE](/setup/pxe.html). Images for these formats are available on
[our downloads page](/download.html).

> The information below is for an installation of r151026. Installation of
> the LTS r151022 differs in some regards; in particular only the text
> installer is available and there is no post-installation configuration menu.

## Virtual machine notes

OmniOS works well within a virtual machine environment such as Virtualbox,
VMware, Xen, Hyper-V, KVM or Bhyve. The following configuration is
recommended for such deployments.

{:.bordered .responsive-table}
| Architecture | 64-bit (x86-64) |
| Memory Size | 1GiB (minimum) |
| Hard Disk | 8GiB (minimum) |

## Booting from the image

Upon booting from CD, USB or PXE, the OmniOSce installer
displays several boot options. To install, one may press <kbd>return</kbd>
or let it time out and the installation will continue.

![Loader screen](../assets/images/install/r26/loader.png?raw=true "Loader screen")

Once the installer is booted, you can choose to use the old
[text-based installer](/setup/freshinstall_txt.html) by pressing `T` within
10 seconds. If you press <kbd>return</kbd> or the timeout expires, the
default dialogue-based installer will be started.

![Select installer](../assets/images/install/r26/text.png?raw=true "Select installer")

Select the desired keyboard layout from the displayed menu. Arrow keys can
be used to move up and down, or the first letter of the desired selection will
jump to the the entries starting with that letter; repeated presses will cycle
within layouts with the same initial letter. Once chosen, press
<kbd>return</kbd> to continue.

![Choose keyboard layout](../assets/images/install/r26/keyboard.png?raw=true "Choose keyboard layout")

After selecting the keyboard layout, the top-level installation menu will be
shown. This provides a number of options but for a simple installation onto
a clean hard disk select the highlighted option
<kbd>Find disks, create rpool, and install OmniOSce</kbd> and press
<kbd>return</kbd>.

![Install, shell or reboot](../assets/images/install/r26/menu.png?raw=true "Install, shell or reboot")

The next screen will display a list of detected hard disks from the system.
Select the disks that should be used for the installation by moving up and
down with the arrow keys and pressing the space-bar to toggle the checkbox
against each item. Once finished, press <kbd>return</kbd> to continue.

> If several drives are selected, you will be prompted for for the desired
> RAID level on the next screen.

![Choose disk](../assets/images/install/r26/disks.png?raw=true "Choose disk")

Next, if more than one disk has been selected, choose the desired RAID level
for the root pool. The options displayed here will depend on the number of
disks selected in the previous step.

![Select RAID level](../assets/images/install/r26/raid.png?raw=true "Select RAID level")

Enter a hostname for the new system, and press <kbd>return</kbd>.

![Set hostname](../assets/images/install/r26/hostname.png?raw=true "Set hostname")

To select a time-zone, first choose a continent or ocean from the displayed
menu then follow through to select a region and finally the desired timezone.
If you wish to enter a POSIX time-zone string directly select the last option
displayed option (<kbd>none</kbd>) or if you want to use UTC then choose that
option directly.

![Set timezone](../assets/images/install/r26/timezone.png?raw=true "Set timezone")

The installer now begins to install the operating system image onto the hard
drive and shows progress to the screen.

![Installation progress](../assets/images/install/r26/progress.png?raw=true "Installation progress")

When finished writing to the hard drive, the installer
displays status information. Press <kbd>return</kbd> to proceed.

![Installation complete](../assets/images/install/r26/complete.png?raw=true "Installation complete")

The post-installation menu provides an option to configure some basic system
parameters before first boot, as well as options to reboot or halt the system.

![Post-installation](../assets/images/install/r26/postmenu.png?raw=true "Post-installation")

Selecting the first option shows a menu through which some initial system
parameters such as IP address and passwords can be configured.

![Post-config](../assets/images/install/r26/postconfig.png?raw=true "Post-config")

When finished, the system can be rebooted via the menu.

The splash screen loading from the hard drive looks almost the same
as that from the CD or USB drive. One can press <kbd>return</kbd> or let it
time out to boot the operating system.

![Splash screen](../assets/images/install/r26/loader_hdd.png?raw=true "Splash screen")

On first boot, the service manifest database is built and a rolling count
is shown. Subsequent boots will be much faster.

![Boot Progress](../assets/images/install/r26/smf.png?raw=true "Boot Progress")


Unless configured explicitly in the post-installation configuration menu,
the password for user `root` will be blank (just press <kbd>return</kbd>).
Installation is complete, and root is logged in.

![Login as root](../assets/images/install/r26/loggedin.png?raw=true "Login as root")

Refer to the [getting started guide](/info/getstarted.html) for next steps.

