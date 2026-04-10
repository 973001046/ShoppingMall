const logger = require('../utils/logger');

/**
 * 请求日志中间件
 */
async function requestLogger(ctx, next) {
  const start = Date.now();

  logger.info('开始请求', {
    method: ctx.method,
    url: ctx.url,
    query: ctx.query,
    ip: ctx.ip
  });

  await next();

  const duration = Date.now() - start;

  logger.info('请求完成', {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration: `${duration}ms`
  });
}

module.exports = requestLogger;
