// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');
const app = require('./config/express');
const { logger: Logger } = require('./api/middlewares/logger');

// listen to requests
app.listen(port, () => Logger.info(`server started on port ${port} (${env})`));

module.exports = app;
