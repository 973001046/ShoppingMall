const Router = require('koa-router');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const productRoutes = require('./product');
const orderRoutes = require('./order');
const categoryRoutes = require('./category');
const roleRoutes = require('./role');
const dashboardRoutes = require('./dashboard');

const router = new Router({ prefix: '/api' });

// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    code: 200,
    message: 'Admin API 服务正常运行',
    service: 'admin',
    timestamp: Date.now()
  };
});

// 挂载各模块路由
router.use(authRoutes.routes());
router.use(userRoutes.routes());
router.use(productRoutes.routes());
router.use(orderRoutes.routes());
router.use(categoryRoutes.routes());
router.use(roleRoutes.routes());
router.use(dashboardRoutes.routes());

module.exports = router;
