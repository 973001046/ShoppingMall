-- Migration: 添加权限管理表
-- Created at: 2026-04-10
-- Description: 创建权限表和角色权限关联，支持无限分类的页面路由和按钮权限管理

-- ============================================
-- 1. 权限表 (permissions)
-- ============================================
-- 支持无限分类：parent_id 指向父权限，0 为顶级
-- type: 1-页面/菜单, 2-按钮/操作
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
  parent_id BIGINT UNSIGNED DEFAULT 0 COMMENT '父权限ID，0为顶级（用于无限分类）',
  type TINYINT NOT NULL DEFAULT 1 COMMENT '类型：1页面/菜单，2按钮/操作',
  name VARCHAR(50) NOT NULL COMMENT '权限名称（显示用）',
  code VARCHAR(100) NOT NULL COMMENT '权限编码（唯一标识，如 user:list, user:create）',
  path VARCHAR(255) NULL COMMENT '路由路径（仅页面类型使用，如 /user/list）',
  component VARCHAR(255) NULL COMMENT '前端组件路径（仅页面类型使用，如 ./pages/User/List）',
  icon VARCHAR(50) NULL COMMENT '图标（仅页面类型使用）',
  button_code VARCHAR(50) NULL COMMENT '按钮标识（仅按钮类型使用，如 add, edit, delete）',
  sort INT DEFAULT 0 COMMENT '排序，值越小越靠前',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  -- 唯一索引
  UNIQUE KEY uk_code (code),

  -- 普通索引
  INDEX idx_parent_id (parent_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_sort (sort),
  INDEX idx_path (path),

  -- 联合索引：便于按类型和父级查询
  INDEX idx_type_parent (type, parent_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表（页面路由和按钮权限）';

-- ============================================
-- 2. 添加外键约束
-- ============================================
-- 权限自关联（父级权限）
ALTER TABLE permissions
  ADD CONSTRAINT fk_permissions_parent_id
  FOREIGN KEY (parent_id) REFERENCES permissions(id)
  ON DELETE CASCADE ON UPDATE CASCADE;
