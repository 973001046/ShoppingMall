const { sequelize, testConnection } = require('./core/sequelize');
const setupAssociations = require('./core/associations');

// 导入公共模型
const Category = require('./common/Category');
const Product = require('./common/Product');

// 导入C端模型
const User = require('./client/User');
const Address = require('./client/Address');
const Cart = require('./client/Cart');
const Order = require('./client/Order');
const OrderItem = require('./client/OrderItem');

// 导入B端模型
const Admin = require('./admin/Admin');
const Role = require('./admin/Role');
const Permission = require('./admin/Permission');

// 建立模型关联关系
setupAssociations();

module.exports = {
  // 核心
  sequelize,
  testConnection,

  // 公共模型
  Category,
  Product,

  // C端模型
  User,
  Address,
  Cart,
  Order,
  OrderItem,

  // B端模型
  Admin,
  Role,
  Permission
};
