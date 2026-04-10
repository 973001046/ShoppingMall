const jwt = require('jsonwebtoken');
const config = require('../config');
const ResponseUtil = require('../utils/response');
const { User, Admin } = require('../models');

/**
 * 生成JWT Token
 */
function generateToken(payload, type = 'client') {
  const expiresIn = type === 'client' ? '7d' : '1d';
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
}

/**
 * 验证JWT Token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (err) {
    return null;
  }
}

/**
 * C端用户认证中间件
 */
async function clientAuth(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    ResponseUtil.unauthorized(ctx, '请先登录');
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    ResponseUtil.unauthorized(ctx, '登录已过期，请重新登录');
    return;
  }

  // 查询用户信息
  const user = await User.findByPk(decoded.id);
  if (!user || user.status === 0) {
    ResponseUtil.unauthorized(ctx, '用户不存在或已被禁用');
    return;
  }

  ctx.state.user = user;
  await next();
}

/**
 * B端管理员认证中间件
 */
async function adminAuth(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    ResponseUtil.unauthorized(ctx, '请先登录');
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    ResponseUtil.unauthorized(ctx, '登录已过期，请重新登录');
    return;
  }

  // 查询管理员信息
  const admin = await Admin.findByPk(decoded.id, {
    include: [{ model: require('../models').Role, as: 'role' }]
  });
  if (!admin || admin.status === 0) {
    ResponseUtil.unauthorized(ctx, '管理员不存在或已被禁用');
    return;
  }

  ctx.state.admin = admin;
  await next();
}

/**
 * 可选认证中间件（登录与否都能访问）
 */
async function optionalAuth(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '');

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findByPk(decoded.id);
      if (user && user.status === 1) {
        ctx.state.user = user;
      }
    }
  }

  await next();
}

module.exports = {
  generateToken,
  verifyToken,
  clientAuth,
  adminAuth,
  optionalAuth
};
