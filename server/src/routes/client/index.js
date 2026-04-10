const Router = require('koa-router');
const userRoutes = require('./user');
const productRoutes = require('./product');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const addressRoutes = require('./address');

const router = new Router({ prefix: '/api' });

// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    code: 200,
    message: 'Client API 服务正常运行',
    service: 'client',
    timestamp: Date.now()
  };
});

// 挂载各模块路由
router.use(userRoutes.routes());
router.use(productRoutes.routes());
router.use(cartRoutes.routes());
router.use(orderRoutes.routes());
router.use(addressRoutes.routes());

module.exports = router;
