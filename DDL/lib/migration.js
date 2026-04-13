/**
 * 数据库迁移管理器
 * 管理数据库迁移脚本的执行和版本控制
 */

const fs = require('fs').promises;
const path = require('path');
const connectionManager = require('./connection');

class MigrationManager {
  constructor() {
    this.migrationsDir = path.join(__dirname, '../migrations');
    this.seedsDir = path.join(__dirname, '../seeds');
  }

  /**
   * 初始化迁移表
   */
  async initMigrationTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        batch INT NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connectionManager.execute(sql);
  }

  /**
   * 初始化种子表
   */
  async initSeedTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS _seeds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connectionManager.execute(sql);
  }

  /**
   * 获取已执行的迁移列表
   */
  async getExecutedMigrations() {
    try {
      const results = await connectionManager.query(
        'SELECT name, batch FROM _migrations ORDER BY id ASC'
      );
      return results.map(r => r.name);
    } catch (error) {
      // 表可能不存在
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  /**
   * 获取已执行的种子列表
   */
  async getExecutedSeeds() {
    try {
      const results = await connectionManager.query(
        'SELECT name FROM _seeds ORDER BY id ASC'
      );
      return results.map(r => r.name);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw error;
    }
  }

  /**
   * 获取所有迁移文件
   */
  async getMigrationFiles() {
    try {
      const files = await fs.readdir(this.migrationsDir);
      return files
        .filter(f => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
        .sort();
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * 获取所有种子文件
   */
  async getSeedFiles() {
    try {
      const files = await fs.readdir(this.seedsDir);
      return files.filter(f => f.endsWith('.sql')).sort();
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * 获取当前批次号
   */
  async getCurrentBatch() {
    const result = await connectionManager.query(
      'SELECT MAX(batch) as batch FROM _migrations'
    );
    return result[0]?.batch || 0;
  }

  /**
   * 执行迁移
   */
  async migrate() {
    await this.initMigrationTable();

    const executed = await this.getExecutedMigrations();
    const files = await this.getMigrationFiles();
    const pending = files.filter(f => !executed.includes(f));

    if (pending.length === 0) {
      return { executed: [], message: '没有待执行的迁移' };
    }

    const batch = (await this.getCurrentBatch()) + 1;
    const executedMigrations = [];

    for (const file of pending) {
      const filePath = path.join(this.migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');

      await connectionManager.transaction(async (conn) => {
        // 执行迁移SQL
        await conn.query(sql);
        // 记录迁移
        await conn.execute(
          'INSERT INTO _migrations (name, batch) VALUES (?, ?)',
          [file, batch]
        );
      });

      executedMigrations.push(file);
    }

    return {
      executed: executedMigrations,
      message: `成功执行 ${executedMigrations.length} 个迁移`
    };
  }

  /**
   * 回滚最后一次批次的迁移
   */
  async rollback() {
    const batch = await this.getCurrentBatch();

    if (batch === 0) {
      return { rolledBack: [], message: '没有可回滚的迁移' };
    }

    const migrations = await connectionManager.query(
      'SELECT name FROM _migrations WHERE batch = ? ORDER BY id DESC',
      [batch]
    );

    const rolledBack = [];

    for (const { name } of migrations) {
      const rollbackFile = path.join(
        this.migrationsDir,
        name.replace('.sql', '.rollback.sql')
      );

      try {
        const sql = await fs.readFile(rollbackFile, 'utf8');

        await connectionManager.transaction(async (conn) => {
          await conn.query(sql);
          await conn.execute(
            'DELETE FROM _migrations WHERE name = ?',
            [name]
          );
        });

        rolledBack.push(name);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // 没有回滚文件，直接删除记录
          await connectionManager.query(
            'DELETE FROM _migrations WHERE name = ?',
            [name]
          );
          rolledBack.push(`${name} (无回滚脚本)`);
        } else {
          throw error;
        }
      }
    }

    return {
      rolledBack,
      message: `成功回滚 ${rolledBack.length} 个迁移`
    };
  }

  /**
   * 执行种子数据
   */
  async seed() {
    await this.initSeedTable();

    const executed = await this.getExecutedSeeds();
    const files = await this.getSeedFiles();
    const pending = files.filter(f => !executed.includes(f));
    console.log('pending', pending);

    if (pending.length === 0) {
      return { executed: [], message: '没有待执行的种子' };
    }

    const executedSeeds = [];

    for (const file of pending) {
      const filePath = path.join(this.seedsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');

      await connectionManager.transaction(async (conn) => {
        await conn.query(sql);
        await conn.execute(
          'INSERT INTO _seeds (name) VALUES (?)',
          [file]
        );
      });

      executedSeeds.push(file);
    }

    return {
      executed: executedSeeds,
      message: `成功执行 ${executedSeeds.length} 个种子`
    };
  }

  /**
   * 回滚所有种子数据
   */
  async seedUndo() {
    const seeds = await connectionManager.query(
      'SELECT name FROM _seeds ORDER BY id DESC'
    );

    const rolledBack = [];

    for (const { name } of seeds) {
      await connectionManager.query(
        'DELETE FROM _seeds WHERE name = ?',
        [name]
      );
      rolledBack.push(name);
    }

    return {
      rolledBack,
      message: `成功标记 ${rolledBack.length} 个种子为未执行`
    };
  }

  /**
   * 获取迁移状态
   */
  async status() {
    await this.initMigrationTable();
    await this.initSeedTable();

    const allMigrations = await this.getMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    const allSeeds = await this.getSeedFiles();
    const executedSeeds = await this.getExecutedSeeds();

    return {
      migrations: {
        total: allMigrations.length,
        executed: executedMigrations.length,
        pending: allMigrations.filter(m => !executedMigrations.includes(m)),
        executedList: executedMigrations
      },
      seeds: {
        total: allSeeds.length,
        executed: executedSeeds.length,
        pending: allSeeds.filter(s => !executedSeeds.includes(s)),
        executedList: executedSeeds
      }
    };
  }

  /**
   * 重置数据库（全部回滚并重新执行）
   */
  async reset() {
    // 先回滚所有迁移
    let batch = await this.getCurrentBatch();
    const rolledBack = [];

    while (batch > 0) {
      const result = await this.rollback();
      rolledBack.push(...result.rolledBack);
      batch = await this.getCurrentBatch();
    }

    // 清除种子记录
    await connectionManager.query('DELETE FROM _seeds');

    // 重新执行所有迁移和种子
    const migrationResult = await this.migrate();
    const seedResult = await this.seed();

    return {
      rolledBack,
      migrations: migrationResult.executed,
      seeds: seedResult.executed,
      message: '数据库重置完成'
    };
  }
}

module.exports = new MigrationManager();
