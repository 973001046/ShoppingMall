const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 订单商品模型
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '订单ID'
  },
  productId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '商品ID'
  },
  productName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '商品名称'
  },
  productImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '商品图片'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '单价'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '数量'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '小计金额'
  }
}, {
  tableName: 'order_items',
  comment: '订单商品表'
});

module.exports = OrderItem;
