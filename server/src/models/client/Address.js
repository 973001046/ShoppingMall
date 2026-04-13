const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 收货地址模型
const Address = sequelize.define('Address', {
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
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '收货人姓名'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '手机号'
  },
  province: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '省'
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '市'
  },
  district: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '区'
  },
  detail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '详细地址'
  },
  isDefault: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '是否默认：0否，1是'
  }
}, {
  tableName: 'addresses',
  comment: '收货地址表'
});

module.exports = Address;
