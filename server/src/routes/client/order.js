const Router = require('koa-router');
const { v4: uuidv4 } = require('uuid');
const { Order, OrderItem, Cart, Product, Address } = require('../../models');
const { clientAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/order' });

/**
 * 生成订单号
 */
function generateOrderNo() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${date}${random}`;
}

/**
 * 创建订单
 * POST /order/create
 */
router.post('/create', clientAuth, async (ctx) => {
  const { cartIds, addressId, remark } = ctx.request.body;
  const userId = ctx.state.user.id;

  if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
    ResponseUtil.badRequest(ctx, '请选择要购买的商品');
    return;
  }

  if (!addressId) {
    ResponseUtil.badRequest(ctx, '请选择收货地址');
    return;
  }

  try {
    // 查询收货地址
    const address = await Address.findOne({
      where: { id: addressId, userId }
    });

    if (!address) {
      ResponseUtil.badRequest(ctx, '收货地址不存在');
      return;
    }

    // 查询购物车商品
    const carts = await Cart.findAll({
      where: {
        id: cartIds,
        userId,
        selected: 1
      },
      include: [Product]
    });

    if (carts.length === 0) {
      ResponseUtil.badRequest(ctx, '购物车中没有选中的商品');
      return;
    }

    // 检查库存
    for (const cart of carts) {
      if (cart.Product.stock < cart.quantity) {
        ResponseUtil.badRequest(ctx, `商品 "${cart.Product.name}" 库存不足`);
        return;
      }
      if (cart.Product.status !== 1) {
        ResponseUtil.badRequest(ctx, `商品 "${cart.Product.name}" 已下架`);
        return;
      }
    }

    // 计算金额
    let totalAmount = 0;
    for (const cart of carts) {
      totalAmount += cart.Product.price * cart.quantity;
    }

    // 创建订单
    const order = await Order.create({
      orderNo: generateOrderNo(),
      userId,
      totalAmount,
      payAmount: totalAmount,
      discountAmount: 0,
      freightAmount: 0,
      status: 0,
      remark,
      receiverName: address.name,
      receiverPhone: address.phone,
      receiverAddress: `${address.province}${address.city}${address.district}${address.detail}`
    });

    // 创建订单商品
    const orderItems = carts.map(cart => ({
      orderId: order.id,
      productId: cart.productId,
      productName: cart.Product.name,
      productImage: cart.Product.mainImage,
      price: cart.Product.price,
      quantity: cart.quantity,
      totalAmount: cart.Product.price * cart.quantity
    }));

    await OrderItem.bulkCreate(orderItems);

    // 从购物车中删除已购买的商品
    await Cart.destroy({
      where: { id: cartIds, userId }
    });

    // 扣减库存
    for (const cart of carts) {
      await cart.Product.decrement('stock', { by: cart.quantity });
      await cart.Product.increment('sales', { by: cart.quantity });
    }

    ResponseUtil.success(ctx, { orderId: order.id, orderNo: order.orderNo }, '订单创建成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 获取订单列表
 * GET /order/list
 */
router.get('/list', clientAuth, async (ctx) => {
  const userId = ctx.state.user.id;
  const { status, page = 1, pageSize = 10 } = ctx.query;

  const where = { userId };
  if (status !== undefined && status !== '') {
    where.status = parseInt(status);
  }

  const offset = (page - 1) * pageSize;

  try {
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'desc']],
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
router.get('/detail/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const order = await Order.findOne({
      where: { id, userId },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
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
 * 取消订单
 * POST /order/cancel/:id
 */
router.post('/cancel/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const order = await Order.findOne({
      where: { id, userId }
    });

    if (!order) {
      ResponseUtil.notFound(ctx, '订单不存在');
      return;
    }

    if (order.status !== 0) {
      ResponseUtil.badRequest(ctx, '订单状态不允许取消');
      return;
    }

    // 恢复库存
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id }
    });

    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        await product.increment('stock', { by: item.quantity });
        await product.decrement('sales', { by: item.quantity });
      }
    }

    await order.update({ status: 5 });

    ResponseUtil.success(ctx, null, '订单已取消');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
