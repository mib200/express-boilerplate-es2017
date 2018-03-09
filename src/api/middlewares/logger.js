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
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({
      filename: './logs/app.log',
      format: format.combine(format.timestamp(), format.printf(info => JSON.stringify(info))),
    }),
    // new transports.Console({
    //   level: 'debug',
    //   handleExceptions: true,
    //   json: false,
    //   colorize: true,
    //   timestamp: true,
    // }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.timestamp(), format.printf(info => `[x] ${info.timestamp} ${info.level}: ${info.message}`)),
      colorize: true,
      timestamp: true,
      json: false,
    }),
  );
}

// winstonLogger.stream = {
//   write(message) {
//     winstonLogger.info(message);
//   },
// };

// Wrap Winston logger to print reqId in each log
const formatMessage = message => message;

const logger = {
  log(level, message) {
    winstonLogger.log(level, formatMessage(message));
  },
  error(message) {
    winstonLogger.error(formatMessage(message));
  },
  warn(message) {
    winstonLogger.warn(formatMessage(message));
  },
  verbose(message) {
    winstonLogger.verbose(formatMessage(message));
  },
  info(message) {
    winstonLogger.info(formatMessage(message));
  },
  debug(message) {
    winstonLogger.debug(formatMessage(message));
  },
  silly(message) {
    winstonLogger.silly(formatMessage(message));
  },
};

module.exports = { logger, winstonLogger };
