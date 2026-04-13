/**
 * 数据库连接管理
 * 提供数据库连接池和基础查询功能
 */

const mysql = require('mysql2/promise');
const { current: config } = require('../config/database');

class ConnectionManager {
  constructor() {
    this.pool = null;
  }

  /**
   * 初始化连接池
   */
  async init() {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        connectionLimit: config.connectionLimit,
        charset: config.charset,
        multipleStatements: config.multipleStatements,
        dateStrings: config.dateStrings,
        ssl: config.ssl
      });
    }
    return this.pool;
  }

  /**
   * 获取连接（不指定数据库，用于创建数据库）
   */
  async getAdminConnection() {
    return mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      multipleStatements: true
    });
  }

  /**
   * 获取连接池
   */
  async getPool() {
    if (!this.pool) {
      await this.init();
    }
    return this.pool;
  }

  /**
   * 执行SQL查询
   */
  async query(sql, params = []) {
    const pool = await this.getPool();
    const [results] = await pool.execute(sql, params);
    return results;
  }

  /**
   * 执行原始SQL（支持多条语句）
   */
  async execute(sql) {
    const pool = await this.getPool();
    const [results] = await pool.query(sql);
    return results;
  }

  /**
   * 事务执行
   */
  async transaction(callback) {
    const pool = await this.getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 关闭连接池
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// 单例模式
const connectionManager = new ConnectionManager();

module.exports = connectionManager;
