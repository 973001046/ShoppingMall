const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 商品分类模型
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  parentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    comment: '父分类ID，0为顶级分类'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '分类名称'
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '分类图标'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0禁用，1正常'
  }
}, {
  tableName: 'categories',
  comment: '商品分类表'
});

module.exports = Category;
