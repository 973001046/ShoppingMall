const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const logger = require('./utils/logger');
const { testConnection, sequelize } = require('./models');

const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/logger');
const corsMiddleware = require('./middlewares/cors');

// 导入路由
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');

/**
 * 创建Koa应用
 */
function createApp(serviceType = 'client') {
  const app = new Koa();

  // 错误处理（在最前面）
  app.use(errorHandler);

  // 请求日志
  if (config.isDev) {
    app.use(requestLogger);
  }

  // CORS
  app.use(corsMiddleware(serviceType));

  // 请求体解析
  app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '10mb',
    formLimit: '10mb'
  }));

  // 挂载路由
  if (serviceType === 'client') {
    app.use(clientRoutes.routes());
    app.use(clientRoutes.allowedMethods());
  } else {
    app.use(adminRoutes.routes());
    app.use(adminRoutes.allowedMethods());
  }

  // 404处理
  app.use(async (ctx) => {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: `未找到接口: ${ctx.method} ${ctx.url}`,
      timestamp: Date.now()
    };
  });

  return app;
}

/**
 * 启动服务
 */
async function startServer() {
  // 获取启动的服务类型
  const serviceType = process.env.SERVICE || 'client';

  if (!['client', 'admin'].includes(serviceType)) {
    logger.error(`未知的服务类型: ${serviceType}`);
    process.exit(1);
  }

  // 测试数据库连接
  await testConnection();

  // 同步数据库模型（开发环境）
  if (config.isDev) {
    await sequelize.sync({ alter: true });
    logger.info('数据库模型已同步');
  }

  // 创建应用
  const app = createApp(serviceType);
  const port = config.ports[serviceType];

  // 启动监听
  app.listen(port, () => {
    logger.info(`${serviceType === 'client' ? 'C端' : 'B端'}服务启动成功`, {
      port,
      environment: config.env
    });
  });

  // 优雅退出
  process.on('SIGTERM', () => {
    logger.info('收到SIGTERM信号，准备关闭服务');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('收到SIGINT信号，准备关闭服务');
    process.exit(0);
  });
}

// 启动服务
// startServer().catch(err => {
//   logger.error('服务启动失败', err);
//   process.exit(1);
// });

console.log(process.env);