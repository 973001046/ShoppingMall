-- Rollback: 回滚初始化核心表结构
-- Created at: 2026-04-10

-- ============================================
-- 删除外键约束
-- ============================================
ALTER TABLE admins DROP FOREIGN KEY IF EXISTS fk_admins_role_id;
ALTER TABLE products DROP FOREIGN KEY IF EXISTS fk_products_category_id;
ALTER TABLE order_items DROP FOREIGN KEY IF EXISTS fk_order_items_order_id;
ALTER TABLE order_items DROP FOREIGN KEY IF EXISTS fk_order_items_product_id;
ALTER TABLE carts DROP FOREIGN KEY IF EXISTS fk_carts_user_id;
ALTER TABLE carts DROP FOREIGN KEY IF EXISTS fk_carts_product_id;
ALTER TABLE addresses DROP FOREIGN KEY IF EXISTS fk_addresses_user_id;

-- ============================================
-- 删除表
-- ============================================
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
