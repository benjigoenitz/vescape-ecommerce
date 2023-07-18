const express = require('express');
const logger = require('morgan');
const { notFoundHandler, errorHandler } = require('./api/helpers/error');
const routes = require('./api/routes');

const app = express();
const port = process.env.API_PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
})
  .on('error', (err) => {
    console.log(err);
    /* eslint no-process-exit: 0 */
    process.exit();
  });
