-- Rollback: 回滚优惠券相关表
-- Created at: 2026-04-10

-- ============================================
-- 删除外键约束
-- ============================================
ALTER TABLE user_coupons DROP FOREIGN KEY IF EXISTS fk_user_coupons_user_id;
ALTER TABLE user_coupons DROP FOREIGN KEY IF EXISTS fk_user_coupons_coupon_id;
ALTER TABLE user_coupons DROP FOREIGN KEY IF EXISTS fk_user_coupons_order_id;

-- ============================================
-- 删除表
-- ============================================
DROP TABLE IF EXISTS user_coupons;
DROP TABLE IF EXISTS coupons;
