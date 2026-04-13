const { Sequelize } = require('sequelize');
const config = require('../../config');
const logger = require('../../utils/logger');

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    pool: config.database.pool,
    logging: config.isDev ? (msg) => logger.debug(msg) : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
  } catch (error) {
    logger.error('数据库连接失败:', error.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  testConnection
};
