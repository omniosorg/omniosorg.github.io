---
title: OpenLDAP Quick Start Guide
layout: page
category: info
show_in_sidebar: true
---
# OpenLDAP Quick Start Guide

The following is a quick start guide to OpenLDAP Software 2.4, including the Standalone LDAP Daemon, **slapd(8)**.

It is meant to walk you through the basic steps needed to install and configure [OpenLDAP Software](http://www.openldap.org/software/) on [OmniOS](https://omnios.org/). It should be used in conjunction with the [OpenLDAP Administrator's Guide](https://www.openldap.org/doc/admin24/), manual pages, and other materials provided with the distribution (e.g. the `INSTALL` document) or on the [OpenLDAP web site](http://www.OpenLDAP.org), in particular the [OpenLDAP Software FAQ](http://www.OpenLDAP.org/faq/?file=2).

If you intend to run OpenLDAP Software seriously, you should review all of the OpenLDAP Administrator's Guide.

**Note:** This quick start guide does not use strong authentication nor any integrity or confidential protection services. These services are described in the OpenLDAP Administrator's Guide.

### Installation

Use the OmniOS IPS package manager to install OpenLDAP as follows:

```terminal
root:# pkg install network/openldap
```

The OpenLDAP tools will be installed in the `/opt/ooce/bin/` directory. Of note, OmniOS comes pre-installed with the native Solaris LDAP tools which are located in the `/usr/bin/` directory. Care should be taken in which command is run as the options for each tool may differ.

### OpenLDAP Configuration

The default OpenLDAP configuration file is located at `/etc/opt/ooce/openldap/slapd.conf`. It is necessary to make the following edit for the purposes of this quickstart.

Append to the following of the `slapd.conf` file:

```terminal
database config
rootpw verysecret
```

This will be used to allow access to the *cn=config* database, when converting to the *slapd-config* format.

It is also recommended to replace `<MY-DOMAIN>` and `<COM>` with the appropriate domain components of your domain name. For example, for *omnios.org*, use:

```terminal
suffix "dc=omnios,dc=org"
rootdn "cn=Manager,dc=omnios,dc=org"
```

Details regarding configuring `slapd` can be found in the **slapd.conf(5)** manual page and the [Configuring slapd](https://www.openldap.org/doc/admin24/slapdconf2.html) chapter of the OpenLDAP Administrator's Guide.

### Start the OpenLDAP Service

You are now ready to start the Standalone LDAP Daemon, `slapd`, by running the following command:

```terminal
root:# svcadm enable network/openldap
```

To check to see if the server is running and configured correctly, you can run a search against it with **ldapsearch(1)**.

```terminal
root:# /opt/ooce/bin/ldapsearch -x -b '' -s base '(objectclass=*)' namingContexts
```

Note the use of single quotes around command parameters to prevent special characters from being interpreted by the shell. This should return:

```terminal
# extended LDIF
#
# LDAPv3
# base <> with scope baseObject
# filter: (objectclass=*)
# requesting: namingContexts
#

#
dn:
namingContexts: dc=omnios,dc=org

# search result
search: 2
result: 0 Success

# numResponses: 2
# numEntries: 1
```

Details regarding running `slapd` can be found in the `slapd` manual page and the [Running slapd](https://www.openldap.org/doc/admin24/runningslapd.html) chapter of the OpenLDAP Administrator's Guide.

### Add initial entries to your directory

You can use **ldapadd(1)** to add entries to your LDAP directory. `ldapadd` expects input in *LDIF* form. We'll do it in two steps:

* create an LDIF file
* run `ldapadd`

From the command line create an LDIF file as follows:

```terminal
root:# cat << EOF > ~/my-domain.ldif
dn: dc=<MY-DOMAIN>,dc=<COM>
objectclass: dcObject
objectclass: organization
o: <MY ORGANIZATION>
dc: <MY-DOMAIN>

dn: cn=Manager,dc=<MY-DOMAIN>,dc=<COM>
objectclass: organizationalRole
cn: Manager
EOF
```

Be sure to replace `<MY-DOMAIN>` and `<COM>` with the appropriate domain components of your domain name. `<MY ORGANIZATION>` should be replaced with the name of your organization. When you cut and paste, be sure to trim any leading and trailing whitespace from the example.

For example, for *omnios.org*, use:

```terminal
root:# cat << EOF > ~/omnios.ldif
dn: dc=omnios,dc=org
objectclass: dcObject
objectclass: organization
o: OmniOS Association
dc: omnios

dn: cn=Manager,dc=omnios,dc=org
objectclass: organizationalRole
cn: Manager
EOF
```

Now, you may run `ldapadd` to insert these entries into your directory.

```terminal
root:# /opt/ooce/bin/ldapadd -D "cn=Manager,dc=omnios,dc=org" -W -f ~/omnios.ldif
Enter LDAP Password:
adding new entry "dc=omnios,dc=org"

adding new entry "cn=Manager,dc=omnios,dc=org"
```
where `~/omnios.ldif` is the file you created above.

Additional information regarding directory creation can be found in the [Database Creation and Maintenance Tools](https://www.openldap.org/doc/admin24/dbtools.html) chapter of the OpenLDAP Administrator's Guide.

### See if it works.

Now we're ready to verify the added entries are in your directory. You can use any LDAP client to do this, but our example uses the `ldapsearch` tool.

```terminal
root:# /opt/ooce/bin/ldapsearch -x -b 'dc=omnios,dc=org' '(objectclass=*)'
```

This command will search for and retrieve every entry in the database and should produce the following result:

```terminal
# extended LDIF
#
# LDAPv3
# base <dc=omnios,dc=org> with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# omnios.org
dn: dc=omnios,dc=org
objectClass: dcObject
objectClass: organization
o: OmniOS Association
dc: omnios

# Manager, omnios.org
dn: cn=Manager,dc=omnios,dc=org
objectClass: organizationalRole
cn: Manager

# search result
search: 2
result: 0 Success

# numResponses: 3
# numEntries: 2
```

## Converting old style `slapd.conf` file to *slapd-config* format

OpenLDAP 2.3 and later have transitioned to using a dynamic runtime configuration engine, **slapd-config(5)**.

*slapd-config*:

* is fully LDAP-enabled
* is managed using the standard LDAP operations
* stores its configuration data in an LDIF database, generally in the `/etc/opt/ooce/openldap/slapd.d` directory.
* allows all of slapd's configuration options to be changed on the fly, generally without requiring a server restart for the changes to take effect.

The older style `slapd.conf` file is still supported, but its use is deprecated and support for it will be withdrawn in a future OpenLDAP release.

The following describes the necessary operations to convert the old style `slapd.conf` file to *slapd-config* format, as well as re-configuring the OpenLDAP SMF Service.

### Create the new format *slapd-config* ldif files

An existing `slapd.conf` file can be converted to the new format using **slaptest(8)**:

```terminal
root:# mkdir /etc/opt/ooce/openldap/slapd.d
root:# /opt/ooce/sbin/slaptest -f /etc/opt/ooce/openldap/slapd.conf -F /etc/opt/ooce/openldap/slapd.d
root:# chown -R openldap:openldap /etc/opt/ooce/openldap/slapd.d
```

**Note:** Although the *slapd-config* system stores its configuration as (text-based) LDIF files, you should never edit any of the LDIF files directly. Configuration changes should be performed via LDAP operations, e.g. **ldapadd(1)**, **ldapdelete(1)**, or **ldapmodify(1)**.

### Reconfigure the OpenLDAP SMF Service

Use the `svccfg` and `svcadm` commands as follows to reconfigure the OpenLDAP SMF Service, to allow for the use of the new *slapd-config* configuration.

```terminal
root:# svccfg -s network/openldap:slapd setprop start/exec=\"/opt/ooce/openldap/libexec/slapd -F %{config/file} -h \'%{config/urls}\'\"
root:# svccfg -s network/openldap:slapd setprop  config/file=/etc/opt/ooce/openldap/slapd.d
root:# svcadm refresh network/openldap
root:# svcadm restart network/openldap
```
Now, check that the OpenLDAP service has come back online:

```terminal
root:# svcs network/openldap
STATE          STIME    FMRI
online         12:03:28 svc:/network/openldap:slapd
```

### Test the new configuration

Again, run the previous `ldapsearch` command to verify the entries in the database:

```terminal
root:# /opt/ooce/bin/ldapsearch -x -b 'dc=omnios,dc=org' '(objectclass=*)'
```

This command will search for and retrieve every entry in the database and should produce the same result as when it was issued in the previous section.

```terminal
# extended LDIF
#
# LDAPv3
# base <dc=omnios,dc=org> with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

# omnios.org
dn: dc=omnios,dc=org
objectClass: dcObject
objectClass: organization
o: OmniOS Association
dc: omnios

# Manager, omnios.org
dn: cn=Manager,dc=omnios,dc=org
objectClass: organizationalRole
cn: Manager

# search result
search: 2
result: 0 Success

# numResponses: 3
# numEntries: 2
```

Before converting to the *slapd-config* format it was necessary that the config backend is properly configured in the existing `slapd.conf` file. This was taken care of in the "OpenLDAP Configuration" section. While the config backend is always present inside `slapd`, by default it is only accessible by its `rootdn`, and there are no default credentials assigned so unless you explicitly configure the `roopw`, there will be no means to authenticate to it and it will be unusable.

Check that the *cn=config* database is accessible:

```terminal
root:# /opt/ooce/bin/ldapsearch -x -D cn=config -W -b 'cn=config' '(objectclass=*)' *
Enter LDAP Password:
# extended LDIF
#
# LDAPv3
# base <cn=config> with scope subtree
# filter: (objectclass=*)
# requesting: omnios.ldif slapd.conf
#

# config
dn: cn=config

# schema, config
dn: cn=schema,cn=config

# {0}core, schema, config
dn: cn={0}core,cn=schema,cn=config

# {-1}frontend, config
dn: olcDatabase={-1}frontend,cn=config

# {0}config, config
dn: olcDatabase={0}config,cn=config

# {1}mdb, config
dn: olcDatabase={1}mdb,cn=config

# search result
search: 2
result: 0 Success

# numResponses: 7
# numEntries: 6
```

### Looking forward

You are now ready to add more entries using `ldapadd` or another LDAP client, experiment with various configuration options, backend arrangements, etc..

**Note:** that by default, the `slapd` database grants read access to everybody excepting the super-user (as specified by the `rootdn` configuration directive). It is highly recommended that you establish controls to restrict access to authorized users. Access controls are discussed in the Access Control chapter of the OpenLDAP Administrator's Guide. You are also encouraged to read the [Security Considerations](https://www.openldap.org/doc/admin24/security.html), [Using SASL](https://www.openldap.org/doc/admin24/sasl.html) and [Using TLS](https://www.openldap.org/doc/admin24/tls.html) sections.
