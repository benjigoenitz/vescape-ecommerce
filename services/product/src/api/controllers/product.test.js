/* eslint-disable no-undef */
const productController = require('./product');
const utils = require('../helpers/utils');
const { createProductSchema, updateProductSchema } = require('../helpers/validation');
const Product = require('../models/product');

describe('Product Controller', () => {
  // fixtures
  const name = 'Playstation 5';
  const description = 'Sony Game Console';
  const price = 500;
  const isAvailable = true;
  const existingProduct = { id: 1, name, description, save: jest.fn() };
  const next = jest.fn();
  const body = { name, description, price };
  const req = { params: { id: 1 }, body };
  const res = { status: jest.fn(() => ({ send: jest.fn() })), send: jest.fn() };
  const joiError = { isJoi: true, status: 400, message: 'name is required' };

  describe('createProduct', () => {
    beforeEach(() => {
      jest.spyOn(createProductSchema, 'validateAsync').mockImplementation(() => {
        return { name, description, price, isAvailable };
      });
      jest.spyOn(Product, 'findOne').mockImplementation(() => null);
      jest.spyOn(Product, 'create').mockImplementation();
      jest.spyOn(utils, 'formatData').mockImplementation(() => ({ email, token }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next joi error if name is not present in request', async() => {
      jest.spyOn(createProductSchema, 'validateAsync').mockImplementation(() => {
        throw joiError;
      });

      await productController.createProduct(req, res, next);

      expect(createProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(0);
      expect(Product.create).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(400);
      expect(next.mock.calls[0][0].message).toEqual(joiError.message);
    });

    it('should next error 409 if product already exists', async() => {
      jest.spyOn(Product, 'findOne').mockImplementation(() => existingProduct);

      await productController.createProduct(req, res, next);

      expect(createProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(Product.create).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(409);
      expect(next.mock.calls[0][0].message).toEqual(`${name} is already registered`);
    });

    it('should next an error if Product.create throws an error', async() => {
      jest.spyOn(Product, 'create').mockImplementation(() => {
        throw new Error('test');
      });

      await productController.createProduct(req, res, next);

      expect(createProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(Product.create).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toEqual('test');
    });

    it('should return created product if there was no issue', async() => {
      await productController.createProduct(req, res, next);

      expect(createProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(Product.create).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      jest.spyOn(updateProductSchema, 'validateAsync').mockImplementation(() => {
        return { name, description, price, isAvailable };
      });
      jest.spyOn(Product, 'findOne').mockImplementation(() => existingProduct);
      jest.spyOn(existingProduct, 'save').mockImplementation();
      jest.spyOn(utils, 'formatData').mockImplementation(() => ({ email, token }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next error 404 if product does not exists', async() => {
      jest.spyOn(Product, 'findOne').mockImplementation(() => null);

      await productController.updateProduct(req, res, next);

      expect(updateProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(existingProduct.save).toHaveBeenCalledTimes(0);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].status).toEqual(404);
      expect(next.mock.calls[0][0].message).toEqual('Product not found');
    });

    it('should next an error if product.save throws an error', async() => {
      jest.spyOn(existingProduct, 'save').mockImplementation(() => {
        throw new Error('test');
      });

      await productController.updateProduct(req, res, next);

      expect(updateProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(existingProduct.save).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toEqual('test');
    });

    it('should return 204 code if there was no issue', async() => {

      await productController.updateProduct(req, res, next);

      expect(updateProductSchema.validateAsync).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(existingProduct.save).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('getProducts', () => {
    beforeEach(() => {
      jest.spyOn(Product, 'findAll').mockImplementation(() => existingProduct);
      jest.spyOn(utils, 'formatData').mockImplementation(() => {
        return { data: [ {  existingProduct } ] };
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next an error if Product.findAll throws an error', async() => {
      jest.spyOn(Product, 'findAll').mockImplementation(() => {
        throw new Error('test');
      });

      await productController.getProducts(req, res, next);

      expect(Product.findAll).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toEqual('test');
    });

    it('should return products if there was no issue', async() => {

      await productController.getProducts(req, res, next);

      expect(Product.findAll).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({ data: [ {  existingProduct } ] });
    });
  });

  describe('getProductById', () => {
    beforeEach(() => {
      jest.spyOn(Product, 'findOne').mockImplementation(() => existingProduct);
      jest.spyOn(utils, 'formatData').mockImplementation(() => {
        return { data: {  existingProduct } };
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should next an error if Product.findOne throws an error', async() => {
      jest.spyOn(Product, 'findOne').mockImplementation(() => {
        throw new Error('test');
      });

      await productController.getProductById(req, res, next);

      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(0);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0].message).toEqual('test');
    });

    it('should return product if there was no issue', async() => {

      await productController.getProductById(req, res, next);

      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(utils.formatData).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({ data: {  existingProduct } });
    });
  });
});

