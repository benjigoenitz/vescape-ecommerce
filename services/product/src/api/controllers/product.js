const createError = require('http-errors');
const utils = require('../helpers/utils');
const { createProductSchema, updateProductSchema } = require('../helpers/validation');
const Product = require('../models/product');

async function createProduct(req, res, next) {
  try {
    const { name, description, price } = await createProductSchema.validateAsync(req.body);

    const existingProduct = await Product.findOne({ where: { name } });

    if (existingProduct) {
      throw createError.Conflict(`${name} is already registered`);
    }

    const product = await Product.create({
      name,
      description,
      price
    });

    res.status(201).send(utils.formatData(product));
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, isAvailable } = await updateProductSchema.validateAsync(req.body);

    const existingProduct = await Product.findOne({ where: { id } });

    if (!existingProduct) {
      throw createError.NotFound('Product not found');
    }

    if (name) {
      existingProduct.name = name;
    }

    if (description) {
      existingProduct.description = description;
    }

    if (price) {
      existingProduct.price = price;
    }

    if ( typeof isAvailable === 'boolean') {
      existingProduct.isAvailable = isAvailable;
    }

    await existingProduct.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll({ raw: true });

    res.send(utils.formatData(products));
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id }, raw: true });

    if (!product) {
      throw createError.NotFound('Product not found');
    }

    res.send(utils.formatData(product));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProductById
};
