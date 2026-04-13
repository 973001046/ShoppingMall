-- Seed: 初始化管理员数据
-- Created at: 2026-04-10

-- ============================================
-- 插入初始管理员数据
-- 密码使用 bcryptjs 加密，默认密码 admin123
-- 注意：生产环境请修改默认密码
-- ============================================

-- 超级管理员（admin / admin123）
INSERT INTO admins (username, password, real_name, role_id, status, last_login_time, created_at, updated_at)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrEJ.5yJhx8s1lN4oRXqYqYrnYVYyK',
  '超级管理员',
  1,
  1,
  NULL,
  NOW(),
  NOW()
);

-- 运营人员（operator / operator123）
INSERT INTO admins (username, password, real_name, role_id, status, last_login_time, created_at, updated_at)
VALUES (
  'operator',
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrEJ.5yJhx8s1lN4oRXqYqYrnYVYyK',
  '运营人员',
  2,
  1,
  NULL,
  NOW(),
  NOW()
);

-- 客服人员（service / service123）
INSERT INTO admins (username, password, real_name, role_id, status, last_login_time, created_at, updated_at)
VALUES (
  'service',
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrEJ.5yJhx8s1lN4oRXqYqYrnYVYyK',
  '客服人员',
  3,
  1,
  NULL,
  NOW(),
  NOW()
);
