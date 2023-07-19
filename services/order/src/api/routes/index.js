const express = require('express');
const OrderController = require('../controllers/order');
const { authenticated } = require('../middleware/auth');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/', authenticated, OrderController.placerOrder);

module.exports = router;
