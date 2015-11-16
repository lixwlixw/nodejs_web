FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
VOLUME /datahub/src/main/webapp/
ADD . /datahub/src/main/webapp/
