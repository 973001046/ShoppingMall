const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 商品模型
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '分类ID'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '商品名称'
  },
  subtitle: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '副标题'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '商品详情'
  },
  mainImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '主图'
  },
  subImages: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '副图列表'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '售价'
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '原价'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '库存'
  },
  sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '销量'
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: '件',
    comment: '单位'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0下架，1上架，2删除'
  },
  isHot: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '是否热销：0否，1是'
  },
  isNew: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '是否新品：0否，1是'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  }
}, {
  tableName: 'products',
  comment: '商品表'
});

module.exports = Product;
