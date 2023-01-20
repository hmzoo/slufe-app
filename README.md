# slufe-app

## traefik

~~~bash
wget https://github.com/traefik/traefik/releases/download/v2.9.6/traefik_v2.9.6_linux_amd64.tar.gz
tar -zxf traefik_v2.9.6_linux_amd64.tar.gz

traefik traefik --configFile=traefik.yml
~~~


~~~bash
[entryPoints]
  [entryPoints.http]
  address = ":80"
  [entryPoints.https]
  address = ":443"
    [entryPoints.https.tls]
      [[entryPoints.https.tls.certificates]]
      certFile= /etc/ssl/certs/ssl-cert-snakeoil.pem
      keyFile= /etc/ssl/private/ssl-cert-snakeoil.key


~~~



