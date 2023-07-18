const createError = require('http-errors');
const jwt = require('jsonwebtoken');
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

module.exports = {
  authenticated
};
