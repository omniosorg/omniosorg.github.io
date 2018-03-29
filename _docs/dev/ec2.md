---
title: Creating an EC2 AMI
category: dev
show_in_sidebar: true
---

# Creating an EC2 Amazon Machine Image (AMI)

The first step is to install an OmniOS image onto a new virtual 8GiB hard disk
along with a modified ZFS-enabled version of grub.

The [kayak](https://github.com/omniosorg/kayak) repository contains a
script do do this for you.

Install OmniOS into a KVM (or use an existing OmniOS build VM) and then
create an additional 8GiB hard disk and attach it to the VM.

Run the following commands, substituting the version for the one you
need:

```
% pkg install git
% git clone https://github.com/omniosorg/kayak.git
% cd kayak
% wget https://downloads.omniosce.org/media/stable/omniosce-r151024.zfs.bz2
% pfexec ./build/build_xen
```
> NB: sudo can be used for privilege escalation in place of pexec if you have
> it configured.

You will be prompted to confirm that you wish to build the image on the
8GiB disk. All data on that disk will be lost.

At the end of the process information about the new pool will be printed
and one of the attributes will be the physical path which will look something
like this:

```
phys_path: '/pci@0,0/pci1af4,2@5/blkdev@0,0:a'
```

# Correcting the phys_path label

This phys_path value from the label is used during initial pool import and
if it does not match the real physical device path then the import will fail.
When booted in EC2 environment, the first disk will be represented by
`/xpvd/xdf@51712` device so the label needs correcting.

In order to do this, the pool needs to be imported into an
environment similar to EC2 and for this we will use an instance of Debian+Xen
running inside KVM on OmniOS.

> Yes, this is convoluted. We are working on a utility to make the
> [required label changes directly](https://github.com/omniosorg/kayak/blob/master/src/zpool_patch.c).
> If you can help with that, please get in touch!

Once Debian is installed, add the xen hypervisor software and reboot into
the Xen kernel:

```
root@xen:/# apt install xen-hypervisor-4.8-amd64
root@xen:/# shutdown -r now
```

Attach the 8GiB virtual disk that was created in the previous step. This should
appear as /dev/vdb.

```
root@xen:/# fdisk -l /dev/vdb
Disk /dev/vdb: 8 GiB, 8589934592 bytes, 16777216 sectors
...
Device     Boot Start      End  Sectors Size Id Type
/dev/vdb1        2048    34815    32768  16M  6 FAT16
/dev/vdb2       34816 16777215 16742400   8G bf Solaris
```

Grab a copy of the OmniOS installer, pv-grub and create a Xen config file:

```
root@xen:/# wget https://downloads.omniosce.org/media/r151024/omniosce-r151024.iso
root@xen:/# wget https://downloads.omniosce.org/media/misc/pv-grub.gz.d3950d8
root@xen:/# cat omnios.xen
memory = 2048 
name = 'omnios' 
vcpus = 4 
disk = [ 'file:/dev/vdb,51712,w',
         'file:/omniosce-r151024.iso,2064,r' ] 
kernel = "/pv-grub.gz.d3950d8" 
extra = "(hd0)/boot/grub/menu.lst"
```

Start Xen and you should see a grub prompt:

```
root@xen:/# xl create omnios.xen -c

    GNU GRUB  version 0.97  (1048576K lower / 0K upper memory)

       [ Minimal BASH-like line editing is supported.   For
         the   first   word,  TAB  lists  possible  command
         completions.  Anywhere else TAB lists the possible
         completions of a device/filename. ]

grubdom>
```

At the grub prompt, enter the following four commands:

```
root (hd0)
kernel$ /platform/i86pc/kernel/$ISADIR/unix
module$ /platform/i86pc/$ISADIR/boot_archive
boot
```

You will enter the OmniOS installer and, after selecting a keyboard layout,
choose the option to drop to a shell.

Import the root pool `syspool`, exit the shell and then select the `Halt`
option from the menu.

```
bash-4.4# zpool import -R /a -f syspool
bash-4.4# exit
```

If you were now to re-attach the disk to an OmniOS system and query the
pool `phys_path` property, you would see an EC2 PV compatible value:

```
# zdb -e -C syspool | grep phys_path
                phys_path: '/xpvd/xdf@51712:a'
```

# Convert the raw disk image to VMDK Stream

```
wget -O VMDK-stream-converter-0.2.tar.gz \
    https://github.com/imcleod/VMDK-stream-converter/archive/0.2.tar.gz
gtar zxvf VMDK-stream-converter-0.2.tar.gz
./VMDK-stream-converter-0.2/VMDKstream.py \
    /dev/zvol/rdsk/data/omniosce/hdd-ec2 omniosr24.vmdk
```

# Uploading the image to AWS

```
export AWS_ACCESS_KEY=<access key>
export AWS_SECRET_KEY=<secret key>
export EC2_URL=https://ec2.eu-central-1.amazonaws.com
```

```
# ec2-import-volume -o $AWS_ACCESS_KEY -w $AWS_SECRET_KEY \
    -b <S3 bucket> -z eu-central-1a -f vmdk omniosr24.vmdk

# ec2dct
TaskType        IMPORTVOLUME    TaskId  import-vol-ffmkcg21     ExpirationTime  2017-11-13T22:25:34Z    Status  completed
DISKIMAGE       DiskImageFormat RAW     DiskImageSize   8589934592      VolumeId        vol-0fe060b6203e94aad   VolumeSize      8       AvailabilityZone        eu-west-2a      ApproximateBytesConverted       8589934592
```

# Creating the AMI

Once the image conversion has completed (as shown by the output of `ec2dct`,
proceed to create the AMI.

```
# ec2addsnap vol-0fe060b6203e94aad
SNAPSHOT      snap-0e45330d16d7809f3  vol-0fe060b6203e94aad   pending 2017-11-07T17:52:57+0000                239848717670    8               Not Encrypted

# ec2reg -s snap-0ed358e4e225b4df6 \
    -n "OmniOSce r151024 stable YYYYMMDD" \
    -d "OmniOSce illumos distribution" \
    -a x86_64 --root-device-name /dev/xvda \
    --virtualization-type hvm
IMAGE   ami-cc56d7a3

# ec2-describe-images ami-cc56d7a3
IMAGE   ami-cc56d7a3    313551840421/OmniOSce r151024 stable 20171113   313551840421    available       public          x86_64  machine                         ebs     /dev/xvda       hvm     xen     2017-11-13T20:09:40.000Z
BLOCKDEVICEMAPPING      EBS     /dev/xvda               snap-0e45330d16d7809f3  8       true    standard                Not Encrypted
TAG     image   ami-cc56d7a3    Name    omniosce
```

