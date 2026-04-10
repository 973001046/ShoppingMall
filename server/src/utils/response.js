/**
 * 统一响应格式工具
 */

class ResponseUtil {
  /**
   * 成功响应
   */
  static success(ctx, data = null, message = '操作成功') {
    ctx.body = {
      code: 200,
      message,
      data,
      timestamp: Date.now()
    };
  }

  /**
   * 错误响应
   */
  static error(ctx, message = '操作失败', code = 500, status = 200) {
    ctx.status = status;
    ctx.body = {
      code,
      message,
      data: null,
      timestamp: Date.now()
    };
  }

  /**
   * 分页响应
   */
  static page(ctx, list, pagination) {
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: {
        list,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          totalPages: Math.ceil(pagination.total / pagination.pageSize)
        }
      },
      timestamp: Date.now()
    };
  }

  /**
   * 参数错误
   */
  static badRequest(ctx, message = '参数错误') {
    this.error(ctx, message, 400, 200);
  }

  /**
   * 未授权
   */
  static unauthorized(ctx, message = '未授权，请先登录') {
    this.error(ctx, message, 401, 401);
  }

  /**
   * 禁止访问
   */
  static forbidden(ctx, message = '禁止访问') {
    this.error(ctx, message, 403, 403);
  }

  /**
   * 资源不存在
   */
  static notFound(ctx, message = '资源不存在') {
    this.error(ctx, message, 404, 404);
  }
}

module.exports = ResponseUtil;
