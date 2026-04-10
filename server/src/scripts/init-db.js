#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 创建基础数据和初始管理员账号
 */

const bcrypt = require('bcryptjs');
const { sequelize, testConnection, User, Admin, Role, Category, Product } = require('../models');
const logger = require('../utils/logger');

async function initDatabase() {
  try {
    // 连接数据库
    await testConnection();

    // 强制同步（清空数据）
    await sequelize.sync({ force: true });
    logger.info('数据库表结构已创建');

    // 创建初始角色
    const roles = [
      {
        name: '超级管理员',
        code: 'super_admin',
        description: '拥有所有权限',
        permissions: ['*']
      },
      {
        name: '运营人员',
        code: 'operator',
        description: '负责日常运营',
        permissions: [
          'product:list', 'product:create', 'product:update', 'product:delete',
          'order:list', 'order:update',
          'category:list', 'category:create', 'category:update', 'category:delete'
        ]
      },
      {
        name: '客服人员',
        code: 'customer_service',
        description: '负责客户服务',
        permissions: [
          'order:list', 'order:update',
          'user:list'
        ]
      }
    ];

    const createdRoles = await Role.bulkCreate(roles);
    logger.info('初始角色创建完成');

    // 创建初始管理员
    const superAdminRole = createdRoles[0];

    const admins = [
      {
        username: 'admin',
        password: 'admin123', // 生产环境应该加密
        realName: '超级管理员',
        roleId: superAdminRole.id,
        status: 1
      },
      {
        username: 'operator',
        password: 'operator123',
        realName: '运营人员',
        roleId: createdRoles[1].id,
        status: 1
      }
    ];

    await Admin.bulkCreate(admins);
    logger.info('初始管理员创建完成');
    logger.info('默认账号: admin / admin123');
    logger.info('运营账号: operator / operator123');

    // 创建示例分类
    const categories = [
      { name: '数码家电', icon: 'icon-electronics', sort: 100 },
      { name: '服装鞋帽', icon: 'icon-clothing', sort: 90 },
      { name: '食品生鲜', icon: 'icon-food', sort: 80 },
      { name: '家居家装', icon: 'icon-home', sort: 70 },
      { name: '美妆护肤', icon: 'icon-beauty', sort: 60 },
      {
        name: '手机',
        parentId: 1,
        icon: 'icon-phone',
        sort: 50
      },
      {
        name: '电脑',
        parentId: 1,
        icon: 'icon-computer',
        sort: 40
      }
    ];

    const createdCategories = await Category.bulkCreate(categories);
    logger.info('示例分类创建完成');

    // 创建示例商品
    const products = [
      {
        categoryId: createdCategories[5].id, // 手机分类
        name: 'iPhone 15 Pro',
        subtitle: '钛金属边框，A17 Pro芯片',
        description: '<p>Apple iPhone 15 Pro 配备强大的A17 Pro芯片...</p>',
        mainImage: 'https://example.com/iphone15pro.jpg',
        price: 7999.00,
        originalPrice: 8999.00,
        stock: 100,
        sales: 50,
        isHot: 1,
        isNew: 1,
        sort: 100,
        status: 1
      },
      {
        categoryId: createdCategories[6].id, // 电脑分类
        name: 'MacBook Pro 14英寸',
        subtitle: 'M3芯片，专业级性能',
        description: '<p>MacBook Pro 14英寸配备M3芯片...</p>',
        mainImage: 'https://example.com/macbook.jpg',
        price: 14999.00,
        originalPrice: 15999.00,
        stock: 50,
        sales: 20,
        isHot: 1,
        isNew: 0,
        sort: 90,
        status: 1
      },
      {
        categoryId: createdCategories[0].id, // 数码家电
        name: '索尼 WH-1000XM5',
        subtitle: '行业领先的降噪耳机',
        description: '<p>索尼 WH-1000XM5 无线降噪耳机...</p>',
        mainImage: 'https://example.com/sony-headphone.jpg',
        price: 2499.00,
        originalPrice: 2999.00,
        stock: 200,
        sales: 100,
        isHot: 1,
        isNew: 0,
        sort: 80,
        status: 1
      }
    ];

    await Product.bulkCreate(products);
    logger.info('示例商品创建完成');

    logger.info('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    logger.error('数据库初始化失败', error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();
