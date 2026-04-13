/**
 * 模型关联关系配置
 * 集中管理所有模型之间的关联
 */

const Category = require('../common/Category');
const Product = require('../common/Product');
const User = require('../client/User');
const Address = require('../client/Address');
const Cart = require('../client/Cart');
const Order = require('../client/Order');
const OrderItem = require('../client/OrderItem');
const Admin = require('../admin/Admin');
const Role = require('../admin/Role');
const Permission = require('../admin/Permission');

function setupAssociations() {
  // 订单与订单商品
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // 商品与分类
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Category.hasMany(Product, { foreignKey: 'categoryId' });

  // 管理员与角色
  Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
  Role.hasMany(Admin, { foreignKey: 'roleId' });

  // 用户与地址
  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
  Address.belongsTo(User, { foreignKey: 'userId' });

  // 用户与购物车
  User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
  Cart.belongsTo(User, { foreignKey: 'userId' });

  // 购物车与商品
  Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(Cart, { foreignKey: 'productId' });

  // 订单与用户
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

  // 订单商品与商品
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(OrderItem, { foreignKey: 'productId' });

  // 权限自关联（无限分类）
  Permission.hasMany(Permission, { foreignKey: 'parentId', as: 'children' });
  Permission.belongsTo(Permission, { foreignKey: 'parentId', as: 'parent' });

  // 按钮归属页面（子权限归属父权限）
  // 已在上面通过自关联实现，type=1 是页面，type=2 是按钮
}

module.exports = setupAssociations;
