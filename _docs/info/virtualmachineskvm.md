---
title: Virtual Machines with KVM
category: info
show_in_sidebar: true
---

# Virtual Machines with KVM

### kvmadm utility

The recommended way to configure and maintain KVM instances is to use the
[kvmadm utility](http://www.kvmadm.org). This is available in the
OmniOS extra repository. Substitute `{{site.omnios_stable}}` below with
the OmniOS release you are using

```
# pkg set-publisher -g https://pkg.omniosce.org/{{site.omnios_stable}}/extra extra.omnios
# pkg install kvmadm
```

and refer to the [man page](https://github.com/hadfl/kvmadm/blob/master/doc/kvmadm.pod) for instructions on how to use it.

`kvmadm` also supports running a KVM instance within a non-global zone to
provide an extra layer of isolation.

If you do not wish to use this utility, then the rest of the page contains
instructions for setting up a KVM instance by hand.

<hr>

## Starting a VM

Each KVM virtual machine requires a dedicated virtual network
interface (VNIC), hard disk drive (HDD) - a ZFS Volume is perfect
and a VNC TCP port to allow console access.

### Create a vnic

Find the link device on which to build the virtual NIC. This can be a
physical network interface or a virtual switch (etherstub).

```
# dladm show-link
LINK        CLASS     MTU    STATE    BRIDGE     OVER
igb0        phys      1500   up       --         --
igb1        phys      1500   down     --         --
switch10    etherstub 9000   up       --         --
```

Create a virtual network interface on top of the selected link. Here, the
new VNIC is named `vnic0` and it is based on the physical interface `igb0`:

```
# dladm create-vnic -l igb0 vnic0
# dladm show-vnic
LINK         OVER         SPEED  MACADDRESS        MACADDRTYPE         VID
vnic0        igb0         100    2:8:20:38:a5:d6   random              0
```

### Create a ZFS volume for the virtual hard drive

Prepare a volume for the VM:

```
# zfs create -V <size> <pool>/<zvol-name>
```

`<size>` should be an appropriately-sized virtual disk. E.g. 32G.

`<pool>` and `<zvol-name>` represent a pool, and a name of a ZFS Volume. The
`-V` flag indicates you're creating a ZFS Volume which will appear as
`/dev/zvol/rdsk/<pool>/<zvol-name>`.

### Download an ISO

```
# mkdir -p /export/vm
# cd /export/vm
# wget ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/9.1/FreeBSD-9.1-RC2-amd64-disc1.iso
```


### Start the Virtual Machine

You can use the following script to start the VM:

```
#!/usr/bin/ksh

# configuration
VNIC=vnic0
# Sample zvol path.
HDD=/dev/zvol/rdsk/rpool/vm-zvol
CD=/export/iso/FreeBSD-9.1-RC2-amd64-disc1.iso
VNC=5
# Memory for the KVM instance, in Mebibytes (2^20 bytes).
MEM=1024
# Virtual CPUs for the instance
CPUS=2

mac=`dladm show-vnic -po macaddress $VNIC`

/usr/bin/qemu-system-x86_64 \
    -name "$(basename $CD)" \
    -boot cd \
    -enable-kvm \
    -nodefaults \
    -vnc :$VNC \
    -monitor telnet:localhost:%((vnc + 7000)),server,nowait,nodelay \
    -smp $CPUS \
    -m $MEM \
    -no-hpet \
    -localtime \
    -drive file=$HDD,if=virtio,index=0 \
    -drive file=$CD,media=cdrom,if=ide,index=2  \
    -net nic,vlan=0,name=net0,model=e1000,macaddr=$mac \
    -net vnic,vlan=0,name=net0,ifname=$VNIC,macaddr=$mac \
    -vga std \
    -daemonize

if [ $? -gt 0 ]; then
    echo "Failed to start VM"
fi

```

> This is based on an original script from
> [John Grafton's blog](http://www.graymatterboundaries.com/?p=158)

#### Next steps

When `./start-vm.sh` completes, use a VNC client to connect to the
chosen VNC display and continue to install the selected operating system
into the VM.

Using a script to start VM guests also makes it easy to put them under
SMF control. Here's a sample manifest (replace `@@VM_NAME@@` with your
VM name):

```xml
<?xml version='1.0'?>
<!DOCTYPE service_bundle SYSTEM '/usr/share/lib/xml/dtd/service_bundle.dtd.1'>
<service_bundle type='manifest' name='export'>
    <service name='kvm/@@VM_NAME@@' type='service' version='0'>
        <create_default_instance enabled='true'/>
        <single_instance/>
        <dependency name='network' grouping='require_all' restart_on='none' type='service'>
            <service_fmri value='svc:/milestone/network:default' />
        </dependency>
        <dependency name='filesystem' grouping='require_all' restart_on='none' type='service'>
            <service_fmri value='svc:/system/filesystem/local:default' />
        </dependency>
        <exec_method name='start' type='method' exec='/path/to/start-script' timeout_seconds='60'/>
        <exec_method name='stop' type='method' exec=':kill' timeout_seconds='60'/>
        <stability value='Unstable'/>
        <template>
            <common_name>
                <loctext xml:lang='C'>KVM-@@VM_NAME@@</loctext>
            </common_name>
        </template>
    </service>
</service_bundle>
```

## Troubleshooting

### /usr/bin/qemu-kvm on OmniOS

The binary is called: `/usr/bin/qemu-system-x86_64`

### /dev/kvm - no such device

First ensure kvm is loaded:

```
# modinfo |grep kvm
205 fffffffff80a5000  39ff0 264   1  kvm (kvm driver v0.1)
```

If the module is not present, load it with:

```
# add_drv kvm
```

This is a one-time setup and will persist across reboots.

## Setting up KVM in a zone.

You may run a KVM instance in a non-global zone so long as:

* The zone has its own vNIC so KVM's VNC server can run
* The KVM's vNIC is provisioned into the zone's creation by using
  zonecfg(1M)'s “add net” command
  ```
  zonecfg> add net
  zonecfg> set physical=vnic0
  zonecfg> end
  ```
* The zvol is named such that its parent dataset can be delegated
  to the zone, and that its zvol device path is provisioned into
  the zone's creation by using zonecfg(1M)'s “add device”
  command.  One can provide a number of zvols to a zone this way:
  ```
  zonecfg> add device
  zonecfg> set match="/dev/zvol/rdsk/rpool/zvol/*"
  zonecfg> end
  zonecfg> add dataset
  zonecfg> set name=rpool/zvol
  zonecfg> end
  ```

Once those resources are available to a zone, you can run the shell
script or import the SMF service per above.

