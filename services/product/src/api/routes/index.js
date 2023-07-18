const express = require('express');
const UserController = require('../controllers/user');
const { authenticated } = require('../middleware/auth');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.get('/profile', authenticated, UserController.profile);

module.exports = router;
