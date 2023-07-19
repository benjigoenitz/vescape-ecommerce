const Cart = require('../api/models/cart');

async function addProductToCart(data) {
  console.log('PRRO DATA');
  console.log(data);

  const [ cart ] = await Cart.findOrCreate({
    where: {
      userId: data.userId
    },
    defaults: {
      userId: data.userId,
      products: []
    }
  });

  cart.products = [ ...cart.products, data.product ];

  await cart.save();
}

module.exports = {
  addProductToCart
};
