FROM node:16.14.0

RUN apt-get update
RUN apt-get install -y postgresql-client jq

RUN mkdir /var/lib/order-service
RUN npm i -g nodemon

WORKDIR /var/lib/order-service

COPY ./services/order/src/package*.json /var/lib/order-service/
WORKDIR /var/lib/order-service
RUN npm ci

COPY ./services/order/src /var/lib/order-service/
COPY ./services/order/scripts /home/docker/

# COPY ./scripts/* /usr/local/bin

EXPOSE 80

RUN chmod +x /home/docker/startup.sh
RUN chmod +x /home/docker/startup.dev.sh

ENTRYPOINT ["/home/docker/startup.sh"]
