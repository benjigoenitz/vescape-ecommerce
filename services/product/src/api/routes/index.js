const express = require('express');
const ProductController = require('../controllers/product');
const { authenticated, authorized } = require('../middleware/auth');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/', authenticated, authorized, ProductController.createProduct);
router.put('/:id', authenticated, authorized, ProductController.updateProduct);
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.put('/:id/cart', authenticated, ProductController.addProductToCart);

module.exports = router;
