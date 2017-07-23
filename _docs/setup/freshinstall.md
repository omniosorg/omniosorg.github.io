---
title: Installation Walk Through
category: setup
---

# A Fresh Install Walk Through

The following screen shots step through a fresh install of the
OmniOSce operating system on a blank hard drive. To perform this
install, one may use a bootable CD, USB drive, or PXE.  Images
for these formats are available at
[downloads.omniosce.org](https://downloads.omniosce.org/media/stable/).

## Booting from the install image

Upon booting from CD, USB or PXE, the OmniOSce installer
displays several boot options.  To install, one may let it
time out and the install will continue.

![Splash screen](../assets/images/install_48_48.png?raw=true "Splash screen")

Enter the number corresponding to the keyboard layout of your
choice, and hit <kbd>enter</kbd>.

![Choose keyboard layout](../assets/images/install_50_14.png?raw=true "Choose keyboard layout")

To continue the install, choose number one (1), and hit <kbd>enter</kbd>.

![Install, shell or reboot](../assets/images/install_50_24.png?raw=true "Install, shell or reboot")

Select a disk that will hold the operating system, from a table
of disks.

Enter either the drive number or drive label.  The drive number
is shown in the left hand column, and the label in the column
"DISK".  If several drives are selected, they are mirrored for
redundancy.

After selecting the disk(s), select zero (0) to continue the
install.

![Choose disk](../assets/images/install_50_37.png?raw=true "Choose disk")

Choose a name for the root pool, or simply hit <kbd>enter</kbd>
to accept the default name, rpool.

![Name the root pool](../assets/images/install_51_21.png?raw=true "Name the root pool")

Enter a hostname for the installed system, and hit <kbd>enter</kbd>

![Set hostname](../assets/images/install_51_29.png?raw=true "Set hostname")

Choose a timezone, and hit <kbd>enter</kbd>

![Set timezone](../assets/images/install_51_38.png?raw=true "Set timezone")

The installer will offer to confirm the current time in the chosen time zone.
If the displayed time is correct, type <kbd>1 enter</kbd>

![Verify timezone](../assets/images/install_52_37.png?raw=true "Verify timezone")

The installer shows the progress of writing the operating system to the hard drive.

![Install progress](../assets/images/install_52_55.png?raw=true "Install progress")

When finished writing the OS to the hard drive, the installer
displays status information. Type <kbd>enter</kbd> to proceed.

![Install complete](../assets/images/install_55_20.png?raw=true "Install complete")

To continue, and boot the installed OS, type <kbd>5 enter</kbd>.

![Reboot](../assets/images/install_55_36.png?raw=true "Reboot")

Progress loading kernel is shown briefly, before the splash screen.

![Reboot progress](../assets/images/install_57_06.png?raw=true "Reboot progress")

The splash screen loading from the hard drive looks identical to
that from the CD or USB drive. One can let it time out to
proceed to boot the operating system.

![Splash screen](../assets/images/install_57_08.png?raw=true "Splash screen")

Boot progress is displayed as a rolling count of the
various components being loaded.

![Boot Progress](../assets/images/install_57_34.png?raw=true "Boot Progress")

Log messages can make it difficult to see the login prompt.

Simply hit <kbd>enter</kbd> to get another login prompt.

![Boot complete](../assets/images/install_58_31.png?raw=true "Boot complete")

The password for user "root" is blank.   (note: ssh login by root
using a password is disabled.)

![Login prompt](../assets/images/install_58_47.png?raw=true "Login prompt")

Install is complete, and root is logged in.

![Login as root](../assets/images/install_59_11.png?raw=true "Login as root")
