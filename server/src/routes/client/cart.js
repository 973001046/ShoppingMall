const Router = require('koa-router');
const { Cart, Product } = require('../../models');
const { clientAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/cart' });

/**
 * 获取购物车列表
 * GET /cart/list
 */
router.get('/list', clientAuth, async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    const carts = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'mainImage', 'price', 'stock', 'status']
      }],
      order: [['createdAt', 'desc']]
    });

    ResponseUtil.success(ctx, carts);
  } catch (error) {
    throw error;
  }
});

/**
 * 添加商品到购物车
 * POST /cart/add
 */
router.post('/add', clientAuth, async (ctx) => {
  const { productId, quantity = 1 } = ctx.request.body;
  const userId = ctx.state.user.id;

  if (!productId) {
    ResponseUtil.badRequest(ctx, '商品ID不能为空');
    return;
  }

  try {
    // 检查商品是否存在且上架
    const product = await Product.findByPk(productId);
    if (!product || product.status !== 1) {
      ResponseUtil.badRequest(ctx, '商品不存在或已下架');
      return;
    }

    if (product.stock < quantity) {
      ResponseUtil.badRequest(ctx, '商品库存不足');
      return;
    }

    // 查找购物车中是否已有该商品
    let cart = await Cart.findOne({
      where: { userId, productId }
    });

    if (cart) {
      // 更新数量
      cart.quantity += parseInt(quantity);
      await cart.save();
    } else {
      // 创建新记录
      cart = await Cart.create({
        userId,
        productId,
        quantity: parseInt(quantity)
      });
    }

    ResponseUtil.success(ctx, cart, '添加成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新购物车商品数量
 * PUT /cart/update/:id
 */
router.put('/update/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const { quantity, selected } = ctx.request.body;
  const userId = ctx.state.user.id;

  try {
    const cart = await Cart.findOne({
      where: { id, userId }
    });

    if (!cart) {
      ResponseUtil.notFound(ctx, '购物车商品不存在');
      return;
    }

    const updateData = {};
    if (quantity !== undefined) {
      updateData.quantity = parseInt(quantity);
    }
    if (selected !== undefined) {
      updateData.selected = selected === true || selected === 1 ? 1 : 0;
    }

    await cart.update(updateData);
    ResponseUtil.success(ctx, cart, '更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除购物车商品
 * DELETE /cart/delete/:id
 */
router.delete('/delete/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const result = await Cart.destroy({
      where: { id, userId }
    });

    if (result === 0) {
      ResponseUtil.notFound(ctx, '购物车商品不存在');
      return;
    }

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 批量删除购物车商品
 * POST /cart/delete-batch
 */
router.post('/delete-batch', clientAuth, async (ctx) => {
  const { ids } = ctx.request.body;
  const userId = ctx.state.user.id;

  if (!Array.isArray(ids) || ids.length === 0) {
    ResponseUtil.badRequest(ctx, '请选择要删除的商品');
    return;
  }

  try {
    await Cart.destroy({
      where: {
        id: ids,
        userId
      }
    });

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 清空购物车
 * POST /cart/clear
 */
router.post('/clear', clientAuth, async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    await Cart.destroy({
      where: { userId }
    });

    ResponseUtil.success(ctx, null, '购物车已清空');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
