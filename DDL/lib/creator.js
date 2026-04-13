/**
 * 数据库和表创建工具
 * 支持创建数据库、从现有模型同步表结构
 */

const fs = require('fs').promises;
const path = require('path');
const connectionManager = require('./connection');
const { current: config } = require('../config/database');

class Creator {
  /**
   * 创建数据库
   */
  async createDatabase() {
    const conn = await connectionManager.getAdminConnection();

    try {
      // 创建数据库
      await conn.execute(
        `CREATE DATABASE IF NOT EXISTS \`${config.database}\` ` +
        `CHARACTER SET ${config.charset} COLLATE ${config.collate}`
      );

      return {
        success: true,
        message: `数据库 ${config.database} 创建成功`
      };
    } catch (error) {
      return {
        success: false,
        message: `数据库创建失败: ${error.message}`
      };
    } finally {
      await conn.end();
    }
  }

  /**
   * 删除数据库
   */
  async dropDatabase() {
    const conn = await connectionManager.getAdminConnection();

    try {
      await conn.execute(`DROP DATABASE IF EXISTS \`${config.database}\``);
      return {
        success: true,
        message: `数据库 ${config.database} 已删除`
      };
    } catch (error) {
      return {
        success: false,
        message: `数据库删除失败: ${error.message}`
      };
    } finally {
      await conn.end();
    }
  }

  /**
   * 创建新的迁移文件
   */
  async createMigration(name, options = {}) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.sql`;
    const filepath = path.join(__dirname, '../migrations', filename);

    const template = options.template || this.getMigrationTemplate(name);

    await fs.writeFile(filepath, template);

    // 创建回滚文件
    const rollbackFilename = `${timestamp}_${name}.rollback.sql`;
    const rollbackFilepath = path.join(__dirname, '../migrations', rollbackFilename);
    const rollbackTemplate = options.rollbackTemplate || this.getRollbackTemplate();

    await fs.writeFile(rollbackFilepath, rollbackTemplate);

    return {
      filename,
      rollbackFilename,
      filepath,
      rollbackFilepath
    };
  }

  /**
   * 创建新的种子文件
   */
  async createSeed(name) {
    const timestamp = Date.now();
    const filename = `${timestamp}_${name}.sql`;
    const filepath = path.join(__dirname, '../seeds', filename);

    const template = this.getSeedTemplate(name);

    await fs.writeFile(filepath, template);

    return {
      filename,
      filepath
    };
  }

  /**
   * 从现有Sequelize模型同步表结构
   * 生成迁移脚本
   */
  async syncFromModels() {
    try {
      // 尝试加载server的模型
      const modelsPath = path.join(__dirname, '../../server/src/models/index.js');

      // 检查文件是否存在
      try {
        await fs.access(modelsPath);
      } catch {
        return {
          success: false,
          message: '未找到server模型文件，请确保server模块已初始化'
        };
      }

      // 动态加载模型（需要设置环境变量）
      process.env.NODE_ENV = process.env.NODE_ENV || 'development';
      const models = require(modelsPath);

      // 同步所有模型到数据库（不强制重建）
      await models.sequelize.sync({ alter: true });

      return {
        success: true,
        message: '模型同步完成，数据库表结构与模型一致'
      };
    } catch (error) {
      return {
        success: false,
        message: `模型同步失败: ${error.message}`
      };
    }
  }

  /**
   * 获取迁移文件模板
   */
  getMigrationTemplate(name) {
    return `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}

-- ============================================
-- 在此编写你的DDL变更
-- ============================================

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

`;
  }

  /**
   * 获取回滚文件模板
   */
  getRollbackTemplate() {
    return `-- Rollback
-- Created at: ${new Date().toISOString()}

-- ============================================
-- 在此编写回滚操作（与迁移操作相反）
-- ============================================

-- 示例：删除表
-- DROP TABLE IF EXISTS example_table;

-- 示例：删除字段
-- ALTER TABLE existing_table DROP COLUMN new_field;

-- 示例：删除索引
-- DROP INDEX idx_name ON example_table;

-- 示例：删除外键
-- ALTER TABLE child_table DROP FOREIGN KEY fk_parent;

`;
  }

  /**
   * 获取种子文件模板
   */
  getSeedTemplate(name) {
    return `-- Seed: ${name}
-- Created at: ${new Date().toISOString()}

-- ============================================
-- 在此编写种子数据插入语句
-- ============================================

-- 示例：插入初始数据
-- INSERT INTO roles (name, code, description, status, created_at, updated_at)
-- VALUES
--   ('超级管理员', 'super_admin', '拥有所有权限', 1, NOW(), NOW()),
--   ('运营人员', 'operator', '负责日常运营', 1, NOW(), NOW());

-- 示例：使用INSERT IGNORE避免重复插入
-- INSERT IGNORE INTO config (key, value) VALUES
-- ('site_name', '我的商城'),
-- ('site_logo', '/logo.png');

`;
  }
}

module.exports = new Creator();
