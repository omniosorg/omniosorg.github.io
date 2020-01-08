---
title: Serial Console over SSH
category: setup
order: 21
show_in_sidebar: true
---

# Setting up a serial console

Many modern motherboards support remote console access. Intel calls Baseboard Management Controller. Apart from the friendly webinterface BMC also offers a facility called SOL SSH. With this
it is possible to access the first serial port (ttya/com1) over ssh. When you configure it you can access BIOS settings and other boot time things like boot media selection over ssh which is quite nice in it self. But even better, you can also configure OmniOS to provide access to a serial console over this path. Which is a great recovery option. Here is how to set this up.

The following examples are screenshots from an Intel S2600ST Motherboard.

## Configuring the BMC

Enable SSH SOL

![BMC SSH SOL Activation](../assets/images/sc-bmc1.png)

Configure the SSH SOL Port

![BMC SSH SOL Port](../assets/images/sc-bmc2.png)

## BIOS Settings

Enable the Serial Port

![Enable the Serial Port](../assets/images/sc-bios1.png)

Enable Console Redirection

![Enable the Serial Port](../assets/images/sc-bios2.png)

## Setup the Serial Console in OmniOS

Setup the ttya port

```bash
sttydefs -r ttya
sttydefs -a ttya -i '115200 hupcl opost onlcr ofill' -f '115200'
```

Configure a new console-login instance

```bash
svccfg -s svc:/system/console-login delete -f ttya

svccfg -f - <<EOF
select svc:/system/console-login
add ttya
select svc:/system/console-login:ttya
addpg ttymon application
setprop ttymon/device = astring: /dev/term/a
setprop ttymon/terminal_type = astring: xterm
setprop ttymon/label = astring: ttya
setprop ttymon/modules = astring: ldterm,ttcompat
setprop ttymon/nohangup = boolean: true
setprop ttymon/prompt = astring: "`uname -n` ttya login:"
addpg general framework
EOF
```

and enable the new console login

```bash
scvadm enable svc:/system/console-login:ttya
```
Allow root logins on all consoles

```bash
perl -i -p 's/\s*(CONSOLE.+)/# $1/' /etc/default/login
```

## Get the Loader to use the Serial Console

First setup the loader to also talk over the serial port

```bash
cat >/boot/conf.d/serial <<EOF
boot_multicons="YES"
boot_serial="YES"
comconsole_speed="115200"
osconsole="ttya,text"
console="ttya,text"
ttya-mode="115200,8,n,1,-"
EOF
```

Finally update the boot archive and reboot

```bash
bootadm update-archive
reboot
```

## Help making this better

If you have figured out how to make the SOL SSH console work on another
motherboard, please [provide a PR](https://github.com/omniosorg/omniosorg.github.io/edit/master/_docs/setup/serial_console.md).