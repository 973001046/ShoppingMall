-- Migration: add_level_to_users
-- Created at: 2026-04-10T10:11:53.260Z

-- ============================================
-- 在此编写你的DDL变更
-- ============================================

-- 在 users 表新增 level 字段
ALTER TABLE users
  ADD COLUMN level TINYINT NOT NULL DEFAULT 1 COMMENT '用户等级：1普通，2银牌，3金牌，4钻石' 
  AFTER status;

-- 示例：创建新表
-- CREATE TABLE IF NOT EXISTS example_table (
--   id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(100) NOT NULL COMMENT '名称',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='示例表';

-- 示例：修改表结构
-- ALTER TABLE existing_table
--   ADD COLUMN new_field VARCHAR(50) NULL COMMENT '新字段' AFTER existing_field,
--   MODIFY COLUMN old_field VARCHAR(100) NOT NULL COMMENT '修改后的字段';

-- 示例：添加索引
-- CREATE INDEX idx_name ON example_table(name);

-- 示例：添加外键
-- ALTER TABLE child_table
--   ADD CONSTRAINT fk_parent
--   FOREIGN KEY (parent_id) REFERENCES parent_table(id)
--   ON DELETE CASCADE ON UPDATE CASCADE;

