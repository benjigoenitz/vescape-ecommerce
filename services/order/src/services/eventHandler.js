const { addProductToCart } = require('./orderService');

// eslint-disable-next-line consistent-return
async function handleEvents(message) {
  const { event, data } = message;

  switch (event) {
  case 'ADD_TO_CART':
    await addProductToCart(data);
    break;
  default:
    break;
  }
}

module.exports = {
  handleEvents
};
