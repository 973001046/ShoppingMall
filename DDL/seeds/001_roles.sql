-- Seed: 初始化角色数据
-- Created at: 2026-04-10

-- ============================================
-- 插入初始角色数据
-- ============================================
INSERT INTO roles (name, code, description, permissions, status, created_at, updated_at)
VALUES
  (
    '超级管理员',
    'super_admin',
    '拥有所有权限',
    '["*"]',
    1,
    NOW(),
    NOW()
  ),
  (
    '运营人员',
    'operator',
    '负责日常运营，管理商品和订单',
    '[
      "product:list", "product:create", "product:update", "product:delete",
      "order:list", "order:update", "order:ship",
      "category:list", "category:create", "category:update", "category:delete",
      "user:list", "user:view"
    ]',
    1,
    NOW(),
    NOW()
  ),
  (
    '客服人员',
    'customer_service',
    '负责客户服务，处理售后问题',
    '[
      "order:list", "order:update",
      "user:list", "user:view",
      "refund:list", "refund:handle"
    ]',
    1,
    NOW(),
    NOW()
  );
