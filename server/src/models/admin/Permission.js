const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 权限模型（支持无限分类的页面路由和按钮权限）
const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  parentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
    comment: '父权限ID，0为顶级（用于无限分类）'
  },
  type: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: '类型：1页面/菜单，2按钮/操作'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '权限名称（显示用）'
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '权限编码（唯一标识，如 user:list, user:create）'
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '路由路径（仅页面类型使用，如 /user/list）'
  },
  component: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '前端组件路径（仅页面类型使用）'
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '图标（仅页面类型使用）'
  },
  buttonCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '按钮标识（仅按钮类型使用，如 add, edit, delete）'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序，值越小越靠前'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0禁用，1启用'
  }
}, {
  tableName: 'permissions',
  comment: '权限表（页面路由和按钮权限）'
});

module.exports = Permission;
