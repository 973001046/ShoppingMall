const config = require('../config');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = LOG_LEVELS[config.logLevel] || 2;

function log(level, message, meta = {}) {
  const levelValue = LOG_LEVELS[level];
  if (levelValue > currentLevel) return;

  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...meta
  };

  if (config.isDev) {
    const colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      debug: '\x1b[35m'
    };
    console.log(`${colors[level]}[${timestamp}] [${level.toUpperCase()}] ${message}\x1b[0m`);
    if (Object.keys(meta).length > 0) {
      console.log('Meta:', meta);
    }
  } else {
    console.log(JSON.stringify(logData));
  }
}

module.exports = {
  error: (msg, meta) => log('error', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta)
};
