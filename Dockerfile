FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh

ENV TIME_ZONE=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone


##VOLUME /datahub/src/main/webapp/
#ADD ./webapp /datahub/src/main/webapp
RUN sed -i "1i deb http://mirrors.aliyun.com/debian wheezy main contrib non-free" /etc/apt/sources.list
RUN sed -i "2i deb-src http://mirrors.aliyun.com/debian wheezy main contrib non-free" /etc/apt/sources.list 
RUN sed -i "3i deb http://mirrors.aliyun.com/debian wheezy-updates main contrib non-free" /etc/apt/sources.list 
RUN sed -i "4i deb-src http://mirrors.aliyun.com/debian wheezy-updates main contrib non-free" /etc/apt/sources.list 
RUN sed -i "5i deb http://mirrors.aliyun.com/debian-security wheezy/updates main contrib non-free" /etc/apt/sources.list
RUN sed -i "6i deb-src http://mirrors.aliyun.com/debian-security wheezy/updates main contrib non-free" /etc/apt/sources.list
RUN apt-get update && apt-get -y install nodejs npm && npm install -g fis3
RUN ln -s /usr/bin/nodejs /usr/sbin/node
RUN mkdir -p /datahub/raw/main/webapp
ADD ./webapp /datahub/raw/main/webapp
WORKDIR /datahub/raw/main/webapp
RUN fis3 release -d /datahub/src/main/webapp

RUN mkdir -p /etc/nginx/sslkey

CMD ["/start.sh"]
#ENTRYPOINT ["/start.sh"]
