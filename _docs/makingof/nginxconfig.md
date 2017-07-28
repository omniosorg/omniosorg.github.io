---
title: Nginx for depotd
category: makingof
show_in_sidebar: true
---
# Setup of Nginx for pkg.omniosce.org

## Nginx Configuration

```
worker_processes 8;

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
    proxy_http_version 1.1;

    ##
    # SSL Settings
    ##

    # turn on for debuging
    #error_log /var/opt/ooce/nginx/log/error.log debug;

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
        ssl_client_certificate /archive/downloads/ssl/omniosce-ca.cert.pem;
        ssl_verify_client optional;

        # check if requested operation is authorised...
        set $authorised "false";
        if ($request_method ~ ^(?:GET|HEAD)$) {
            set $authorised "true";
        }
        if ($request_uri ~ ^/[^/]+/[^/]+/(?:open|abandon|add|close)/) {
            set $authorised "false";
        }
        if ($request_uri ~ ^/[^/]+/[^/]+/[^/]+/(?:admin)/) {
            set $authorised "false";
        }
        if ($ssl_client_verify = "SUCCESS") {
            set $authorised "true";
        }
        if ($authorised != "true") {
            return 403;
        }

        # global proxy settings
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_redirect off;
        proxy_buffering off;

        location /r151022/core {

            root /pkg/r151022/core;

            # serve files from local filesystem instead through pkg/server...
            location ~ ^/r151022/core/file/0/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }
            location ~ ^/r151022/core/omnios/file/1/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }

            # don't remove the first rewrite as it will rewrite uri w/ the non decoded version!
            rewrite ^ $request_uri;
            rewrite ^/r151022/core/?(.*) /$1 break;

            proxy_pass http://127.0.0.1:10001/$uri;
        }

        location /r151022/extra {

            root /pkg/r151022/extra;

            # serve files from local filesystem instead through pkg/server...
            location ~ ^/r151022/extra/file/0/(..)(.*)$ {
                try_files /publisher/extra.omnios/file/$1/$1$2 =404;
            }
            location ~ ^/r151022/extra/omnios/file/1/(..)(.*)$ {
                try_files /publisher/extra.omnios/file/$1/$1$2 =404;
            }

            # don't remove the first rewrite as it will rewrite uri w/ the non decoded version!
            rewrite ^ $request_uri;
            rewrite ^/r151022/extra/?(.*) /$1 break;

            proxy_pass http://127.0.0.1:10002/$uri;
        }

        location /r151022/staging {

            root /pkg/r151022/staging;

            # serve files from local filesystem instead through pkg/server...
            location ~ ^/r151022/staging/file/0/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }
            location ~ ^/r151022/staging/omnios/file/1/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }

            # don't remove the first rewrite as it will rewrite uri w/ the non decoded version!
            rewrite ^ $request_uri;
            rewrite ^/r151022/staging/?(.*) /$1 break;

            proxy_pass http://127.0.0.1:10003/$uri;
        }

        location /bloody/core {

            root /pkg/bloody/core;

            # serve files from local filesystem instead through pkg/server...
            location ~ ^/bloody/core/file/0/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }
            location ~ ^/bloody/core/omnios/file/1/(..)(.*)$ {
                try_files /publisher/omnios/file/$1/$1$2 =404;
            }

            # don't remove the first rewrite as it will rewrite uri w/ the non decoded version!
            rewrite ^ $request_uri;
            rewrite ^/bloody/core/?(.*) /$1 break;

            proxy_pass http://127.0.0.1:10004/$uri;
        }

        location /bloody/extra {

            root /pkg/bloody/extra;

            # serve files from local filesystem instead through pkg/server...
            location ~ ^/bloody/extra/file/0/(..)(.*)$ {
                try_files /publisher/extra.omnios/file/$1/$1$2 =404;
            }
            location ~ ^/bloody/extra/omnios/file/1/(..)(.*)$ {
                try_files /publisher/extra.omnios/file/$1/$1$2 =404;
            }

            # don't remove the first rewrite as it will rewrite uri w/ the non decoded version!
            rewrite ^ $request_uri;
            rewrite ^/bloody/extra/?(.*) /$1 break;

            proxy_pass http://127.0.0.1:10005/$uri;
        }

        location /r151022 {
            return 301 https://$host/r151022/core/;
        }

        location /bloody {
            return 301 https://$host/bloody/core/;
        }

        location / {
            return 404;
        }

    }

    server {
        listen 443 ssl;
        server_name mirrors.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;

        location / {
            root /archive/mirrors;
            autoindex on;
        }

    }

    server {
        listen 443 ssl;
        server_name downloads.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;

        location / {
            root /archive/downloads;
            autoindex on;
        }

    }

    server {
        listen 443 ssl;
        server_name crl.omniosce.org;

        ssl_certificate /etc/ssl/certs/acme-omniosce.org.pem;
        ssl_certificate_key /etc/ssl/private/acme-omniosce.org.key;

        location / {
            root /crl;
        }

    }
}

```

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
                        "www_root": "/var/www/html/"
                    },
                     "challengeHandler" : "LocalFile"
                },
                "mirrors.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/"
                    },
                    "challengeHandler" : "LocalFile"

                },
               "downloads.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/"
                    },
                    "challengeHandler" : "LocalFile"
                },
                "crl.omniosce.org": {
                    "challengeConfig": {
                        "www_root": "/var/www/html/"
                    },
                    "challengeHandler" : "LocalFile"
                }
            }
        }
    ]
}
```
