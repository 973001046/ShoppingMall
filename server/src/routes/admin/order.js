const Router = require('koa-router');
const { Op } = require('sequelize');
const { Order, OrderItem, User } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/order' });

// 所有订单管理接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取订单列表
 * GET /order/list
 */
router.get('/list', async (ctx) => {
  const {
    orderNo,
    status,
    userId,
    startTime,
    endTime,
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc'
  } = ctx.query;

  const where = {};

  if (orderNo) {
    where.orderNo = { [Op.like]: `%${orderNo}%` };
  }

  if (status !== undefined && status !== '') {
    where.status = parseInt(status);
  }

  if (userId) {
    where.userId = userId;
  }

  if (startTime && endTime) {
    where.createdAt = {
      [Op.between]: [new Date(startTime), new Date(endTime)]
    };
  }

  const offset = (page - 1) * pageSize;
  const order = [[sortField, sortOrder]];

  try {
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: User,
          attributes: ['id', 'nickname', 'phone']
        }
      ],
      order,
      offset: parseInt(offset),
      limit: parseInt(pageSize)
    });

    ResponseUtil.page(ctx, rows, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total: count
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 获取订单详情
 * GET /order/detail/:id
 */
router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: User,
          attributes: ['id', 'nickname', 'phone', 'avatar']
        }
      ]
    });

    if (!order) {
      ResponseUtil.notFound(ctx, '订单不存在');
      return;
    }

    ResponseUtil.success(ctx, order);
  } catch (error) {
    throw error;
  }
});

/**
 * 发货
 * POST /order/ship/:id
 */
router.post('/ship/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      ResponseUtil.notFound(ctx, '订单不存在');
      return;
    }

    if (order.status !== 1) {
      ResponseUtil.badRequest(ctx, '订单状态不允许发货');
      return;
    }

    await order.update({
      status: 2,
      shipTime: new Date()
    });

    ResponseUtil.success(ctx, null, '发货成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新订单状态
 * PUT /order/status/:id
 */
router.put('/status/:id', async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;

  try {
    const order = await Order.findByPk(id);

    if (!order) {
      ResponseUtil.notFound(ctx, '订单不存在');
      return;
    }

    await order.update({ status });

    ResponseUtil.success(ctx, null, '状态更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 订单统计
 * GET /order/statistics
 */
router.get('/statistics', async (ctx) => {
  try {
    const { sequelize } = require('../../models');

    // 各状态订单数量
    const statusCounts = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // 今日订单
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Order.count({
      where: {
        createdAt: { [Op.gte]: today }
      }
    });

    // 今日销售额
    const todayAmount = await Order.sum('payAmount', {
      where: {
        createdAt: { [Op.gte]: today },
        status: { [Op.in]: [1, 2, 3, 4] }
      }
    }) || 0;

    ResponseUtil.success(ctx, {
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.get('count'));
        return acc;
      }, {}),
      todayCount,
      todayAmount
    });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
