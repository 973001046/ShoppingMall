const Router = require('koa-router');
const { Role, Admin } = require('../../models');
const { adminAuth } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/role' });

// 所有角色管理接口都需要管理员权限
router.use(adminAuth);

/**
 * 获取角色列表
 * GET /role/list
 */
router.get('/list', async (ctx) => {
  try {
    const roles = await Role.findAll({
      order: [['createdAt', 'desc']]
    });

    ResponseUtil.success(ctx, roles);
  } catch (error) {
    throw error;
  }
});

/**
 * 获取角色详情
 * GET /role/detail/:id
 */
router.get('/detail/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      ResponseUtil.notFound(ctx, '角色不存在');
      return;
    }

    ResponseUtil.success(ctx, role);
  } catch (error) {
    throw error;
  }
});

/**
 * 创建角色
 * POST /role/create
 */
router.post('/create', async (ctx) => {
  const { name, code, description, permissions } = ctx.request.body;

  if (!name || !code) {
    ResponseUtil.badRequest(ctx, '角色名称和编码不能为空');
    return;
  }

  try {
    // 检查code是否已存在
    const existing = await Role.findOne({ where: { code } });
    if (existing) {
      ResponseUtil.badRequest(ctx, '角色编码已存在');
      return;
    }

    const role = await Role.create({
      name,
      code,
      description,
      permissions: permissions || [],
      status: 1
    });

    ResponseUtil.success(ctx, role, '创建成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 更新角色
 * PUT /role/update/:id
 */
router.put('/update/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, description, permissions, status } = ctx.request.body;

  try {
    const role = await Role.findByPk(id);

    if (!role) {
      ResponseUtil.notFound(ctx, '角色不存在');
      return;
    }

    await role.update({
      name: name || role.name,
      description: description || role.description,
      permissions: permissions || role.permissions,
      status: status !== undefined ? status : role.status
    });

    ResponseUtil.success(ctx, role, '更新成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 删除角色
 * DELETE /role/delete/:id
 */
router.delete('/delete/:id', async (ctx) => {
  const { id } = ctx.params;

  try {
    // 检查角色是否有关联的管理员
    const adminCount = await Admin.count({
      where: { roleId: id }
    });

    if (adminCount > 0) {
      ResponseUtil.badRequest(ctx, '该角色下存在管理员，无法删除');
      return;
    }

    const result = await Role.destroy({
      where: { id }
    });

    if (result === 0) {
      ResponseUtil.notFound(ctx, '角色不存在');
      return;
    }

    ResponseUtil.success(ctx, null, '删除成功');
  } catch (error) {
    throw error;
  }
});

module.exports = router;
