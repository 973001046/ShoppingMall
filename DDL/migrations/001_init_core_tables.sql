-- Migration: 初始化核心表结构
-- Created at: 2026-04-10
-- Description: 创建电商系统核心表（用户、管理员、角色、分类、商品、订单、购物车、地址）

-- ============================================
-- 1. 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  openid VARCHAR(100) NULL COMMENT '微信openid',
  unionid VARCHAR(100) NULL COMMENT '微信unionid',
  nickname VARCHAR(50) NULL COMMENT '昵称',
  avatar VARCHAR(255) NULL COMMENT '头像URL',
  phone VARCHAR(20) NULL COMMENT '手机号',
  email VARCHAR(100) NULL COMMENT '邮箱',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1正常',
  last_login_time DATETIME NULL COMMENT '最后登录时间',
  last_login_ip VARCHAR(50) NULL COMMENT '最后登录IP',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_openid (openid),
  INDEX idx_phone (phone),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 角色表 (roles)
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
  name VARCHAR(50) NOT NULL COMMENT '角色名称',
  code VARCHAR(50) NOT NULL COMMENT '角色编码',
  description VARCHAR(255) NULL COMMENT '角色描述',
  permissions JSON NULL COMMENT '权限列表（JSON数组）',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1正常',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY uk_code (code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ============================================
-- 3. 管理员表 (admins)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  real_name VARCHAR(50) NULL COMMENT '真实姓名',
  avatar VARCHAR(255) NULL COMMENT '头像',
  phone VARCHAR(20) NULL COMMENT '手机号',
  email VARCHAR(100) NULL COMMENT '邮箱',
  role_id BIGINT UNSIGNED NULL COMMENT '角色ID',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1正常',
  last_login_time DATETIME NULL COMMENT '最后登录时间',
  last_login_ip VARCHAR(50) NULL COMMENT '最后登录IP',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY uk_username (username),
  INDEX idx_role_id (role_id),
  INDEX idx_status (status),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================
-- 4. 商品分类表 (categories)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
  parent_id BIGINT UNSIGNED DEFAULT 0 COMMENT '父分类ID，0为顶级分类',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(255) NULL COMMENT '分类图标',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1正常',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_parent_id (parent_id),
  INDEX idx_status (status),
  INDEX idx_sort (sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- ============================================
-- 5. 商品表 (products)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  category_id BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  name VARCHAR(100) NOT NULL COMMENT '商品名称',
  subtitle VARCHAR(200) NULL COMMENT '副标题',
  description LONGTEXT NULL COMMENT '商品详情',
  main_image VARCHAR(255) NULL COMMENT '主图',
  sub_images JSON NULL COMMENT '副图列表（JSON数组）',
  price DECIMAL(10, 2) NOT NULL COMMENT '售价',
  original_price DECIMAL(10, 2) NULL COMMENT '原价',
  stock INT DEFAULT 0 COMMENT '库存',
  sales INT DEFAULT 0 COMMENT '销量',
  unit VARCHAR(20) DEFAULT '件' COMMENT '单位',
  status TINYINT DEFAULT 1 COMMENT '状态：0下架，1上架，2删除',
  is_hot TINYINT DEFAULT 0 COMMENT '是否热销：0否，1是',
  is_new TINYINT DEFAULT 0 COMMENT '是否新品：0否，1是',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_is_hot (is_hot),
  INDEX idx_is_new (is_new),
  INDEX idx_sort (sort),
  INDEX idx_price (price),
  INDEX idx_sales (sales)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- ============================================
-- 6. 订单表 (orders)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
  pay_amount DECIMAL(10, 2) NOT NULL COMMENT '实付金额',
  discount_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '优惠金额',
  freight_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '运费',
  status TINYINT DEFAULT 0 COMMENT '订单状态：0待付款，1已付款，2已发货，3已收货，4已完成，5已取消',
  pay_type TINYINT NULL COMMENT '支付方式：1微信支付',
  pay_time DATETIME NULL COMMENT '支付时间',
  ship_time DATETIME NULL COMMENT '发货时间',
  receive_time DATETIME NULL COMMENT '收货时间',
  remark VARCHAR(500) NULL COMMENT '订单备注',
  receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
  receiver_address VARCHAR(255) NOT NULL COMMENT '收货地址',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY uk_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_pay_time (pay_time),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ============================================
-- 7. 订单商品表 (order_items)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单商品ID',
  order_id BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  product_name VARCHAR(100) NOT NULL COMMENT '商品名称',
  product_image VARCHAR(255) NULL COMMENT '商品图片',
  price DECIMAL(10, 2) NOT NULL COMMENT '单价',
  quantity INT NOT NULL COMMENT '数量',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '小计金额',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- ============================================
-- 8. 购物车表 (carts)
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '购物车ID',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  product_id BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
  selected TINYINT DEFAULT 1 COMMENT '是否选中：0否，1是',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  UNIQUE KEY uk_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- ============================================
-- 9. 收货地址表 (addresses)
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '地址ID',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  province VARCHAR(50) NOT NULL COMMENT '省',
  city VARCHAR(50) NOT NULL COMMENT '市',
  district VARCHAR(50) NOT NULL COMMENT '区',
  detail VARCHAR(255) NOT NULL COMMENT '详细地址',
  is_default TINYINT DEFAULT 0 COMMENT '是否默认：0否，1是',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_user_id (user_id),
  INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';

-- ============================================
-- 添加外键约束
-- ============================================
ALTER TABLE admins
  ADD CONSTRAINT fk_admins_role_id
  FOREIGN KEY (role_id) REFERENCES roles(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE products
  ADD CONSTRAINT fk_products_category_id
  FOREIGN KEY (category_id) REFERENCES categories(id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_order_id
  FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_product_id
  FOREIGN KEY (product_id) REFERENCES products(id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE carts
  ADD CONSTRAINT fk_carts_user_id
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE carts
  ADD CONSTRAINT fk_carts_product_id
  FOREIGN KEY (product_id) REFERENCES products(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE addresses
  ADD CONSTRAINT fk_addresses_user_id
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;
