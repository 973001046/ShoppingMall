-- Rollback: 回滚权限管理表
-- Created at: 2026-04-10

-- ============================================
-- 删除外键约束
-- ============================================
ALTER TABLE permissions DROP FOREIGN KEY IF EXISTS fk_permissions_parent_id;
ALTER TABLE permissions DROP FOREIGN KEY IF EXISTS fk_permissions_role_id;

-- ============================================
-- 删除 role_id 字段
-- ============================================
ALTER TABLE permissions DROP COLUMN IF EXISTS role_id;

-- ============================================
-- 删除表
-- ============================================
DROP TABLE IF EXISTS permissions;
