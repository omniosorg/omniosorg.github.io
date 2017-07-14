![Image](OmniOSce_logo.svg)

# ​OmniOS Community Edition


On April 21st 2017, OmniTI announced that they would suspend active
development of OmniOS and support contracts would not be renewed.


While this announcement left many users stunned, others focused more on the
fact that OmniTI in their announcement also expressed the hope that "the
community" would take up further development of the OS.  14 weeks later,
OmniOS Community Edition is a reality.


Andy Fiddaman ([www.citrus-it.net](https://www.citrus-it.net)), Tobias
Oetiker ([www.oetiker.ch](https://www.oetiker.ch)) and Dominik Hassler have
spent some quality time setting up the systems and procedures allowing us to
take over maintenance and development of OmniOS.  

In this endeavour we were
supported by many.  Special thanks to Stefan Husch
([www.qutic.com](https://www.qutic.com)), Peter Tribble
([www.petertribble.co.uk](https://www.petertribble.co.uk)), Dan McDonald and
Theo Schlossnagle ([www.circonus.com](https://www.circonus.com)).

A big thank you also [Integrated System Laboratory](http://www.iis.ethz.ch)
of ETH Zurich, Switzerland, who have graceously provided a zone on one of
their OmniOS boxes to host our new repository. 

We have forked the OmniOS repos and pulled in bugfixes and security fixes
that have been published since the release of OmniOS r151022.  After setting
up our own package repository and updating the build infrastructure, we are
finally ready to go public.  We are following the established OmniOS release
naming scheme by releasing

## OmniOSce r151022h, 12th July 2017

The new release contains the following fixes:

- expat updated to version 2.2.1 (CVE-2017-9233)
- curl updated to version 7.54.1 (CVE-2017-9502)
- bind updated to version 9.10.5-P3 (CVE-2017-3140, CVE-2017-3141)
- p7zip updated (CVE-2016-9296)
- openssl updated to version 1.0.2l
- web/ca-bundle updated to include OmniOSce Certificate Authority certificate

Our work does not stop here though. First we are committed to quickly releasing updates for r151022 as the need arises. We are also working towards releasing r151024 on schedule. To that end, we have already updated the bloody environment with all the latest goodies from upstream illumos and joyent-lx repositories.


OmniOS community edition hosts its sources on
[github.com/omniosorg](https://github.com/omniosorg/) and if you want to get in touch, you can find us on
[gitter.im/omniosorg](https://gitter.im/omniosorg/Lobby).


## Release Schedule

The intention is for new stable releases to continue to come out every 26 weeks. Interim, "weekly" updates to stable follow a fixed schedule denoted by letters, one per week. Weekly releases are made as needed, so there may not be a release each week. The first release of a new stable version is synonymous with weekly release "a", though the letter is not used.

During the intervals between stable releases, Bloody moves forward rapidly, picking up changes from upstream illumos-gate and illumos-joyent as well as updating various userland packages. In general, upstream merges will be performed on a Thursday/Friday each week and weekly releases will be published on a Monday.

Bloody releases will be published on an ad-hoc basis but may be as frequent as every week.

Security fixes are excluded from the schedule and handled with priority as they occur.



## How to Upgrade

All OmniOS packages are signed and the pkg installer is configured to only allow trusted sources for the core packages. In order to upgrade to the new OmniOS community edition, you have to let your box know that the updates will be coming from a new trusted source. This means you will have to import our CA certificate into your system.


1. Get a copy of the new certificate

    ```
    # /usr/bin/wget -P /etc/ssl/pkg \
        https://downloads.omniosce.org/ssl/omniosce-ca.cert.pem
    ```

2. Check the certificate fingerprint

    ```
    # /usr/bin/openssl x509 -fingerprint \
        -in /etc/ssl/pkg/omniosce-ca.cert.pem -noout
    ```

    you should see `8D:CD:F9:D0:76:CD:AF:C1:62:AF:89:51:AF:8A:0E:35:24:4C:66:6D`


3. Change the publisher to our new repo

    ```
    # /usr/bin/pkg set-publisher -P \
       -G https://pkg.omniti.com/omnios/r151022/ \
       -g https://pkg.omniosce.org/r151022/core/ omnios
    ```

4. For each native zone (if you have any), run

    ```
    # /usr/bin/pkg -R <zone_root> set-publisher -P \
       -G https://pkg.omniti.com/omnios/r151022/ \
       -g https://pkg.omniosce.org/r151022/core/ omnios
    ```

    (get a list of all your zones by running `zoneadm list -cv` for the `<zone_root>`, add `/root` to the PATH given in the list.)


5. Install the new ca-bundle containing our new CA

    ```
    # /usr/bin/pkg update -rv web/ca-bundle
    ```

6. Remove the CA file imported by hand

    ```
    # rm /etc/ssl/pkg/omniosce-ca.cert.pem
    ```

7. Finally update as usual

    ```
    # /usr/bin/pkg update -rv
    ```

## About OmniOS Community Edition Association

OmniOS Community Edition Association (OmniOSce) is a Swiss association, dedicated to the continued support and release of OmniOS for the benefit of all parties involved. The board of OmniOSce controls access to the OmniOS CA. Current board members are: Tobias Oetiker (President), Andy Fiddaman (Development), Dominik Hassler (Treasurer).

## About Citrus-IT

Citrus IT is a UK company that provides a managed email service platform to companies around the world. For many years they ran their systems on Solaris with SPARC hardware but transitioned to OmniOS in 2012.
[www.citrus-it.net](https://www.citrus-it.net)

## About OETIKER+PARTNER AG

OETIKER+PARTNER is a Swiss system management and software development company. Employees from O+P are involved in many Open Source Software projects. O+P runs most of their server hardware on OmniOS.
[www.oetiker.ch](https://www.oetiker.ch)


Press inquiries to [info@omniosce.org](mailto:info@omniosce.org)

Published July 12, 2017

OmniOSce, Aarweg 17, 4600 Olten, Switzerland
