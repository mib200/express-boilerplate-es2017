/* eslint-disable no-underscore-dangle */

const onFinished = require('on-finished');
const onHeaders = require('on-headers');
const { createLogger, format, transports } = require('winston');

const winstonLogger = createLogger({
  level: 'debug',
  timestamp: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  handleExceptions: true,
  exitOnError: false,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({
      filename: './logs/access.log',
      format: format.combine(format.printf(info => `${info.message}`)),
      timestamp: true,
      colorize: false,
      json: false,
    }),
  ],
});

/**
 * Array of CLF month names.
 * @private
 */

const CLF_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Get request IP address.
 *
 * @private
 * @param {IncomingMessage} req
 * @return {string}
 */

function getip(req) {
  return req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
}

/**
 * Pad number to two digits.
 *
 * @private
 * @param {number} num
 * @return {string}
 */

function pad2(num) {
  const str = String(num);

  return (str.length === 1 ? '0' : '') + str;
}

/**
 * Format a Date in the common log format.
 *
 * @private
 * @param {Date} dateTime
 * @return {string}
 */

function clfdate(dateTime) {
  const date = dateTime.getUTCDate();
  const hour = dateTime.getUTCHours();
  const mins = dateTime.getUTCMinutes();
  const secs = dateTime.getUTCSeconds();
  const year = dateTime.getUTCFullYear();

  const month = CLF_MONTH[dateTime.getUTCMonth()];

  return `${pad2(date)}/${month}/${year}:${pad2(hour)}:${pad2(mins)}:${pad2(secs)} +0000`;
}

/**
 * Record the start time.
 * @private
 */

function recordStartTime() {
  this._startAt = process.hrtime();
  this._startTime = new Date();
}

/**
 * Create a logger middleware.
 *
 * @public
 * @param {String|Function} format
 * @param {Object} [options]
 * @return {Function} middleware
 */

function loggerv2({ customLogger, options }) {
  const opts = options || {};

  // output on request instead of response
  const { immediate } = opts;

  return function logger(req, res, next) {
    // request data
    req._startAt = undefined;
    req._startTime = undefined;
    const remoteAddress = getip(req);
    const normalizedDate = clfdate(new Date());
    const requestMethod = req.method;
    const requestUrl = req.originalUrl || req.url;
    const requestUa = req.headers['user-agent'];
    // REQSTATUS^RESTIME^

    // response data
    res._startAt = undefined;
    res._startTime = undefined;

    function getResponseTimeToken(digits) {
      if (!req._startAt || !res._startAt) {
        // missing request and/or response start time
        return undefined;
      }

      // calculate diff
      const ms = (res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6;

      // return truncated value
      return ms.toFixed(digits === undefined ? 3 : digits);
    }

    function logRequest() {
      const responseStatus = res._header.split('\r\n')[0].split(' ');
      const responseHttpVersion = responseStatus[0];
      const responseStatusCode = responseStatus[1];
      const responseTime = getResponseTimeToken();

      // format function
      // const Logger = typeof customLogger !== 'function' ? console.log : customLogger;
      // console.warn(Logger);
      // winstonLogger.info(formatMessage(message));
      winstonLogger.info(
        `${remoteAddress}^${normalizedDate}^${requestMethod}^${requestUrl}^${responseHttpVersion}^${responseStatusCode}^${responseTime}^${requestUa}`,
      );
    }

    // record request start
    recordStartTime.call(req);

    if (immediate) {
      // immediate log
      logRequest();
    } else {
      // record response start
      onHeaders(res, recordStartTime);

      // log when response finished
      onFinished(res, logRequest);
    }

    next();
  };
}

module.exports = loggerv2;
