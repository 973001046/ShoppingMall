const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const { Admin } = require('../../models');
const { generateToken } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/auth' });

/**
 * 管理员登录
 * POST /auth/login
 */
router.post('/login', async (ctx) => {
  const { username, password, captcha } = ctx.request.body;

  if (!username || !password) {
    ResponseUtil.badRequest(ctx, '用户名和密码不能为空');
    return;
  }

  try {
    const admin = await Admin.findOne({
      where: { username },
      include: [{ model: require('../../models').Role, as: 'role' }]
    });

    if (!admin) {
      ResponseUtil.error(ctx, '用户名或密码错误', 401, 200);
      return;
    }

    if (admin.status === 0) {
      ResponseUtil.error(ctx, '账号已被禁用', 403, 200);
      return;
    }

    // 验证密码（开发阶段使用明文比较，生产环境使用bcrypt）
    // const isValid = await bcrypt.compare(password, admin.password);
    const isValid = password === admin.password; // 开发阶段简化

    if (!isValid) {
      ResponseUtil.error(ctx, '用户名或密码错误', 401, 200);
      return;
    }

    // 更新登录信息
    await admin.update({
      lastLoginTime: new Date(),
      lastLoginIp: ctx.ip
    });

    // 生成Token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      type: 'admin'
    }, 'admin');

    ResponseUtil.success(ctx, {
      token,
      userInfo: {
        id: admin.id,
        username: admin.username,
        realName: admin.realName,
        avatar: admin.avatar,
        role: admin.role ? {
          id: admin.role.id,
          name: admin.role.name,
          code: admin.role.code,
          permissions: admin.role.permissions
        } : null
      }
    }, '登录成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 获取当前登录管理员信息
 * GET /auth/info
 */
router.get('/info', async (ctx) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  const { verifyToken } = require('../../middlewares/auth');

  if (!token) {
    ResponseUtil.unauthorized(ctx, '请先登录');
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    ResponseUtil.unauthorized(ctx, '登录已过期');
    return;
  }

  try {
    const admin = await Admin.findByPk(decoded.id, {
      include: [{ model: require('../../models').Role, as: 'role' }]
    });

    if (!admin || admin.status === 0) {
      ResponseUtil.unauthorized(ctx, '管理员不存在或已被禁用');
      return;
    }

    ResponseUtil.success(ctx, {
      id: admin.id,
      username: admin.username,
      realName: admin.realName,
      avatar: admin.avatar,
      role: admin.role ? {
        id: admin.role.id,
        name: admin.role.name,
        code: admin.role.code,
        permissions: admin.role.permissions
      } : null
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 退出登录
 * POST /auth/logout
 */
router.post('/logout', (ctx) => {
  ResponseUtil.success(ctx, null, '退出成功');
});

module.exports = router;
