#!/bin/sh

sed -i 's/#API_PORT#/'$API_PORT'/g' /etc/nginx/nginx.conf
sed -i 's/#API_SERVER#/'$API_SERVER'/g' /etc/nginx/nginx.conf

nginx -g "daemon off;"
