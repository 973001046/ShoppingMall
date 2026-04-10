const Router = require('koa-router');
const { Op } = require('sequelize');
const { User } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/user' });

// 所有用户管理接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取用户列表
 * GET /user/list
 */
router.get('/list', async (ctx) => {
  const {
    keyword,
    status,
    page = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc'
  } = ctx.query;

  const where = {};

  if (keyword) {
    where[Op.or] = [
      { nickname: { [Op.like]: `%${keyword}%` } },
      { phone: { [Op.like]: `%${keyword}%` } }
    ];
  }

  if (status !== undefined && status !== '') {
    where.status = parseInt(status);
  }

  const offset = (page - 1) * pageSize;
  const order = [[sortField, sortOrder]];

  try {
    const { count, rows } = await User.findAndCountAll({
      where,
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
 * 获取用户详情
 * GET /user/detail/:id
 */
router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      ResponseUtil.notFound(ctx, '用户不存在');
      return;
    }

    ResponseUtil.success(ctx, user);
  } catch (error) {
    throw error;
  }
});

/**
 * 更新用户状态
 * PUT /user/status/:id
 */
router.put('/status/:id', async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      ResponseUtil.notFound(ctx, '用户不存在');
      return;
    }

    await user.update({ status });

    ResponseUtil.success(ctx, null, '状态更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除用户
 * DELETE /user/delete/:id
 */
router.delete('/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const result = await User.destroy({
      where: { id }
    });

    if (result === 0) {
      ResponseUtil.notFound(ctx, '用户不存在');
      return;
    }

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
