const Router = require('koa-router');
const { Op } = require('sequelize');
const { Product, Category } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/product' });

// 所有商品管理接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取商品列表
 * GET /product/list
 */
router.get('/list', async (ctx) => {
  const {
    keyword,
    categoryId,
    status,
    page = 1,
    pageSize = 10,
    sortField = 'sort',
    sortOrder = 'desc'
  } = ctx.query;

  const where = {};

  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status !== undefined && status !== '') {
    where.status = parseInt(status);
  }

  const offset = (page - 1) * pageSize;
  const order = [[sortField, sortOrder]];

  try {
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
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
 * 获取商品详情
 * GET /product/detail/:id
 */
router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    if (!product) {
      ResponseUtil.notFound(ctx, '商品不存在');
      return;
    }

    ResponseUtil.success(ctx, product);
  } catch (error) {
    throw error;
  }
});

/**
 * 创建商品
 * POST /product/create
 */
router.post('/create', async (ctx) => {
  const {
    categoryId,
    name,
    subtitle,
    description,
    mainImage,
    subImages,
    price,
    originalPrice,
    stock,
    unit,
    isHot,
    isNew,
    sort
  } = ctx.request.body;

  if (!categoryId || !name || !price || stock === undefined) {
    ResponseUtil.badRequest(ctx, '请填写完整的商品信息');
    return;
  }

  try {
    const product = await Product.create({
      categoryId,
      name,
      subtitle,
      description,
      mainImage,
      subImages: subImages || [],
      price,
      originalPrice,
      stock,
      unit: unit || '件',
      isHot: isHot ? 1 : 0,
      isNew: isNew ? 1 : 0,
      sort: sort || 0,
      status: 1
    });

    ResponseUtil.success(ctx, product, '创建成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新商品
 * PUT /product/update/:id
 */
router.put('/update/:id', async (ctx) => {
  const { id } = ctx.params;
  const updateData = ctx.request.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      ResponseUtil.notFound(ctx, '商品不存在');
      return;
    }

    // 转换布尔值为数字
    if (updateData.isHot !== undefined) {
      updateData.isHot = updateData.isHot ? 1 : 0;
    }
    if (updateData.isNew !== undefined) {
      updateData.isNew = updateData.isNew ? 1 : 0;
    }

    await product.update(updateData);

    ResponseUtil.success(ctx, product, '更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新商品状态
 * PUT /product/status/:id
 */
router.put('/status/:id', async (ctx) => {
  const { id } = ctx.params;
  const { status } = ctx.request.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      ResponseUtil.notFound(ctx, '商品不存在');
      return;
    }

    await product.update({ status });

    ResponseUtil.success(ctx, null, '状态更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除商品
 * DELETE /product/delete/:id
 */
router.delete('/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      ResponseUtil.notFound(ctx, '商品不存在');
      return;
    }

    // 软删除，将状态改为2（删除）
    await product.update({ status: 2 });

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
