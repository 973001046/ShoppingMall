-- Seed: 初始化权限数据
-- Created at: 2026-04-10
-- Description: 创建系统菜单和按钮权限数据，支持无限分类结构
-- 权限表独立于角色，通过 Role.permissions JSON 字段维护关联关系

-- ============================================
-- 1. 系统管理模块
-- ============================================
-- 系统管理（顶级菜单）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (0, 1, '系统管理', 'system', '/system', './layouts/BlankLayout', 'SettingOutlined', 100, 1, NOW(), NOW());

SET @system_id = LAST_INSERT_ID();

-- 用户管理（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@system_id, 1, '用户管理', 'system:user', '/system/user', './pages/System/User', 'UserOutlined', 10, 1, NOW(), NOW());

SET @user_page_id = LAST_INSERT_ID();

-- 用户管理按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@user_page_id, 2, '新增用户', 'system:user:create', 'add', 10, 1, NOW(), NOW()),
(@user_page_id, 2, '编辑用户', 'system:user:update', 'edit', 20, 1, NOW(), NOW()),
(@user_page_id, 2, '删除用户', 'system:user:delete', 'delete', 30, 1, NOW(), NOW()),
(@user_page_id, 2, '查询用户', 'system:user:list', 'query', 40, 1, NOW(), NOW()),
(@user_page_id, 2, '重置密码', 'system:user:reset', 'reset', 50, 1, NOW(), NOW());

-- 角色管理（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@system_id, 1, '角色管理', 'system:role', '/system/role', './pages/System/Role', 'TeamOutlined', 20, 1, NOW(), NOW());

SET @role_page_id = LAST_INSERT_ID();

-- 角色管理按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@role_page_id, 2, '新增角色', 'system:role:create', 'add', 10, 1, NOW(), NOW()),
(@role_page_id, 2, '编辑角色', 'system:role:update', 'edit', 20, 1, NOW(), NOW()),
(@role_page_id, 2, '删除角色', 'system:role:delete', 'delete', 30, 1, NOW(), NOW()),
(@role_page_id, 2, '分配权限', 'system:role:permission', 'permission', 40, 1, NOW(), NOW());

-- 菜单/权限管理（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@system_id, 1, '权限管理', 'system:permission', '/system/permission', './pages/System/Permission', 'SafetyOutlined', 30, 1, NOW(), NOW());

SET @permission_page_id = LAST_INSERT_ID();

-- 权限管理按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@permission_page_id, 2, '新增权限', 'system:permission:create', 'add', 10, 1, NOW(), NOW()),
(@permission_page_id, 2, '编辑权限', 'system:permission:update', 'edit', 20, 1, NOW(), NOW()),
(@permission_page_id, 2, '删除权限', 'system:permission:delete', 'delete', 30, 1, NOW(), NOW());

-- ============================================
-- 2. 商品管理模块
-- ============================================
-- 商品管理（顶级菜单）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (0, 1, '商品管理', 'product', '/product', './layouts/BlankLayout', 'ShoppingOutlined', 90, 1, NOW(), NOW());

SET @product_id = LAST_INSERT_ID();

-- 商品列表（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@product_id, 1, '商品列表', 'product:list', '/product/list', './pages/Product/List', 'UnorderedListOutlined', 10, 1, NOW(), NOW());

SET @product_list_id = LAST_INSERT_ID();

-- 商品列表按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@product_list_id, 2, '新增商品', 'product:create', 'add', 10, 1, NOW(), NOW()),
(@product_list_id, 2, '编辑商品', 'product:update', 'edit', 20, 1, NOW(), NOW()),
(@product_list_id, 2, '删除商品', 'product:delete', 'delete', 30, 1, NOW(), NOW()),
(@product_list_id, 2, '上架/下架', 'product:status', 'status', 40, 1, NOW(), NOW());

-- 商品分类（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@product_id, 1, '商品分类', 'product:category', '/product/category', './pages/Product/Category', 'AppstoreOutlined', 20, 1, NOW(), NOW());

SET @category_page_id = LAST_INSERT_ID();

-- 分类管理按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@category_page_id, 2, '新增分类', 'category:create', 'add', 10, 1, NOW(), NOW()),
(@category_page_id, 2, '编辑分类', 'category:update', 'edit', 20, 1, NOW(), NOW()),
(@category_page_id, 2, '删除分类', 'category:delete', 'delete', 30, 1, NOW(), NOW());

-- ============================================
-- 3. 订单管理模块
-- ============================================
-- 订单管理（顶级菜单）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (0, 1, '订单管理', 'order', '/order', './layouts/BlankLayout', 'FileTextOutlined', 80, 1, NOW(), NOW());

SET @order_id = LAST_INSERT_ID();

-- 订单列表（页面）
INSERT INTO permissions (parent_id, type, name, code, path, component, icon, sort, status, created_at, updated_at)
VALUES (@order_id, 1, '订单列表', 'order:list', '/order/list', './pages/Order/List', 'UnorderedListOutlined', 10, 1, NOW(), NOW());

SET @order_list_id = LAST_INSERT_ID();

-- 订单按钮权限
INSERT INTO permissions (parent_id, type, name, code, button_code, sort, status, created_at, updated_at) VALUES
(@order_list_id, 2, '查看详情', 'order:detail', 'detail', 10, 1, NOW(), NOW()),
(@order_list_id, 2, '发货', 'order:ship', 'ship', 20, 1, NOW(), NOW()),
(@order_list_id, 2, '取消订单', 'order:cancel', 'cancel', 30, 1, NOW(), NOW()),
(@order_list_id, 2, '退款处理', 'order:refund', 'refund', 40, 1, NOW(), NOW());
