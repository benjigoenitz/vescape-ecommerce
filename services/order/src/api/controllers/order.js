const createError = require('http-errors');
const utils = require('../helpers/utils');
const Order = require('../models/order');
const Cart = require('../models/cart');
const OrderLine = require('../models/orderLine');
const db = require('../../db/database');

async function placerOrder(req, res, next) {
  try {
    const { userId } = req.payload;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart || !cart.products || cart.products.length === 0) {
      throw createError.NotFound('No items in cart');
    }

    const products = cart.products;
    const amount = products.reduce((acc, curr) => acc + Number(curr.price), 0);

    const transaction = await db.transaction();

    let order;

    try {
      order = await Order.create({
        userId,
        amount,
        ...products
      }, {
        transaction
      });

      for (const product of products) {
        await OrderLine.create({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: 1,
          price: product.price
        }, {
          transaction
        });
      }

      cart.products = [];

      await cart.save({ transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    res.status(201).send(utils.formatData(order));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  placerOrder
};
