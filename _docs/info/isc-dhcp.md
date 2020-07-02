---
title: ISC DHCP
layout: page
category: info
show_in_sidebar: true
---

# Dynamic Host Configuration Protocol (DHCP)
#### Acknowledgement

This document has been adapted from the [FreeBSD Handbook](https://www.freebsd.org/doc/en_US.ISO8859-1/books/handbook/) for use with OmniOS.

1. [Installing and Configuring the ISC DHCP Server](#installing-and-configuring-the-isc-dhcp-server)
2. [ISC DHCP SMF Configuration](#isc-dhcp-smf-configuration)
3. [Start the ISC DHCP Server](#start-the-isc-dhcp-server)
4. [Administration of the ISC DHCP Server](#administration-of-the-isc-dhcp-server)


The Dynamic Host Configuration Protocol (DHCP) allows a system to connect to a network in order to be assigned the necessary addressing information for communication on that network. The Internet Systems Consortium Dynamic Host Configuration Protocol (ISC DHCP) server is available in the OmniOS Extra IPS Repository. The DHCP protocol is fully described in RFC 2131. Informational resources are also available at isc.org/downloads/dhcp/.

This section describes how to install and configure the ISC DHCP server.

## Installing and Configuring the ISC DHCP Server

This section demonstrates how to configure an OmniOS system to act as a DHCP server using the ISC DHCP server.This implementation and its documentation can be installed using the following command:

```
pkg install isc-dhcp
```

The configuration file `/etc/dhcpd.conf` needs to be created and is comprised of declarations for subnets and hosts which define the information that is provided to DHCP clients. For example, these lines configure the following:

```none
option domain-name "example.org";                                      #[1]
option domain-name-servers ns1.example.org;                            #[2]
option subnet-mask 255.255.255.0;                                      #[3] 
default-lease-time 600;                                                #[4]
max-lease-time 72400;                                                  #[5]   
ddns-update-style none;                                                #[6]
subnet 10.254.239.0 netmask 255.255.255.224 {                           
range 10.254.239.10 10.254.239.20;                                     #[7]
option routers rtr-239-0-1.example.org, rtr-239-0-2.example.org;       #[8]
}
host fantasia {
hardware ethernet 08:00:07:26:c0:a5;                                   #[9]
fixed-address fantasia.fugue.com;                                      #[10] 
}
```

1. This option specifies the default search domain that will be provided to clients. Refer to **resolv.conf(4)** for more information.

2. This option specifies a comma separated list of DNS servers that the client should use. They can be listed by their Fully Qualified Domain Names (FQDN), as seen in the example, or by their IP addresses.
 
3. The subnet mask that will be provided to clients.

4. The default lease expiry time in seconds. A client can be configured to override this value.

5. The maximum allowed length of time, in seconds, for a lease. Should a client request a longer lease, a lease will still be issued, but it will only be valid for max-lease-time.

6. The default of none disables dynamic DNS updates. Changing this to interim configures the DHCP server to update a DNS server whenever it hands out a lease so that the DNS server knows which IP addresses are associated with which computers in the network. Do not change the default setting unless the DNS server has been configured to support dynamic DNS.

7. This line creates a pool of available IP addresses which are reserved for allocation to DHCP clients. The range of addresses must be valid for the network or subnet specified in the previous line.

8. Declares the default gateway that is valid for the network or subnet specified before the opening { bracket. 

9. Specifies the hardware MAC address of a client so that the DHCP server can recognize the client when it makes a request.

10. Specifies that this host should always be given the same IP address. Using the hostname is correct, since the DHCP server will resolve the hostname before returning the lease information.

This configuration file supports many more options. Refer to **dhcpd.conf(5)**, installed with the server, for details and examples.

## ISC DHCP SMF Configuration

Further configuration of the ISC DHCP server can be made by configuring the SMF manifest. By default the ISC DHCP server will listen on all interfaces, therefore in this section we will configure the server to listen only on specific interfaces.

#### Listen on a single interface

To set the ISC DHCP server to only listen on a single interface, for example `e1000g0`, configure the ISC DHCP SMF as follows:

```terminal
# svccfg -s dhcp:ipv4 setprop config/listen_ifnames = e1000g0
# svccfg -s dhcp:ipv4 refresh
```

#### Listen on multiple interfaces

To set the ISC DHCP server to listen on multiple interfaces, for example `e1000g[0|1|2|3]`, configure the ISC DHCP SMF as follows: 

```terminal
# svccfg -s dhcp:ipv4 setprop config/listen_ifnames = \(\"e1000g0\"\"e1000g1\"\"e1000g2\"\"e1000g3\"\)
# svccfg -s dhcp:ipv4 refresh
```

#### Verify SMF Configuration

Verification of changes can be made as follows:

```terminal
# svccfg -s dhcp:ipv4 listprop config/listen_ifnames
config/listen_ifnames  astring  "e1000g0"
```

## Start the ISC DHCP Server

Once the configuration of the ISC DHCP server is complete, enable the DHCP server as follows:

```none
# svcadm enable dhcp:ipv4
```

## Administration of the ISC DHCP Server

Any future changes to the configuration of the server will require the dhcpd service to be restared via `svcadm`.

The DHCP server uses the following files. Note that the manual pages are installed with the server software.

* /etc/dhcpd.conf
 
The server configuration file needs to contain all the information that should be provided to clients, along with information regarding the operation of the server. This configuration file is described in **dhcpd.conf(5)**.

* /var/db/dhcpd.leases

The DHCP server keeps a database of leases it has issued in this file, which is written as a log. Refer to **dhcpd.leases(5)**, which gives a slightly longer description.

If you experience an error `dhcpd: Can't create new lease file: Permission denied`, simply renew the `dhcpd.leases` file as follows:

```terminal
# mv  /var/db/dhcpd.leases{,.orig}
# touch  /var/db/dhcpd.leases
# chown dhcpserv:netadm /var/db/dhcpd.leases
# svcadm restart dhcp:ipv4
```

