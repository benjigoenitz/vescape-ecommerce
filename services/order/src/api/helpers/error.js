const createError = require('http-errors');

function notFoundHandler(req, res, next) {
  next(createError(404));
}

function format(error) {
  const formatted = {};

  if (error.isJoi) {
    formatted.status = 400;
    formatted.message = error.details[0].message;
  } else {
    formatted.status = error.status || 500;
    formatted.message = error.message || 'Internal Server Error';
  }

  return formatted;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const response = format(error);

  console.error(response);

  res.status(response.status);
  res.send(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
