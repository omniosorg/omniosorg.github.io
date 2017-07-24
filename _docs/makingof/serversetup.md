---
title: Setup restricted SFTP
category: makingof
---

# Setup Restricted SFTP for download.omniosce.org

Convert the cert into ssh authorized_keys compatible format

```
openssl x509 -in newcerts/1002.pem -pubkey -noout | ssh-keygen -i  -m PKCS8 -f /dev/stdin
```

Add the result to the `~archive/.ssh/authorized_keys` file.

Users will only get access to `/archive` because of this setting in
`/etc/ssh/sshd_config`

```
Match User archive
	ForceCommand internal-sftp
	ChrootDirectory /archive
```

To access the archive, the guardian will put the following into
`.ssh/config`

```
Host omniosce-archive
     Hostname omniosce.ee.ethz.ch
     User archive
     IdentityFile ~/.ssh/omniosce.key.pem     
     Port 8114
```
