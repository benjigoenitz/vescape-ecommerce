FROM node:16.14.0

RUN apt-get update
RUN apt-get install -y postgresql-client jq

RUN mkdir /var/lib/user-service
RUN npm i -g nodemon

WORKDIR /var/lib/user-service

COPY ./services/user/src/package*.json /var/lib/user-service/
WORKDIR /var/lib/user-service
RUN npm ci

COPY ./services/user/src /var/lib/user-service/
COPY ./services/user/scripts /home/docker/

# COPY ./scripts/* /usr/local/bin

EXPOSE 80

RUN chmod +x /home/docker/startup.sh
RUN chmod +x /home/docker/startup.dev.sh

ENTRYPOINT ["/home/docker/startup.sh"]
