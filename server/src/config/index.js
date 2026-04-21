const path = require('path');

require('dotenv').config({
  path: (() => {
    switch (process.env.NODE_ENV) {
      case 'development':
        return path.resolve(__dirname, '../../.env.development');
      case 'production':
        return path.resolve(__dirname, '../../.env.production');
      default:
        return path.resolve(__dirname, '../../.env');
    }
  })()
});

const config = {
  // 服务端端口配置
  ports: {
    client: parseInt(process.env.CLIENT_PORT) || 3001,
    admin: parseInt(process.env.ADMIN_PORT) || 3002
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'shopping_mall',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: (process.env.SERVICE === 'client' ? process.env.JWT_EXPIRES_IN_CLIENT : process.env.JWT_EXPIRES_IN_ADMIN) || '7d'
  },

  // 环境配置
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // 日志配置
  logLevel: process.env.LOG_LEVEL || 'info',

  // CORS配置
  cors: {
    client: {
      origin: process.env.CLIENT_CORS_ORIGIN || '*',
      credentials: true
    },
    admin: {
      origin: process.env.ADMIN_CORS_ORIGIN || '*',
      credentials: true
    }
  }
};

module.exports = config;
