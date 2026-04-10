const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const { clientAuth, generateToken } = require('../../middlewares/auth');
const ResponseUtil = require('../../utils/response');

const router = new Router({ prefix: '/user' });

/**
 * 用户登录/注册（小程序微信登录）
 * POST /user/login
 */
router.post('/login', async (ctx) => {
  const { code, userInfo } = ctx.request.body;

  // 这里应该调用微信接口换取openid
  // 实际开发中需要接入微信登录流程
  const mockOpenid = `openid_${Date.now()}`;

  try {
    // 查找或创建用户
    let [user, created] = await User.findOrCreate({
      where: { openid: mockOpenid },
      defaults: {
        openid: mockOpenid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || ''
      }
    });

    // 更新用户信息
    if (!created && userInfo) {
      await user.update({
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        lastLoginTime: new Date(),
        lastLoginIp: ctx.ip
      });
    }

    // 生成Token
    const token = generateToken({
      id: user.id,
      openid: user.openid,
      type: 'client'
    }, 'client');

    ResponseUtil.success(ctx, {
      token,
      userInfo: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone
      }
    }, '登录成功');
  } catch (error) {
    throw error;
  }
});

/**
 * 获取用户信息
 * GET /user/info
 */
router.get('/info', clientAuth, async (ctx) => {
  const user = ctx.state.user;
  ResponseUtil.success(ctx, {
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    email: user.email
  });
});

/**
 * 更新用户信息
 * PUT /user/info
 */
router.put('/info', clientAuth, async (ctx) => {
  const { nickname, avatar, phone, email } = ctx.request.body;
  const user = ctx.state.user;

  await user.update({
    nickname: nickname || user.nickname,
    avatar: avatar || user.avatar,
    phone: phone || user.phone,
    email: email || user.email
  });

  ResponseUtil.success(ctx, {
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    email: user.email
  }, '更新成功');
});

/**
 * 绑定手机号
 * POST /user/bind-phone
 */
router.post('/bind-phone', clientAuth, async (ctx) => {
  const { phone, code } = ctx.request.body;

  if (!phone) {
    ResponseUtil.badRequest(ctx, '手机号不能为空');
    return;
  }

  // 实际开发中需要验证短信验证码

  const user = ctx.state.user;
  await user.update({ phone });

  ResponseUtil.success(ctx, { phone }, '手机号绑定成功');
});

module.exports = router;
