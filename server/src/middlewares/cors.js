const config = require('../config');

/**
 * CORS中间件 - 根据服务类型设置不同的跨域配置
 */
function corsMiddleware(serviceType = 'client') {
  return async (ctx, next) => {
    const corsConfig = config.cors[serviceType];

    // 设置CORS头
    ctx.set('Access-Control-Allow-Origin', corsConfig.origin);
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    ctx.set('Access-Control-Allow-Credentials', corsConfig.credentials.toString());

    // 处理预检请求
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }

    await next();
  };
}

module.exports = corsMiddleware;
