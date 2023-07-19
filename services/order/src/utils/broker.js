const amqplib = require('amqplib');
const config = require('../config/config');
const { handleEvents } = require('../services/eventHandler');

async function createChannel() {
  const conn = await amqplib.connect(config.AMPQ_HOST);
  const channel = await conn.createChannel();

  await channel.assertQueue(config.AMPQ_QUEUE, { durable: true });

  return channel;
}

async function startChannel() {
  const channel = await createChannel();

  channel.assertExchange(config.AMPQ_QUEUE, 'direct', { durable: true });
  const q = await channel.assertQueue('', { exclusive: true });

  channel.bindQueue(q.queue, config.AMPQ_QUEUE, config.PRODUCT_SERVICE);

  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const message = msg.content.toString();

      console.log('Recieved:', message);
      handleEvents(JSON.parse(message));
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
}

async function publishToChannel(service, data) {
  const channel = await createChannel();

  channel.publish(config.AMPQ_QUEUE, service, Buffer.from(data));
  console.log('Sent:', data);
  channel.close();
}

module.exports = {
  startChannel,
  publishToChannel
};

