---
title: Switch to OmniOSce
category: setup
order: 10
show_in_sidebar: true
---

# Switching to OmniOSce

To transition an existing system that is running OmniOS r151022 to
the OmniOS Community Edition, install the OmniOSce CA certificate,
change the pkg publisher, and run pkg update, as follows.

Get a copy of the OmniOSce CA certificate.

```
# /usr/bin/wget -P /etc/ssl/pkg \
    https://downloads.omniosce.org/ssl/omniosce-ca.cert.pem
```

Check the certificate fingerprint.

```
# /usr/bin/openssl x509 -fingerprint \
    -in /etc/ssl/pkg/omniosce-ca.cert.pem -noout
```

The fingerprint should match this:

`8D:CD:F9:D0:76:CD:AF:C1:62:AF:89:51:AF:8A:0E:35:24:4C:66:6D`

Change the publisher to the OmniOSce repo

```
# /usr/bin/pkg set-publisher -P \
   -G https://pkg.omniti.com/omnios/r151022/ \
   -g https://pkg.omniosce.org/r151022/core/ omnios
```

If you have zones, change the publisher of each native zone.  To get a list of all your zones, run `zoneadm list -cv`. For each `<zone_root>`, add the zone's `/root` to the PATH given in the list.


```
# /usr/bin/pkg -R <zone_root> set-publisher -P \
   -G https://pkg.omniti.com/omnios/r151022/ \
   -g https://pkg.omniosce.org/r151022/core/ omnios
```

Install the OmniOSce CA certificate.

```
# /usr/bin/pkg update -rv web/ca-bundle
```

The downloaded OmniOSce CA certificate can be removed after it is installed.

```
# rm /etc/ssl/pkg/omniosce-ca.cert.pem
```

Finally, update as usual.

```
# /usr/bin/pkg update -rv
```
