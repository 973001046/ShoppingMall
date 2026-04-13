-- Seed: 初始化商品分类数据
-- Created at: 2026-04-10

-- ============================================
-- 插入初始商品分类数据
-- ============================================
INSERT INTO categories (parent_id, name, icon, sort, status, created_at, updated_at)
VALUES
  -- 一级分类
  (0, '数码家电', 'icon-electronics', 100, 1, NOW(), NOW()),
  (0, '服装鞋帽', 'icon-clothing', 90, 1, NOW(), NOW()),
  (0, '食品生鲜', 'icon-food', 80, 1, NOW(), NOW()),
  (0, '家居家装', 'icon-home', 70, 1, NOW(), NOW()),
  (0, '美妆护肤', 'icon-beauty', 60, 1, NOW(), NOW()),
  (0, '运动户外', 'icon-sports', 50, 1, NOW(), NOW()),
  (0, '图书文具', 'icon-books', 40, 1, NOW(), NOW()),

  -- 二级分类（数码家电下）
  (1, '手机', 'icon-phone', 95, 1, NOW(), NOW()),
  (1, '电脑', 'icon-computer', 90, 1, NOW(), NOW()),
  (1, '摄影摄像', 'icon-camera', 85, 1, NOW(), NOW()),
  (1, '智能设备', 'icon-smart', 80, 1, NOW(), NOW()),

  -- 二级分类（服装鞋帽下）
  (2, '男装', 'icon-men', 85, 1, NOW(), NOW()),
  (2, '女装', 'icon-women', 80, 1, NOW(), NOW()),
  (2, '童装', 'icon-kids', 75, 1, NOW(), NOW()),
  (2, '运动鞋', 'icon-sneakers', 70, 1, NOW(), NOW());
