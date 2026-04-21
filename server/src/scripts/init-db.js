#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 创建基础数据和初始管理员账号
 */

const bcrypt = require('bcryptjs');
const { sequelize, testConnection, Admin } = require('../models');
const logger = require('../utils/logger');

async function initDatabase() {
  try {
    // 连接数据库
    await testConnection();

    // 强制同步（清空数据）
    // await sequelize.sync({ force: true });
    // 同步数据库表结构（仅创建不存在的表）
    await sequelize.sync();
    logger.info('数据库表结构已创建');

    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedOperatorPassword = await bcrypt.hash('operator123', 10);

    const admins = [
      {
        username: 'admin',
        password: hashedAdminPassword,
        realName: '超级管理员',
        roleId: 1,
        status: 1
      },
      {
        username: 'operator',
        password: hashedOperatorPassword,
        realName: '运营人员',
        roleId: 2,
        status: 1
      }
    ];

    await Admin.bulkCreate(admins);
    logger.info('初始管理员创建完成');
    logger.info('默认账号: admin / admin123');
    logger.info('运营账号: operator / operator123');

    logger.info('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    logger.error('数据库初始化失败', error);
    process.exit(1);
  }
}

// 执行初始化
initDatabase();
