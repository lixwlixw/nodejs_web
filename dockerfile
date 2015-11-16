FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
volume /datahub/src/main/webapp/recom
