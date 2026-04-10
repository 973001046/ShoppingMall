const Router = require('koa-router');
const { Op } = require('sequelize');
const { Category, Product } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/category' });

// 所有分类管理接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取分类列表
 * GET /category/list
 */
router.get('/list', async (ctx) => {
  const { keyword, status } = ctx.query;

  const where = {};

  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }

  if (status !== undefined && status !== '') {
    where.status = parseInt(status);
  }

  try {
    const categories = await Category.findAll({
      where,
      order: [['sort', 'desc']]
    });

    ResponseUtil.success(ctx, categories);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取分类详情
 * GET /category/detail/:id
 */
router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      ResponseUtil.notFound(ctx, '分类不存在');
      return;
    }

    ResponseUtil.success(ctx, category);
  } catch (error) {
    throw error;
  }
});

/**
 * 创建分类
 * POST /category/create
 */
router.post('/create', async (ctx) => {
  const { parentId, name, icon, sort } = ctx.request.body;

  if (!name) {
    ResponseUtil.badRequest(ctx, '分类名称不能为空');
    return;
  }

  try {
    const category = await Category.create({
      parentId: parentId || 0,
      name,
      icon,
      sort: sort || 0,
      status: 1
    });

    ResponseUtil.success(ctx, category, '创建成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新分类
 * PUT /category/update/:id
 */
router.put('/update/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, icon, sort, status } = ctx.request.body;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      ResponseUtil.notFound(ctx, '分类不存在');
      return;
    }

    await category.update({
      name: name || category.name,
      icon: icon || category.icon,
      sort: sort !== undefined ? sort : category.sort,
      status: status !== undefined ? status : category.status
    });

    ResponseUtil.success(ctx, category, '更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除分类
 * DELETE /category/delete/:id
 */
router.delete('/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    // 检查分类下是否有商品
    const productCount = await Product.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      ResponseUtil.badRequest(ctx, '该分类下存在商品，无法删除');
      return;
    }

    // 检查是否有子分类
    const childCount = await Category.count({
      where: { parentId: id }
    });

    if (childCount > 0) {
      ResponseUtil.badRequest(ctx, '该分类下存在子分类，无法删除');
      return;
    }

    const result = await Category.destroy({
      where: { id }
    });

    if (result === 0) {
      ResponseUtil.notFound(ctx, '分类不存在');
      return;
    }

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
