-- Migration: 添加优惠券相关表
-- Created at: 2026-04-10
-- Description: 创建优惠券表和用户优惠券领取记录表

-- ============================================
-- 1. 优惠券表 (coupons)
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '优惠券ID',
  code VARCHAR(50) NOT NULL COMMENT '优惠券编码',
  name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  type TINYINT NOT NULL DEFAULT 1 COMMENT '类型：1满减券，2折扣券，3无门槛券',
  amount DECIMAL(10, 2) NOT NULL COMMENT '优惠金额/折扣率',
  min_amount DECIMAL(10, 2) DEFAULT 0 COMMENT '最低消费金额',
  total_quantity INT NOT NULL DEFAULT 0 COMMENT '总发放数量',
  remaining_quantity INT NOT NULL DEFAULT 0 COMMENT '剩余数量',
  user_limit INT DEFAULT 1 COMMENT '每人限领数量',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  status TINYINT DEFAULT 1 COMMENT '状态：0禁用，1启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  UNIQUE KEY uk_code (code),
  INDEX idx_status (status),
  INDEX idx_start_time (start_time),
  INDEX idx_end_time (end_time),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- ============================================
-- 2. 用户优惠券表 (user_coupons)
-- ============================================
CREATE TABLE IF NOT EXISTS user_coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户优惠券ID',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  coupon_id BIGINT UNSIGNED NOT NULL COMMENT '优惠券ID',
  order_id BIGINT UNSIGNED NULL COMMENT '使用订单ID',
  status TINYINT DEFAULT 0 COMMENT '状态：0未使用，1已使用，2已过期',
  used_time DATETIME NULL COMMENT '使用时间',
  expire_time DATETIME NOT NULL COMMENT '过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',

  INDEX idx_user_id (user_id),
  INDEX idx_coupon_id (coupon_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_expire_time (expire_time),
  UNIQUE KEY uk_user_coupon (user_id, coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- ============================================
-- 添加外键约束
-- ============================================
ALTER TABLE user_coupons
  ADD CONSTRAINT fk_user_coupons_user_id
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_coupons
  ADD CONSTRAINT fk_user_coupons_coupon_id
  FOREIGN KEY (coupon_id) REFERENCES coupons(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE user_coupons
  ADD CONSTRAINT fk_user_coupons_order_id
  FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE SET NULL ON UPDATE CASCADE;
