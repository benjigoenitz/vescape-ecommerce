const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../../config/config');

// eslint-disable-next-line consistent-return
function authenticated(req, res, next) {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized());
  }

  const token = req.headers.authorization.split(' ').pop();

  jwt.verify(token, JWT_SECRET, async(err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;

      return next(createError.Unauthorized(message));
    }

    req.payload = payload;
    return next();
  });
}

async function authorized(req, res, next) {
  const { email } = req.params;
  const user = await User.findOne({ where: { email } });

  if (user.role === 'admin') {
    next();
  } else {
    next(createError.Unauthorized());
  }
}

module.exports = {
  authenticated,
  authorized
};
