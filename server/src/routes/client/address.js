const Router = require('koa-router');
const { Address } = require('../../models');
const { clientAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/address' });

/**
 * 获取地址列表
 * GET /address/list
 */
router.get('/list', clientAuth, async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    const addresses = await Address.findAll({
      where: { userId },
      order: [
        ['isDefault', 'desc'],
        ['createdAt', 'desc']
      ]
    });

    ResponseUtil.success(ctx, addresses);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取默认地址
 * GET /address/default
 */
router.get('/default', clientAuth, async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    const address = await Address.findOne({
      where: { userId, isDefault: 1 }
    });

    if (!address) {
      ResponseUtil.success(ctx, null);
      return;
    }

    ResponseUtil.success(ctx, address);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取地址详情
 * GET /address/detail/:id
 */
router.get('/detail/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      ResponseUtil.notFound(ctx, '地址不存在');
      return;
    }

    ResponseUtil.success(ctx, address);
  } catch (error) {
    throw error;
  }
});

/**
 * 添加地址
 * POST /address/add
 */
router.post('/add', clientAuth, async (ctx) => {
  const { name, phone, province, city, district, detail, isDefault } = ctx.request.body;
  const userId = ctx.state.user.id;

  // 验证必填字段
  if (!name || !phone || !province || !city || !district || !detail) {
    ResponseUtil.badRequest(ctx, '请填写完整的地址信息');
    return;
  }

  try {
    // 如果设为默认，取消其他默认地址
    if (isDefault) {
      await Address.update(
        { isDefault: 0 },
        { where: { userId, isDefault: 1 } }
      );
    }

    const address = await Address.create({
      userId,
      name,
      phone,
      province,
      city,
      district,
      detail,
      isDefault: isDefault ? 1 : 0
    });

    ResponseUtil.success(ctx, address, '添加成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新地址
 * PUT /address/update/:id
 */
router.put('/update/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const { name, phone, province, city, district, detail, isDefault } = ctx.request.body;
  const userId = ctx.state.user.id;

  try {
    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      ResponseUtil.notFound(ctx, '地址不存在');
      return;
    }

    // 如果设为默认，取消其他默认地址
    if (isDefault && !address.isDefault) {
      await Address.update(
        { isDefault: 0 },
        { where: { userId, isDefault: 1 } }
      );
    }

    await address.update({
      name: name || address.name,
      phone: phone || address.phone,
      province: province || address.province,
      city: city || address.city,
      district: district || address.district,
      detail: detail || address.detail,
      isDefault: isDefault !== undefined ? (isDefault ? 1 : 0) : address.isDefault
    });

    ResponseUtil.success(ctx, address, '更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除地址
 * DELETE /address/delete/:id
 */
router.delete('/delete/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const result = await Address.destroy({
      where: { id, userId }
    });

    if (result === 0) {
      ResponseUtil.notFound(ctx, '地址不存在');
      return;
    }

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 设置默认地址
 * POST /address/set-default/:id
 */
router.post('/set-default/:id', clientAuth, async (ctx) => {
  const { id } = ctx.params;
  const userId = ctx.state.user.id;

  try {
    const address = await Address.findOne({
      where: { id, userId }
    });

    if (!address) {
      ResponseUtil.notFound(ctx, '地址不存在');
      return;
    }

    // 取消其他默认地址
    await Address.update(
      { isDefault: 0 },
      { where: { userId, isDefault: 1 } }
    );

    await address.update({ isDefault: 1 });

    ResponseUtil.success(ctx, null, '设置成功');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
