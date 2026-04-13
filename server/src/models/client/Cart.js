const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 购物车模型
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '用户ID'
  },
  productId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '商品ID'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '数量'
  },
  selected: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '是否选中：0否，1是'
  }
}, {
  tableName: 'carts',
  comment: '购物车表'
});

module.exports = Cart;
