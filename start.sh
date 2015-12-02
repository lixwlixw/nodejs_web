#!/bin/bash

sed -i 's/#API_PORT#/'$API_PORT'/g' /etc/nginx/nginx.conf
sed -i 's/#API_SERVER#/'$API_SERVER'/g' /etc/nginx/nginx.conf

sed -i 's/#DOC_PORT#/'$DOC_PORT'/g' /etc/nginx/nginx.conf
sed -i 's/#DOC_SERVER#/'$DOC_SERVER'/g' /etc/nginx/nginx.conf

nginx -g "daemon off;"
