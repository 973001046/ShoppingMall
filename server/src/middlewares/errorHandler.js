const logger = require('../utils/logger');
const ResponseUtil = require('../utils/response');

/**
 * 错误处理中间件
 */
async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    logger.error('请求错误', {
      url: ctx.url,
      method: ctx.method,
      error: err.message,
      stack: err.stack
    });

    // 设置状态码
    const status = err.status || err.statusCode || 500;
    ctx.status = status;

    // 返回错误响应
    ResponseUtil.error(ctx, err.message || '服务器内部错误', status, status);
  }
}

module.exports = errorHandler;
