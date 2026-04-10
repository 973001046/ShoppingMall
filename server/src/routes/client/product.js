const Router = require('koa-router');
const { Op } = require('sequelize');
const { Product, Category } = require('../../models');
const { optionalAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/product' });

/**
 * 获取商品列表
 * GET /product/list
 */
router.get('/list', optionalAuth, async (ctx) => {
  const {
    categoryId,
    keyword,
    page = 1,
    pageSize = 10,
    sortField = 'sort',
    sortOrder = 'desc',
    isHot,
    isNew
  } = ctx.query;

  const where = { status: 1 };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` };
  }

  if (isHot !== undefined) {
    where.isHot = isHot === '1' ? 1 : 0;
  }

  if (isNew !== undefined) {
    where.isNew = isNew === '1' ? 1 : 0;
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
router.get('/detail/:id', optionalAuth, async (ctx) => {
  const { id } = ctx.params;

  try {
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!product || product.status === 0) {
      ResponseUtil.notFound(ctx, '商品不存在');
      return;
    }

    ResponseUtil.success(ctx, product);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取商品分类
 * GET /product/category
 */
router.get('/category', async (ctx) => {
  try {
    const categories = await Category.findAll({
      where: { status: 1 },
      order: [['sort', 'desc']]
    });

    ResponseUtil.success(ctx, categories);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取热销商品
 * GET /product/hot
 */
router.get('/hot', async (ctx) => {
  const { limit = 10 } = ctx.query;

  try {
    const products = await Product.findAll({
      where: { status: 1, isHot: 1 },
      order: [['sales', 'desc']],
      limit: parseInt(limit)
    });

    ResponseUtil.success(ctx, products);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取新品推荐
 * GET /product/new
 */
router.get('/new', async (ctx) => {
  const { limit = 10 } = ctx.query;

  try {
    const products = await Product.findAll({
      where: { status: 1, isNew: 1 },
      order: [['createdAt', 'desc']],
      limit: parseInt(limit)
    });

    ResponseUtil.success(ctx, products);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
