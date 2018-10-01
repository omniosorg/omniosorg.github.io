---
title: Deprecating SunSSH Options
category: info
show_in_sidebar: true
---

# Deprecating SunSSH Options

When SunSSH was replaced by OpenSSH back in OmniOS release r151014, a number
of features and options of SunSSH were retained in order to make migration
easier and so that SSH on upgraded servers continued to work as expected
following the upgrade.

As a result of this, the OmniOS OpenSSH package contains a fair number of
local patches just to support legacy SunSSH configurations. The OpenSSH
migration is now complete and the time has come to retire these patches,
therefore:

> The following SunSSH compatibility features have been removed from OpenSSH
> starting with OmniOS r151028.

In order to check if your OpenSSH configuration is using any of these, you
can run the following command and look for deprecation warnings in the output.

```
% /usr/sbin/sshd -T >/dev/null
/etc/ssh/sshd_config line 100: ignoring UsePAM option value. This option is always on.
/etc/ssh/sshd_config line 113: Deprecated option UsePrivilegeSeparation
```

## ListenAddress option

If your `sshd_config` contains a `ListenAddress` option with only an IPv6
address then, from r151028, it will only listen on IPv6. This includes lines
such as:
```
    ListenAddress ::
    ListenAddress [::]:22
```
The recommended action is to remove all `ListenAddress` lines from your
configuration, or to configure specific addesses if required.

> This will emit a deprecation warning starting from release r151026

## Changed Defaults

The default value for the following options will change as shown in brackets.
If you use them, specify the desired value explicitly in your
`sshd_config` and `ssh_config` files:

* GSSAPIAuthentication (yes -> no)
* X11Forwarding (yes -> no)
* ForwardX11Trusted (yes -> no)

## Default ssh-keygen fingerprint format.

Following this change, `ssh-keygen` will output SHA256 fingerprints rather
than MD5.

Old:
```
% ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub
2048 79:e2:f9:76:aa:85:ae:84:08:94:ce:33:73:94:fe:4e root@unknown (RSA)
```
New:
```
% ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub
2048 SHA256:akVabPFFJY4+2edncya71p2mJdHv+pY3J5nnOWoMO3Q root@unknown (RSA)
```

## UsePAM option

On OmniOS, PAM support is always enabled. The `UsePAM` option is deprecated
and ignored if found in the configuration file and should be removed.

## Other deprecated options

The following options are deprecated and should be removed from your
OpenSSH configuration files (`/etc/ssh/sshd_config`, `/etc/ssh/ssh_config`):

* GssapiStoreDelegatedCredentials
* KmfPolicyDatabase
* KmfPolicyName
* LookupClientHostnames
* MaxAuthTriesLog
* PreUserAuthHook
* TrustedAnchorKeystore
* UseFips140
* UseOpensslEngine
* UseUnsupportedSshv1

