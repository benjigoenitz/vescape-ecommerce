const amqplib = require('amqplib');

(async() => {
  const queue = 'ECOMMERCE';
  const conn = await amqplib.connect('amqp://localhost');

  const ch1 = await conn.createChannel();

  await ch1.assertQueue(queue);

  // Listener
  // ch1.consume(queue, (msg) => {
  //   if (msg !== null) {
  //     console.log('Recieved:', msg.content.toString());
  //     ch1.ack(msg);
  //   } else {
  //     console.log('Consumer cancelled by server');
  //   }
  // });

  // Sender
  const ch2 = await conn.createChannel();

  setInterval(() => {
    // ch2.sendToQueue(queue, Buffer.from('something to do'));
    ch2.publish(queue, 'PRODUCT_SERVICE', Buffer.from('something to do'));
  }, 1000);
})();
