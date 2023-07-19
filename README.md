# Vescape Ecommerce
##### *Author: David Barboza*

## Local Setup
To run this project on local dev environment follow next instructions: 
1. Clone github project
~~~~~ 
git clone https://github.com/benjigoenitz/vescape-ecommerce.git
~~~~~~
2. Install dependencies for gateway service
~~~~~ 
cd service/gateway
npm install 
~~~~~~
3. Start every single service
~~~~~ 
make dev service=user
make dev service=product
make dev service=order

cd service/gateway
npm run dev
~~~~~~
4. Inside each container start server in dev mode
~~~~~ 
$make dev
~~~~~~

Note: docker-compose (v1) and Node.js (v16) are necessary to build and run this project, also RabbitMQ is required, you can use docker to run a RabbitMQ instance or use an instance of RabbitMQ hosted elsewhere, the project is configured out of the box to work with a local instance with docker. Run the next command.
~~~~~ 
docker run -d --name amqp.test -p 5672:5672 rabbitmq
~~~~~~
