const Router = require('koa-router');
const { Op } = require('sequelize');
const { User, Product, Order, OrderItem } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/dashboard' });

// 所有仪表盘接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取仪表盘统计数据
 * GET /dashboard/statistics
 */
router.get('/statistics', async (ctx) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 用户统计
    const userTotal = await User.count();
    const userToday = await User.count({
      where: { createdAt: { [Op.gte]: today } }
    });
    const userYesterday = await User.count({
      where: {
        createdAt: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });

    // 商品统计
    const productTotal = await Product.count();
    const productOnSale = await Product.count({ where: { status: 1 } });
    const productOffSale = await Product.count({ where: { status: 0 } });

    // 订单统计
    const orderTotal = await Order.count();
    const orderToday = await Order.count({
      where: { createdAt: { [Op.gte]: today } }
    });
    const orderPending = await Order.count({ where: { status: 0 } }); // 待付款
    const orderPaid = await Order.count({ where: { status: 1 } }); // 待发货
    const orderShipped = await Order.count({ where: { status: 2 } }); // 待收货

    // 销售额统计
    const salesTotal = await Order.sum('payAmount', {
      where: { status: { [Op.in]: [1, 2, 3, 4] } }
    }) || 0;

    const salesToday = await Order.sum('payAmount', {
      where: {
        createdAt: { [Op.gte]: today },
        status: { [Op.in]: [1, 2, 3, 4] }
      }
    }) || 0;

    const salesMonth = await Order.sum('payAmount', {
      where: {
        createdAt: { [Op.gte]: thisMonth },
        status: { [Op.in]: [1, 2, 3, 4] }
      }
    }) || 0;

    ResponseUtil.success(ctx, {
      user: {
        total: userTotal,
        today: userToday,
        growth: userYesterday > 0
          ? ((userToday - userYesterday) / userYesterday * 100).toFixed(2)
          : (userToday > 0 ? 100 : 0)
      },
      product: {
        total: productTotal,
        onSale: productOnSale,
        offSale: productOffSale
      },
      order: {
        total: orderTotal,
        today: orderToday,
        pending: orderPending,
        paid: orderPaid,
        shipped: orderShipped
      },
      sales: {
        total: parseFloat(salesTotal.toFixed(2)),
        today: parseFloat(salesToday.toFixed(2)),
        month: parseFloat(salesMonth.toFixed(2))
      }
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 获取最近7天销售趋势
 * GET /dashboard/trend
 */
router.get('/trend', async (ctx) => {
  try {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [orderCount, salesAmount] = await Promise.all([
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: date,
              [Op.lt]: nextDate
            }
          }
        }),
        Order.sum('payAmount', {
          where: {
            createdAt: {
              [Op.gte]: date,
              [Op.lt]: nextDate
            },
            status: { [Op.in]: [1, 2, 3, 4] }
          }
        }) || 0
      ]);

      data.push({
        date: date.toISOString().slice(0, 10),
        orders: orderCount,
        sales: parseFloat(salesAmount.toFixed(2))
      });
    }

    ResponseUtil.success(ctx, data);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取热销商品排行
 * GET /dashboard/hot-products
 */
router.get('/hot-products', async (ctx) => {
  const { limit = 10 } = ctx.query;

  try {
    const { sequelize } = require('../../models');

    const hotProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        'productName',
        'productImage',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalAmount']
      ],
      include: [{
        model: Product,
        attributes: ['price']
      }],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: parseInt(limit)
    });

    ResponseUtil.success(ctx, hotProducts);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
