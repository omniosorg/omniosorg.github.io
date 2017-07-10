# Setup Notes for the OmniOSce Repo Server

## Setting Up the Repo Servers

```bash
port=10000
for release in r151022 bloody; do
    for arch in core extra staging; do
        if [ $arch = staging  -a $release = bloody ]; then
           continue
        fi
        ((port++))
        pub=omnios
        collection=core
        if [ $arch = extra ]; then
           pub=omnios-extra
           collection=supplemental
        fi
	pkgrepo create /pkg/$release/$arch
	pkgrepo set -s /pkg/$release/$arch publisher/prefix=$pub
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/collection_type=core
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/description="IPS Packages for OmniOS $release $arch"
	pkgrepo set -s /pkg/$release/$arch -p $pub repository/name="OmniOS $release $arch"
	svccfg -s pkg/server add ${release}_$arch
	svccfg -s pkg/server:${release}_$arch addpg pkg application
	svccfg -s pkg/server:${release}_$arch setprop pkg/inst_root = /pkg/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/content_root = /pkg/content_root
	svccfg -s pkg/server:${release}_$arch setprop pkg/threads = 1200
	
	svccfg -s pkg/server:${release}_$arch setprop pkg/port = $port
	svccfg -s pkg/server:${release}_$arch setprop pkg/proxy_base = https://pkg.omniosce.org/$release/$arch
	svccfg -s pkg/server:${release}_$arch setprop pkg/address = 127.0.0.1
	svcadm enable  pkg/server:${release}_$arch
	svcadm restart  pkg/server:${release}_$arch
    done
done
```

## Nginx Config

```
worker_processes  4;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 10000;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 200M;

        ##
    # SSL Settings
    ##

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS:!DES-CBC3-SHA';
    ssl_dhparam /etc/ssl/private/dhparam.pem;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    add_header Strict-Transport-Security max-age=15768000;
    ssl_stapling on; ssl_stapling_verify on;

    server {
        listen 80 ;
        listen [::]:80 ;
        server_name _;
        location ^~ /.well-known {
            allow all;
            alias /var/www/html/.well-known;
        }
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name pkg.omniosce.org;
        
        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;
        # ssl_client_certificate /etc/ssl/certs/omniosce-client-ca.pem
        # ssl_verify_client optional
        set $auth_and_method "$ssl_client_verify$request_method";

        location /r151022/core {
            if ($auth_and_method ~ "FAILED.+(POST|PUT|DELETE)"){
		return 404;
	    }
            proxy_pass http://127.0.0.1:10001/;
        }

        location /r151022/extra {
            if ($auth_and_method ~ "FAILED.+(POST|PUT|DELETE)"){
		return 404;
	    }
            proxy_pass http://127.0.0.1:10002/;
        }

                
        location /r151022/staging {
            if ($auth_and_method ~ "FAILED.+(POST|PUT|DELETE)"){
                return 404;
            }
            proxy_pass http://127.0.0.1:10003/;
        }

        location /bloody/core {
            if ($auth_and_method ~ "FAILED.+(POST|PUT|DELETE)"){
                return 404;
            }
            proxy_pass http://127.0.0.1:10004/;
        }
        
        location /bloody/extra {
            if ($auth_and_method ~ "FAILED.+(POST|PUT|DELETE)"){
                return 404;
            }
            proxy_pass http://127.0.0.1:10005/;
        }
        location /r151022 {
            return 301 https://$host/r151022/core;
        }
        location /bloody {
            return 301 https://$host/bloody/core;
        }
        location / {
            return 301 https://$host/r151022/core;
        }
    }
    server {
        listen       443 ssl;
        server_name mirrors.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;
        location / {
            root /mirrors;
            autoindex on;
        }
    }
   server {
        listen       443 ssl;
        server_name downloads.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;
        location / {
            root /downloads;
            autoindex on;
        }
    }

    server {
        listen       443 ssl;
        server_name crl.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;
        location / {
            root /downloads/crl;
        }
    }
}
```

## Setup OmniOS CA

```bash
mkdir ca
cd ca
mkdir certs crl newcerts private
chmod 700 private
touch index.txt
echo 1000 > serial
```

omniosce-ca.cnf:
```
[ ca ]
default_ca = CA_default

[ CA_default ]
# Directory and file locations.
dir               = /path-to/omniosce-ca
certs             = $dir/certs
crl_dir           = $dir/crl
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
RANDFILE          = $dir/private/.rand

# The root key and root certificate.
private_key       = $dir/private/ca.key.pem
certificate       = $dir/certs/ca.cert.pem

# For certificate revocation lists.
crlnumber         = $dir/crlnumber
crl               = $dir/crl/ca.crl.pem
crl_extensions    = crl_ext
default_crl_days  = 30

# SHA-1 is deprecated, so use SHA-2 instead.
default_md        = sha256

name_opt          = ca_default
cert_opt          = ca_default
default_days      = 375
preserve          = no
policy            = policy_loose

[ policy_loose ]
countryName             = supplied
stateOrProvinceName     = optional
localityName            = supplied
organizationName        = supplied
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = supplied

[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
string_mask         = utf8only
default_md          = sha256
x509_extensions     = omniosce_ca

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
stateOrProvinceName             = State or Province Name
localityName                    = Locality Name
0.organizationName              = Organization Name
organizationalUnitName          = Organizational Unit Name
commonName                      = Common Name
emailAddress                    = Email Address

# Optionally, specify some defaults.
countryName_default             = GB
stateOrProvinceName_default     = 
localityName_default            =
0.organizationName_default      = OmniOSce or MyCompany
emailAddress			= github-id@omniosce.org or me@mycompany.com

[ omniosce_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
crlDistributionPoints = URI:https://crl.omniosce.org/root.crl
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ ips_cert ]
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = digitalSignature
extendedKeyUsage = codeSigning
```

edit this to change the dir= line to the ca location

```bash
openssl genrsa -aes256 -out private/ca.key.pem 4096
```
enter passphrase when prompted

```bash
openssl req -config omniosce-ca.cnf -key private/ca.key.pem \
        -new -x509 -days 7300 -sha256 -extensions omniosce_ca \
        -out certs/ca.cert.pem
```

answer questions for information in request

```bash
chmod 444 certs/ca.cert.pem
```

## Create Cert for a Guardian

First the Guardian creates a CSR

```bash
wget https://downloads.omniosce.org/omniosce-ca.cnf
openssl genrsa -aes256 -out key.pem 2048
openssl req -config omniosce-ca.cnf \
        -key key.pem -new -sha256 -out csr.pem
```

and sends it to ca@ommniosce.org

The CA then sign the csr with:

```bash
openssl ca -config omniosce-ca.cnf \
        -extensions ips_cert -days 366 -notext \
        -md sha256 -in csr.pem
```

and send the certificate back.

## Acme Fetch Config

```json
{
    "GENERAL": {
        "ACMEstaging": "acme-staging.api.letsencrypt.org",
        "ACMEservice": "acme-v01.api.letsencrypt.org",
        "accountKeyPath": "/etc/ssl/private/letsencryptAccountKey.key"
    },
    "CERTS": [
        {
            "certOutput": "/etc/ssl/certs/acme-omniosce.org.pem",
            "certFormat": "PEM",
            "keyOutput": "/etc/ssl/private/acme-omniosce.org.key",
            "keyFormat": "PEM",
            "commonName": "pkg.omniosce.org",
            "SITES": {
                "pkg.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/",
                    },
                     "challengeHandler" : "LocalFile"
                },
                "mirrors.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/",
                    },
                    "challengeHandler" : "LocalFile"

                },
               "downloads.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/",
                    },
                    "challengeHandler" : "LocalFile"

                },

                "crl.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/",
                    },
                    "challengeHandler" : "LocalFile"

                }
            }
        }
    ]
}
```

## Userful Commands

Copy a Repo

```bash
pkgrecv -v -s https://pkg.omniti.com/omnios/r151023 -d /pkg/bloody/core -m all-timestamps '*'
```



