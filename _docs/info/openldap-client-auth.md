---
title: OpenLDAP Client Authentication
layout: page
category: info
show_in_sidebar: true
---
# OpenLDAP Client Authentication

OmniOS can be used for OpenLDAP Client Authentication, both as a server and a client. The server stores the Directory Information Tree(DIT), that contains authentication details used by the client server. This guide will demonstrate how to configure both the server and the client.

This guide is a continuation of the [OpenLDAP Quick Start Guide](/info/openldap.html) and assumes you have completed the tasks outlined in this guide.

**Note:** that by default, the `slapd` database grants read access to everybody excepting the super-user (as specified by the `rootdn` configuration directive). It is highly recommended that you establish controls to restrict access to authorized users. Access controls are discussed in the Access Control chapter of the OpenLDAP Administrator's Guide. You are also encouraged to read the [Security Considerations](https://www.openldap.org/doc/admin24/security.html), [Using SASL](https://www.openldap.org/doc/admin24/sasl.html) and [Using TLS](https://www.openldap.org/doc/admin24/tls.html) sections.

## Setup OpenLDAP Client Authentication Server

First, let's do some further configuration on the OpenLDAP server, to allow LDAP Client Authentication.

LDAP Client authentication relies on the `nis.schema`, which is located under `/etc/opt/ooce/openldap/schema/` directory. Further, `nis.schema` relies on the `cosine.schema` and `inetOrgPerson.schema`, therefore these will also be imported as follows:

```terminal
root@ldap:#  /opt/ooce/bin/ldapadd -D "cn=config" -W -f /etc/opt/ooce/openldap/schema/cosine.ldif
Enter LDAP Password:
adding new entry "cn=cosine,cn=schema,cn=config"

root@ldap:# /opt/ooce/bin/ldapadd -D "cn=config" -W -f /etc/opt/ooce/openldap/schema/inetorgperson.ldif
Enter LDAP Password:
adding new entry "cn=inetorgperson,cn=schema,cn=config"

root@ldap:# /opt/ooce/bin/ldapadd -D "cn=config" -W -f /etc/opt/ooce/openldap/schema/nis.ldif
Enter LDAP Password:
adding new entry "cn=nis,cn=schema,cn=config"

```

## Adding Groups and Users to the system

In order to populate the DIT with users and groups for the client, "Organizational Units"(ou) need to be created to store these. Therefore we create the following "ou"'s, `group` and `user`.

### Add the Organizational Unit: group

First, create an *ldif* text file that can be used to import the data into the DIT.

```terminal
root@ldap:# cat << EOF > ou-group.ldif
dn: ou=group,dc=omnios,dc=org
objectClass: organizationalUnit
ou: group
EOF
```

This can now be added to the DIT with the `ldapadd` command as follows:

```terminal
root@ldap:# /opt/ooce/bin/ldapadd -D "cn=Manager,dc=omnios,dc=org" -W -f ou-group.ldif
Enter LDAP Password:
adding new entry "ou=group,dc=omnios,dc=org"
```
This ou represents groups for users. The same as what you have with `/etc/group` with traditional Unix authentication.

### Add the Organizational Unit: user

Again, create an *ldif* text file that can be used to import the data into the DIT.

```terminal
root@ldap:# cat << EOF > ou-user.ldif
dn: ou=user,dc=omnios,dc=org
objectClass: organizationalUnit
ou: user
EOF
```

This can now be added to the DIT with the `ldapadd` command as follows:

```terminal
root@ldap:# /opt/ooce/bin/ldapadd -D "cn=Manager,dc=omnios,dc=org" -W -f ou-user.ldif
Enter LDAP Password:
adding new entry "ou=user,dc=omnios,dc=org"
```

This ou represents users that will access systems via OpenLDAP Client Authentication. Again, this is the same as what you have with `/etc/passwd` with traditional Unix authentication.

### Add the `other` group to the ou=group

Within this organizational unit we will add the first group, `other`, the same as the default group when setting up a new user on OmniOS.

Again, we follow the standard procedure of creating an *ldif* text file and then import with `ldapadd`.

```terminal
root@ldap:# cat  << EOF > group-other.ldif
dn: cn=other,ou=group,dc=omnios,dc=org
objectClass: posixGroup
cn: other
gidNumber: 1
EOF
root@ldap:# /opt/ooce/bin/ldapadd -D "cn=Manager,dc=omnios,dc=org" -W -f group-other.ldif
Enter LDAP Password:
adding new entry "cn=other,ou=group,dc=omnios,dc=org"
```

### Add a user to the ou=user

Now we will add our first user. This will be the user that we test the LDAP Client Authentication, on the client system.

Again, we follow the standard procedure of creating an *ldif* text file and then import with `ldapadd`.

```terminal
root@ldap:# cat << EOF > user-rigby.ldif
dn: uid=rigby,ou=user,dc=omnios,dc=org
objectClass: account
objectClass: posixAccount
objectClass: shadowAccount
cn: Rigby
uid: rigby
uidNumber: 101
gidNumber: 1
homeDirectory: /home/rigby/
loginShell: /usr/bin/bash
userPassword: {SSHA}WjKBvaM5QYtyzrpQDs2NHtOTbLwYizxe
EOF
root@ldap:# /opt/ooce/bin/ldapadd -D "cn=Manager,dc=omnios,dc=org" -W -f user-rigby.ldif
Enter LDAP Password:
adding new entry "uid=rigby,ou=user,dc=omnios,dc=org"
```

This completes the configuration of the OpenLDAP Client Authentication server. OpenLDAP should be running, the DIT is populated, and is now ready to authenticate against clients stored in the DIT.

## Setup Client

On a different OmniOS system, I will configure the client. No LDAP software needs to be installed, as OmniOS comes with the **ldapclient(1)** program that takes care of configuration and authentication.

### Allow use of DNS for host lookups in ldap.

By default the `nsswitch.ldap` file does not permit dns lookups so this needs to be changed before we run the `ldapclient` command.

Change the following line in `/etc/nsswitch.ldap`:

```terminal
hosts:      files ldap
```
to the following:

```terminal
hosts:      files dns ldap
```

### Configure `ldapclient`

The following is sufficient to configure `ldapclient` to allow authentication with the server, that has been configured previously. The `defaultServerList` directive should point to a Fully Qualified Domain Name that you manage (e.g. the server that has been configured in the previous section). Consult the manpage for full details of the `ldapclient` command.

Issue the following command to manually create the configuration for the LDAP client.

```terminal
root@client:# ldapclient manual \
-a credentialLevel=proxy \
-a authenticationMethod=simple \
-a defaultSearchBase=dc=omnios,dc=org \
-a domainName=omnios.org \
-a defaultServerList=ldap.omnios.org \
-a proxyDN=cn=Manager,dc=omnios,dc=org \
-a proxyPassword=secret \
-a attributeMap=group:gidnumber=gidNumber \
-a attributeMap=passwd:gidnumber=gidNumber \
-a attributeMap=passwd:uidnumber=uidNumber \
-a attributeMap=passwd:homedirectory=homeDirectory \
-a attributeMap=passwd:loginshell=loginShell \
-a attributeMap=shadow:userpassword=userPassword \
-a objectClassMap=group:posixGroup=posixgroup \
-a objectClassMap=passwd:posixAccount=posixaccount \
-a objectClassMap=shadow:shadowAccount=posixaccount \
-a serviceSearchDescriptor=passwd:ou=user,dc=omnios,dc=org \
-a serviceSearchDescriptor=group:ou=group,dc=omnios,dc=org \
-a serviceSearchDescriptor=shadow:ou=user,dc=omnios,dc=org
Stopping sendmail failed with (1). You may need to restart it manually for changes to take effect.
System successfully configured
```

On success, this will create two files under `/var/ldap/`, `ldap_client_cred` and `ldap_client_file`.  These should not be hand edited, instead all changes should be made with the `ldapclient` command. However, feel free to browse the contents of these files with `cat` or your favorite editor.

### Update `/etc/pam.conf`:

One last step is needed, we need to tell the Pluggable Authentication Module (PAM) to allow for client authentication via LDAP. This can be achieved by changing the following line:

```terminal
login   auth required           pam_unix_auth.so.1
```
to the following two lines:

```terminal
login   auth binding            pam_unix_auth.so.1  server_policy
login   auth required           pam_ldap.so.1
```

Now you have fully configured LDAP Client Authentication for your system that will act as the client. Reboot this system to make sure all changes are in effect.

On reboot, you should now be able to login in with the new user that has been created.

This is demonstrated as follows:

```ternimal
Hostname: client
LDAP domain name is omnios.org

client console login: rigby
Password:
OmniOS r151036  omnios-r151036-4a32ffb911       November 2020
rigby@client:~$
```

## A Note on Error Messages on Reboot

One minor annoyance at the time of writing this is the error message as follows:

```terminal
Nov 17 13:19:41 svc.startd[44]: libsldap: Status: 2  Mesg: Unable to load configuration '/var/ldap/ldap_client_file' ('').
Nov 17 13:19:41 svc.startd[44]: libsldap: Status: 2  Mesg: Unable to load configuration '/var/ldap/ldap_client_file' ('').
```

There has been a bug filed for this behaviour [https://www.illumos.org/issues/487](https://www.illumos.org/issues/487). Further, under the official Solaris documentation, the [advice](https://docs.oracle.com/cd/E36784_01/html/E36797/gohea.html) is to ignore these messages.

## Looking forward

You are strongly advised to implement full security before using OpenLDAP Client Authentication in a production system. Access controls are discussed in the Access Control chapter of the OpenLDAP Administrator's Guide. You are also encouraged to read the [Security Considerations](https://www.openldap.org/doc/admin24/security.html), [Using SASL](https://www.openldap.org/doc/admin24/sasl.html) and [Using TLS](https://www.openldap.org/doc/admin24/tls.html) sections.
