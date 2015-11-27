FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh

##VOLUME /datahub/src/main/webapp/
#ADD ./webapp /datahub/src/main/webapp
RUN apt-get update && apt-get -y install nodejs npm && npm install -g fis3
RUN mkdir -p /datahub/raw/main/webapp
ADD ./webapp /datahub/raw/main/webapp
WORKDIR /datahub/raw/main/webapp
RUN fis3 release -d /datahub/src/main/webapp

CMD ["/start.sh"]
#ENTRYPOINT ["/start.sh"]
