FROM node:10.15.1-slim

LABEL maintainer='Penguin Juo '

ADD . /var/www
WORKDIR /var/www

RUN ln -sf /usr/share/zoneinfo/Asia/Taipei  /etc/localtime \
    && echo 'deb http://ftp.tw.debian.org/debian/ jessie main' > /etc/apt/sources.list \
#install
    && mv .env.example .env \
    && npm install --production --unsafe-perm \
    && npm rebuild node-sass \
    && npm run build \
    && cp docker-entrypoint.sh /entrypoint.sh \
    && echo "Run End"

EXPOSE 3010

ENTRYPOINT ["sh","/entrypoint.sh"]

CMD ["npm", "start"]