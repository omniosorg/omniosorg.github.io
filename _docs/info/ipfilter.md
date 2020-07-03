---
title: IP Filter
layout: page
category: info
show_in_sidebar: true
---

# IPFilter (IPF)

#### Acknowledgement

This document has been adapted from the [FreeBSD Handbook](https://www.freebsd.org/doc/en_US.ISO8859-1/books/handbook/) for use with OmniOS.

1. [Enabling IPF](#enabling-ipf)
2. [IPF Rule Syntax](#ipf-rule-syntax)
3. [IPF Example Ruleset](#ipf-example-ruleset)
4. [Configuring NAT](#configuring-nat)
5. [Viewing IPF Statistics](#viewing-ipf-statistics)
6. [IPF Logging](#ipf-logging)

IPFilter, also known as IPF, is a cross-platform, open source firewall which has been ported to several operating systems, including distributions based on the illumos project, FreeBSD, NetBSD, OpenBSD and Solaris.

IPF is a kernel-side firewall and NAT mechanism that can be controlled and monitored by userland programs.

Firewall rules can be set or deleted using `ipf`, NAT rules can be set or deleted using `ipnat`, run-time statistics for the kernel parts of IPF can be printed using `ipfstat`, and `ipmon` can be used to log IPF actions to the system log files.

IPF was originally written using a rule processing logic of “the last matching rule wins” and only used stateless rules. Since then, IPF has been enhanced to include the quick and keep state options.

The IPF FAQ is at http://www.phildev.net/ipf/index.html . A searchable archive of the IPF mailing list is available at http://marc.info/?l=ipfilter.

## Enabling IPF

IPF is included in the base OmniOS installation, therefore does not need to be installed.

### Gather information about IPF configuration files

Before starting IPF, run the following command to determine the configuration file names and locations.

```terminal
# svccfg -s ipfilter:default listprop | grep file
config/ipf6_config_file                       astring  /etc/ipf/ipf6.conf
config/ipnat_config_file                      astring  /etc/ipf/ipnat.conf
config/ippool_config_file                     astring  /etc/ipf/ippool.conf
firewall_config_default/custom_policy_file    astring  /etc/ipf/ipf.conf
firewall_config_default/custom_policy_file_6  astring  /etc/ipf/ipf6.conf
restarter/logfile                             astring  /var/svc/log/network-ipfilter:default.log
```
### Enable IP Forwarding (optional)

If IPF is required to forward IP packets, enable *IPv4 or IPv6 Forwarding*, depending on requirements.

```terminal
# svcadm enable ipv4-forwarding
# svcadm enable ipv6-forwarding
```

The program `routeadm` can verify these new changes:

```terminal
# routeadm 
              Configuration   Current              Current
                     Option   Configuration        System State
---------------------------------------------------------------
               IPv4 routing   disabled             disabled
               IPv6 routing   disabled             disabled
            IPv4 forwarding   enabled              enabled
            IPv6 forwarding   enabled              enabled

           Routing services   "route:default ripng:default"

Routing daemons:

                      STATE   FMRI
                   disabled   svc:/network/routing/ripng:default
                   disabled   svc:/network/routing/legacy-routing:ipv4
                   disabled   svc:/network/routing/legacy-routing:ipv6
                   disabled   svc:/network/routing/ndp:default
                   disabled   svc:/network/routing/rdisc:default
                   disabled   svc:/network/routing/route:default
```

### Start IPF

Then, to start IPF:

```terminal
# svcadm enable network/ipfilter
```

IPF is now running. The default `/etc/ipf/ipf.conf` file does not contain any rules. Therefore, no filtering will occur. The default `/etc/ipf/ipf.conf` file is the same as having a rule set that reads:

```none
pass in all
pass out all
```

### Making changes to the ruleset whilst IPF is active

To update the firewall rules, specify the name of the updated ruleset file using IPF. The following command can be used to replace the currently running firewall rules:

```none
# ipf -Fa -f /etc/ipf/ipf.conf
```

where `-Fa` flushes all the internal rules tables and `-f` specifies the file containing the rules to load.

This provides the ability to make changes to a custom ruleset and update the running firewall with a fresh copy of the rules without having to reboot the system. This method is convenient for testing new rules as the procedure can be executed as many times as needed.

Refer to **ipf(1)** for details on the other flags available with this command.

### Display the current running IPF ruleset

The program `ipfstat` reports on packet filter statistics and filter lists for IPF. The following command displays the current running filter lists used for both the input and output side of IPF.

```terminal
# ipfstat -io
empty list for ipfilter(out)
empty list for ipfilter(in)
```

As IPF is running the default `/etc/ipf/ipf.conf` file at this time, statistics for an empty list are displayed.

## IPF Rule Syntax

This section describes the IPF rule syntax used to create stateful rules. When creating rules, keep in mind that unless the *quick* keyword appears in a rule, every rule is read in order, with the last matching rule being the one that is applied. This means that even if the first rule to match a packet is a pass, if there is a later matching rule that is a block, the packet will be dropped. Sample rulesets can be found in `/usr/share/ipfilter/examples/`.

When creating rules, a **#** character is used to mark the start of a comment and may appear at the end of a rule, to explain that rule's function, or on its own line. Any blank lines are ignored.

The keywords which are used in rules must be written in a specific order, from left to right. Some keywords are mandatory while others are optional. Some keywords have sub-options which may be keywords themselves and also include more sub-options. The keyword order is as follows, where the words shown in uppercase represent a variable and the words shown in lowercase must precede the variable that follows it:

`ACTION DIRECTION OPTIONS proto PROTO_TYPE from SRC_ADDR SRC_PORT to DST_ADDR DST_PORT TCP_FLAG|ICMP_TYPE keep state STATE`

This section describes each of these keywords and their options. It is not an exhaustive list of every possible option.

Refer to **ipf(4)** for a complete description of the rule syntax that can be used when creating IPF rules and examples for using each keyword.

#### ACTION

The action keyword indicates what to do with the packet if it matches that rule. Every rule must have an action.

The following actions are recognised:

**block** : indicates that the packet should be flagged to be dropped.

**pass** : will flag the packet to be let through the filter.

**log** : causes the packet to be logged and has no effect on whether the packet will be allowed through the filter.

**count** : causes the packet to be included in the accounting statistics kept by the filter, and has no effect on whether the packet will be allowed through the filter.

**auth** : this allows authentication to be performed by a user-space program running and waiting for packet information to validate.

**call** : this action is used to invoke the named function in the kernel, which must conform to a specific calling interface.

#### MATCHING PARAMETERS

Next, each rule must explicitly state the direction of traffic using one of these keywords:

**in** : each packet moving through the kernel is either inbound (just been received on an interface, and moving towards the kernel's protocol processing) or outbound (transmitted or forwarded by the stack, and on its way to an interface).

**out** : see **in**.

**all** : the rule is essentially a synonym for "from any to any" with no other match parameters.

If the system has multiple interfaces, the interface can be specified along with the direction. An example would be `in on e1000g0`.

#### OPTIONS

Options are optional. However, if multiple options are specified, they must be used in the order shown here.

**log** : indicates that, should this be the last matching rule, the packet header will be written to the IPF log.

**quick** : allows "short-cut" rules in order to speed up the filter or override later rules. If a packet matches a filter rule which is marked as quick, this rule will be the last rule checked.

**on** : allows an interface name to be incorporated into the matching procedure. Interface names are as printed by `netstat -i`. If this option is used, the rule will only match if the packet is going through that interface in the specified direction (in/out).

#### PROTO_TYPE

The protocol type is optional. However, it is mandatory if the rule needs to specify a *SRC_PORT* or a *DST_PORT* as it defines the type of protocol. When specifying the type of protocol, use the *proto* keyword followed by either a protocol number or name from `/etc/protocols` . Example protocol names include *tcp* , *udp* , or *icmp*.

If *PROTO_TYPE* is specified but no *SRC_PORT* or *DST_PORT* is specified, all port numbers for that protocol will match that rule.

#### SRC_ADDR

The **from** keyword is mandatory and is followed by a keyword which represents the source of the packet. The source can be a hostname, an IP address followed by the CIDR mask, an address pool, or the keyword all. Refer to **ipf(1)** for examples.

There is no way to match ranges of IP addresses which do not express themselves easily using the dotted numeric form/mask-length notation.

#### SRC_PORT

The port number of the source is optional. However, if it is used, it requires *PROTO_TYPE* to be first defined in the rule. The port number must also be preceded by the *proto* keyword.

A number of different comparison operators are supported: **=** (equal to), **!=** (not equal to), **<** (less than), **>** (greater than), **<=** (less than or equal to), and **>=** (greater than or equal to).

To specify port ranges, place the two port numbers between **<>** (less than and greater than ), **><** (greater than
and less than ), or **:** (greater than or equal to and less than or equal to).

#### DST_ADDR

The **to** keyword is mandatory and is followed by a keyword which represents the destination of the packet. Similar to *SRC_ADDR*, it can be a hostname, an IP address followed by the CIDR mask, an address pool, or the keyword all.

#### DST_PORT

Similar to *SRC_PORT*, the port number of the destination is optional. However, if it is used, it requires *PROTO_TYPE* to be first defined in the rule. The port number must also be preceded by the *proto* keyword.

#### TCP_FLAG|ICMP_TYPE

If *tcp* is specified as the *PROTO_TYPE*, flags can be specified as letters, where each letter represents one of the
possible TCP flags used to determine the state of a connection. Possible values are: **S** (SYN), **A** (ACK), **P** (PSH),
**F** (FIN), **U** (URG), **R** (RST), **C** (CWN), and **E** (ECN).

If *icmp* is specified as the *PROTO_TYPE*, the ICMP type to match can be specified. Refer to **ipf(1)** for the allowable types.

#### STATE

If a pass rule contains keep state , IPF will add an entry to its dynamic state table and allow subsequent packets that match the connection. IPF can track state for TCP, UDP, and ICMP sessions. Any packet that IPF can be certain is part of an active session, even if it is a different protocol, will be allowed.

In IPF, packets destined to go out through the interface connected to the public Internet are first checked against the dynamic state table. If the packet matches the next expected packet comprising an active session conversation, it exits the firewall and the state of the session conversation flow is updated in the dynamic state table. Packets that do not belong to an already active session are checked against the outbound ruleset.

Packets coming in from the interface connected to the public Internet are first checked against the dynamic state table. If the packet matches the next expected packet comprising an active session, it exits the firewall and the state of the session conversation flow is updated in the dynamic state table. Packets that do not belong to an already active session are checked against the inbound ruleset.

Several keywords can be added after keep state . If used, these keywords set various options that control stateful filtering, such as setting connection limits or connection age. Refer to **ipf(1)** for the list of available options and their descriptions.

## IPF Example Ruleset

This section demonstrates how to create an example ruleset which only allows services that match pass rules and blocks all others.

OmniOS uses the loopback interface (**lo0**) and the IP address 127.0.0.1 for internal communication. The firewall ruleset must contain rules to allow free movement of these internally used packets:

```none
# no restrictions on loopback interface
pass in quick on lo0 all
pass out quick on lo0 all
```

The public interface connected to the Internet is used to authorise and control access of all outbound and inbound connections. If one or more interfaces are cabled to private networks, those internal interfaces may require rules to allow packets originating from the LAN to flow between the internal networks or to the interface attached to the Internet. The ruleset should be organised into three major sections: *any trusted internal interfaces*, *outbound connections through the public interface*, and *inbound connections through the public interface*.

These two rules allow all traffic to pass through a trusted LAN interface named `e1000g0`:

```none
# no restrictions on inside LAN interface for private network
pass out quick on e1000g0 all
pass in quick on e1000g0 all
```

The rules for the public interface's outbound and inbound sections should have the most frequently matched rules placed before less commonly matched rules, with the last rule in the section blocking and logging all packets for that interface and direction.

This set of rules defines the *outbound section of the public interface* named `rge0` . These rules keep state and identify the specific services that internal systems are authorised for public Internet access. All the rules use *quick* and specify the appropriate port numbers and, where applicable, destination addresses.

```none
# interface facing Internet (outbound)
# Matches session start requests originating from or behind the
# firewall, destined for the Internet.
# Allow outbound access to public DNS servers.
# Replace x.x.x. with address listed in /etc/resolv.conf.
# Repeat for each DNS server.
pass out quick on rge0 proto tcp from any to x.x.x. port = 53 flags S keep state
pass out quick on rge0 proto udp from any to xxx port = 53 keep state

# Allow access to ISP's specified DHCP server for cable or DSL networks.
# Use the first rule, then check log for the IP address of DHCP server.
# Then, uncomment the second rule, replace z.z.z.z with the IP address,
# and comment out the first rule
pass out log quick on rge0 proto udp from any to any port = 67 keep state

#pass out quick on rge0 proto udp from any to z.z.z.z port = 67 keep state
# Allow HTTP and HTTPS
pass out quick on rge0 proto tcp from any to any port = 80 flags S keep state
pass out quick on rge0 proto tcp from any to any port = 443 flags S keep state

# Allow email
pass out quick on rge0 proto tcp from any to any port = 110 flags S keep state
pass out quick on rge0 proto tcp from any to any port = 25 flags S keep state

# Allow NTP
pass out quick on rge0 proto tcp from any to any port = 37 flags S keep state

# Allow FTP
pass out quick on rge0 proto tcp from any to any port = 21 flags S keep state
# Allow SSH
pass out quick on rge0 proto tcp from any to any port = 22 flags S keep state

# Allow ping
pass out quick on rge0 proto icmp from any to any icmp-type 8 keep state

# Block and log everything else
block out log first quick on rge0 all
```

This example of the rules in the *inbound section of the public interface* blocks all undesirable packets first. This reduces the number of packets that are logged by the last rule.

```none
# interface facing Internet (inbound)
# Block all inbound traffic from non-routable or reserved address spaces
block in quick on rge0 from 192.168.0.0/16 to any      #RFC 1918 private IP
block in quick on rge0 from 172.16.0.0/12 to any       #RFC 1918 private IP
block in quick on rge0 from 10.0.0.0/8 to any          #RFC 1918 private IP
block in quick on rge0 from 127.0.0.0/8 to any         #loopback
block in quick on rge0 from 0.0.0.0/8 to any           #loopback
block in quick on rge0 from 169.254.0.0/16 to any      #DHCP auto-config
block in quick on rge0 from 192.0.2.0/24 to any        #reserved for docs
block in quick on rge0 from 204.152.64.0/23 to any     #Sun cluster interconnect
block in quick on rge0 from 224.0.0.0/3 to any         #Class D & E multicast

# Block fragments and too short tcp packets
block in quick on rge0 all with frags
block in quick on rge0 proto tcp all with short

# block source routed packets
block in quick on rge0 all with opt lsrr
block in quick on rge0 all with opt ssrr

# Block OS fingerprint attempts and log first occurrence
block in log first quick on rge0 proto tcp from any to any flags FUP

# Block anything with special options
block in quick on rge0 all with ipopts

# Block public pings and ident
block in quick on rge0 proto icmp all icmp-type 8
block in quick on rge0 proto tcp from any to any port = 113

# Block incoming Netbios services
block in log first quick on rge0 proto tcp/udp from any to any port = 137
block in log first quick on rge0 proto tcp/udp from any to any port = 138
block in log first quick on rge0 proto tcp/udp from any to any port = 139
block in log first quick on rge0 proto tcp/udp from any to any port = 81
```

Any time there are logged messages on a rule with the log first option, run `ipfstat -hio` to evaluate how many times the rule has been matched. A large number of matches may indicate that the system is under attack.

The rest of the rules in the *inbound section* define which connections are allowed to be initiated from the Internet.

The last rule denies all connections which were not explicitly allowed by previous rules in this section.

```none
# Allow traffic in from ISP's DHCP server. Replace z.z.z.z with
# the same IP address used in the outbound section.
pass in quick on rge0 proto udp from z.z.z.z to any port = 68 keep state

# Allow public connections to specified internal web server
pass in quick on rge0 proto tcp from any to x.x.x.x port = 80 flags S keep state

# Block and log only first occurrence of all remaining traffic.
block in log first quick on rge0 all
```

## Configuring NAT

NAT sets up mapping rules that translate source and destination IP addresses into other Internet or intranet addresses. These rules modify the source and destination addresses of incoming or outgoing IP packets and send the packets on. You can also use NAT to redirect traffic from one port to another port. NAT maintains the integrity of the packet during any modification or redirection done on the packet.

You can create NAT rules either at the command line, using the `ipnat` command, or in a NAT configuration file. You must create the NAT configuration file and set its pathname as the value of the **config/ipnat_config_file** property of the service. The default file is `/etc/ipf/ipnat.conf` and is loaded when IPF is started, if the file exists.

NAT rules are flexible and can accomplish many different things to fit the needs of both commercial and home users. The rule syntax presented here has been simplified to demonstrate common usage. For a complete rule syntax description, refer to **ipnat(4)**.

The basic syntax for a NAT rule is as follows, where *map* starts the rule and *IF* should be replaced with the name of the external interface:

```none
map IF LAN_IP_RANGE -> PUBLIC_ADDRESS
```

The *LAN_IP_RANGE* is the range of IP addresses used by internal clients. Usually, it is a private address range such as 192.168.1.0/24 . The *PUBLIC_ADDRESS* can either be the static external IP address or the keyword 0/32 which represents the IP address assigned to *IF*.

In IPF, when a packet arrives at the firewall from the LAN with a public destination, it first passes through the outbound rules of the firewall ruleset. Then, the packet is passed to the NAT ruleset which is read from the top down, where the first matching rule wins. IPF tests each NAT rule against the packet's interface name and source IP address. When a packet's interface name matches a NAT rule, the packet's source IP address in the private LAN is checked to see if it falls within the IP address range specified in *LAN_IP_RANGE*. On a match, the packet has its source IP address rewritten with the public IP address specified by *PUBLIC_ADDRESS*. IPF posts an entry in its internal NAT table so that when the packet returns from the Internet, it can be mapped back to its original private IP address before being passed to the firewall rules for further processing.

### Updating the NAT ruleset and viewing NAT statistics

Whenever the file containing the NAT rules is edited, run `ipnat -CF` to delete the current NAT rules and flush the contents of the dynamic translation table. Include `-f` and specify the name of the NAT ruleset to load:

```none
# ipnat -CF -f /etc/ipnat.rules
```

To display the NAT statistics:

```none
# ipnat -s
```

To list the NAT table's current mappings:

```none
# ipnat -l
```

To turn verbose mode on and display information relating to rule processing and active rules and table entries:

```none
# ipnat -v
```

## Viewing IPF Statistics

IPF includes **ipfstat(1)** which can be used to retrieve and display statistics which are gathered as packets match rules as they go through the firewall. Statistics are accumulated since the firewall was last started or since the last time they were reset to zero using `ipf -Z` .

The default ipfstat output looks like this:

```none
# ipfstat
bad packets:            in 0    out 0
 IPv6 packets:          in 0 out 0
 input packets:         blocked 51 passed 302702 nomatch 292725 counted 0 short 0
output packets:         blocked 2962 passed 292402 nomatch 281745 counted 0 short 0
 input packets logged:  blocked 51 passed 2
output packets logged:  blocked 2962 passed 2
 packets logged:        input 0 output 0
 log failures:          input 0 output 0
fragment state(in):     kept 0  lost 0  not fragmented 0
fragment state(out):    kept 0  lost 0  not fragmented 0
packet state(in):       kept 0  lost 0
packet state(out):      kept 693        lost 0
ICMP replies:   0       TCP RSTs sent:  0
Invalid source(in):     0
Result cache hits(in):  1219    (out):  1957
IN Pullups succeeded:   207     failed: 0
OUT Pullups succeeded:  662     failed: 0
Fastroute successes:    0       failures:       0
TCP cksum fails(in):    0       (out):  0
IPF Ticks:      134173
Packet log flags set: (0)
        none
```

Several options are available. When supplied with either `-i` for inbound or `-o` for outbound, the command will retrieve and display the appropriate list of filter rules currently installed and in use by the kernel. To also see the rule numbers, include `-n`. For example, ipfstat `-on` displays the outbound rules table with rule numbers:

```none
@1 pass out on e1000g0 from any to any
@2 block out on rge0 from any to any
@3 pass out quick on rge0 proto tcp/udp from any to any keep state
```
Include `-h` to prefix each rule with a count of how many times the rule was matched. For example, `ipfstat -oh` displays the outbound internal rules table, prefixing each rule with its usage count:

```none
2451423 pass out on e1000g0 from any to any
354727 block out on rge0 from any to any
430918 pass out quick on rge0 proto tcp/udp from any to any keep state
```

## IPF Logging
IPF provides `ipmon`, which can be used to write the firewall's logging information in a human readable format.

By default, all log information for IPF is recorded in the syslogd file. You should set up a log file to record IPF traffic information separately from other data that might be logged in the default log file.

Edit the `/etc/syslog.conf` file by adding the following two lines:


```none
# Save IPFilter log output to its own file 
local0.debug             /var/log/ipfilter
```

> **Note:** Make sure to use the Tab key, not the Spacebar, to separate `local0.debug` from `/var/log/ipfilter`.

Create the new log file & restart the system-log service.

```none
# touch /var/log/ipfilter
# svcadm restart system-log
```
By default, `ipmon -Ds` mode uses `local0` as the logging facility. The following logging levels can be used to further segregate the logged data:

**LOG_INFO** : packets logged using the "log" keyword as the action rather than pass or block.
**LOG_NOTICE** : packets logged which are also passed
**LOG_WARNING** : packets logged which are also blocked
**LOG_ERR** : packets which have been logged and which can be considered short due to an incomplete header

Logging provides the ability to review, after the fact, information such as which packets were dropped, what addresses they came from, and where they were going. This information is useful in tracking down attackers.

Once the logging facility is enabled, IPF will only log the rules which contain the *log* keyword. The firewall administrator decides which rules in the ruleset should be logged and normally only deny rules are logged. It is customary to include the log keyword in the last rule in the ruleset. This makes it possible to see all the packets that did not match any of the rules in the ruleset.

### View log files with `ipmon`

View the state, NAT, or normal log files. To view a log file, type the following command, using the appropriate option:

```none
# ipmon -o [S|N|I]
```

**S** : Displays the state log file.

**N** : Displays the NAT log file.

**I** : Displays the normal IP log file.

To view all state, NAT, and normal log files, use all the options. Sample output is as follows:

```terminal
# ipmon -o SNI
28/06/2020 18:57:47.089622 @1 NAT:MAP 192.168.1.100,43183 <- -> 192.168.43.100,43183 [1.1.1.1,53]
28/06/2020 18:57:47.089607 STATE:NEW 192.168.1.100,43183 -> 1.1.1.1,53 PR udp
28/06/2020 18:57:52.179848 rge0 @0:12 b 192.168.1.100,40702 -> 77.238.185.51,993 PR tcp len 20 60 -S OUT
28/06/2020 18:57:53.239346 rge0 @0:12 b 192.168.1.100,40702 -> 77.238.185.51,993 PR tcp len 20 60 -S OUT
28/06/2020 18:57:54.169657 rge0 @0:12 b 192.168.1.100,8698 -> 162.159.200.123,123 PR udp len 20 76 OUT
28/06/2020 18:57:55.169376 rge0 @0:12 b 192.168.1.100,8698 -> 193.145.15.15,123 PR udp len 20 76 OUT
28/06/2020 18:57:55.287404 rge0 @0:12 b 192.168.1.100,40702 -> 77.238.185.51,993 PR tcp len 20 60 -S OUT
28/06/2020 18:57:54.775256 @1 NAT:MAP 192.168.1.100,50365 <- -> 192.168.43.100,50365 [1.1.1.1,53]
28/06/2020 18:57:54.775677 @1 NAT:MAP 192.168.1.100,35506 <- -> 192.168.43.100,35506 [1.1.1.1,53]
28/06/2020 18:57:54.842030 @1 NAT:MAP 192.168.1.100,42866 <- -> 192.168.43.100,42866 [52.250.42.157,443]
28/06/2020 18:57:55.517148 @1 NAT:MAP 192.168.1.100,33754 <- -> 192.168.43.100,33754 [1.1.1.1,53]
28/06/2020 18:57:54.775242 STATE:NEW 192.168.1.100,50365 -> 1.1.1.1,53 PR udp
28/06/2020 18:57:54.775665 STATE:NEW 192.168.1.100,35506 -> 1.1.1.1,53 PR udp
28/06/2020 18:57:54.842024 STATE:NEW 192.168.1.100,42866 -> 52.250.42.157,443 PR tcp
28/06/2020 18:57:55.517141 STATE:NEW 192.168.1.100,33754 -> 1.1.1.1,53 PR udp
```

Messages generated by ipmon consist of data fields separated by white space. Fields common to all messages are:
1. The date of packet receipt.
2. The time of packet receipt. This is in the form *HH:MM:SS.F*, for hours, minutes, seconds, and fractions of a second.
3. The name of the interface that processed the packet.
4. The group and rule number of the rule in the format *@0:17*.
5. The action: *p* for passed, *b* for blocked, *S* for a short packet, *n* did not match any rules, and *L* for a log rule.
6. The addresses written as three fields: the source address and port separated by a comma, the -> symbol, and the destination address and port. For example: *209.53.17.22,80 -> 198.73.220.17,1722*.
7. PR followed by the protocol name or number: for example, *PR tcp*.
8. len followed by the header length and total length of the packet: for example, *len 20 40*.

If the packet is a TCP packet, there will be an additional field starting with a hyphen followed by letters corresponding to any flags that were set. Refer to **ipf(4)** for a list of letters and their flags.

If the packet is an ICMP packet, there will be two fields at the end: the first always being “icmp” and the next being the ICMP message and sub-message type, separated by a slash. For example: `icmp 3/3` for a port unreachable message.
