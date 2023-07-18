FROM node:16.14.0

RUN apt-get update
RUN apt-get install -y postgresql-client jq

RUN mkdir /var/lib/product-service
RUN npm i -g nodemon

WORKDIR /var/lib/product-service

COPY ./services/product/src/package*.json /var/lib/product-service/
WORKDIR /var/lib/product-service
RUN npm ci

COPY ./services/product/src /var/lib/product-service/
COPY ./services/product/scripts /home/docker/

# COPY ./scripts/* /usr/local/bin

EXPOSE 80

RUN chmod +x /home/docker/startup.sh
RUN chmod +x /home/docker/startup.dev.sh

ENTRYPOINT ["/home/docker/startup.sh"]
