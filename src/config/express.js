const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mkdirp = require('mkdirp');
const routes = require('../api/routes/v1');
// const { logs } = require('./vars');
const error = require('../api/middlewares/error');
const { logger: Logger, winstonLogger: winston } = require('../api/middlewares/logger');
const loggerv2 = require('../api/middlewares/loggerv2');

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
const createFolder = foldername => {
  mkdirp(foldername, err => {
    if (err) {
      Logger.error(err);
    }
  });
};
// initialize log folder
createFolder('./logs');
Logger.info(`Server ready`);
app.use(loggerv2({ customLogger: winston }));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api v1 routes
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
// app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
// app.use(error.handler);

module.exports = app;
