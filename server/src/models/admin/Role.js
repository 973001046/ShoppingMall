const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

// 角色模型
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '角色名称'
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '角色编码'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '角色描述'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '权限列表'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0禁用，1正常'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'roles',
  comment: '角色表'
});

module.exports = Role;
