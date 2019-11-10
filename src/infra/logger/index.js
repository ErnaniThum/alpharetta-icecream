const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const defaultLogPath = `./logs`;
const defaultLogLevel = `info`;
const logPath = process.env.LOG_PATH || defaultLogPath;
const levels = winston.config.npm.levels; // default;

const levelExists = Object.prototype.hasOwnProperty.call(
    winston.config.npm.levels,
    process.env.LOG_LEVEL,
);

const level = levelExists ? process.env.LOG_LEVEL : defaultLogLevel;

const dailyRotateFile = new winston.transports.DailyRotateFile({
  filename: path.join(logPath, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
});

const logger = winston.createLogger({
  level,
  levels,
  transports: [
    dailyRotateFile,
  ],
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}]: ${info.message}`;
      }),
  ),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    colorize: true,
  }));
}

logger.stream = {
  write: function(message) {
  //  Morgan JS adds an extra \n to the end of each log. Removing it.
    logger.info(message.split('\n')[0]);
  },
};

if (!levelExists) {
  logger.warn(`LOG_LEVEL not defined or invalid, using default:
  ${defaultLogLevel}`);
}

module.exports = logger;
