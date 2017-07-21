---
layout: page
title: Setup
show_in_menu: true
permalink: /setup/
---

## New System

To setup OmniOS on a new system, get the ISO file from
[downloads.omniosce.org](https://downloads.omniosce.org/media/stable/) and
boot with it. Follow the instructions on screen.

## Moving form OmniOS to OmniOSce

If you already have an OmniOS setup, and would like to move to OmniOS
Community Edition, you basically have to switch the publisher in your pkg
settings. Since OmniOS packages are signed and signatures get checked, you
first habe to add the OmniOSce CA certificate to your system. Here is how:

Get a copy of the new certificate 

```
# /usr/bin/wget -P /etc/ssl/pkg \
    https://downloads.omniosce.org/ssl/omniosce-ca.cert.pem 
```

Check the certificate fingerprint 

```
# /usr/bin/openssl x509 -fingerprint \
    -in /etc/ssl/pkg/omniosce-ca.cert.pem -noout 
```

`8D:CD:F9:D0:76:CD:AF:C1:62:AF:89:51:AF:8A:0E:35:24:4C:66:6D`

Change the publisher to our new repo 

```
# /usr/bin/pkg set-publisher -P \
   -G https://pkg.omniti.com/omnios/r151022/ \
   -g https://pkg.omniosce.org/r151022/core/ omnios 
```

For each native zone (if you have any), run 

```
# /usr/bin/pkg -R <zone_root> set-publisher -P \
   -G https://pkg.omniti.com/omnios/r151022/ \
   -g https://pkg.omniosce.org/r151022/core/ omnios 
```

(get a list of all your zones by running `zoneadm list -cv` for the `<zone_root>`, add `/root` to the PATH given in the list.) 


Install the new ca-bundle containing our new CA 

```
# /usr/bin/pkg update -rv web/ca-bundle 
```

Remove the CA file imported by hand 

```
# rm /etc/ssl/pkg/omniosce-ca.cert.pem 
```

Finally update as usual 

```
# /usr/bin/pkg update -rv 
```



