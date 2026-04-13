const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 订单模型
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  orderNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '订单编号'
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '用户ID'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '订单总金额'
  },
  payAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '实付金额'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '优惠金额'
  },
  freightAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '运费'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '订单状态：0待付款，1已付款，2已发货，3已收货，4已完成，5已取消'
  },
  payType: {
    type: DataTypes.TINYINT,
    allowNull: true,
    comment: '支付方式：1微信支付'
  },
  payTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付时间'
  },
  shipTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '发货时间'
  },
  receiveTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '收货时间'
  },
  remark: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '订单备注'
  },
  receiverName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '收货人姓名'
  },
  receiverPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '收货人电话'
  },
  receiverAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '收货地址'
  }
}, {
  tableName: 'orders',
  comment: '订单表'
});

module.exports = Order;
