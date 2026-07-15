const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  let log = `[${timestamp}] [${level}] ${message}`;
  if (data) {
    log += ` | ${JSON.stringify(data)}`;
  }
  return log;
};

const logger = {
  error: (message, data = null) => {
    console.error(formatLog(logLevels.ERROR, message, data));
  },
  warn: (message, data = null) => {
    console.warn(formatLog(logLevels.WARN, message, data));
  },
  info: (message, data = null) => {
    console.log(formatLog(logLevels.INFO, message, data));
  },
  debug: (message, data = null) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(formatLog(logLevels.DEBUG, message, data));
    }
  }
};

export default logger;
