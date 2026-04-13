const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 数据库配置
const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopping_mall',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    multipleStatements: true,
    dateStrings: true
  },
  test: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'shopping_mall_test',
    connectionLimit: 5,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    multipleStatements: true,
    dateStrings: true
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 20,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    multipleStatements: true,
    dateStrings: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
};

// 获取当前环境配置
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`不支持的环境: ${env}`);
}

module.exports = {
  config,
  current: dbConfig,
  env
};
