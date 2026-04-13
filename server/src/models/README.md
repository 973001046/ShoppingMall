# 数据模型层架构说明

本目录包含电商系统的 Sequelize 数据模型，采用**模块化分层架构**，按业务域和端类型进行清晰隔离。

## 目录结构

```
models/
├── core/                       # 核心配置层
│   ├── sequelize.js            # Sequelize 实例与数据库连接配置
│   └── associations.js         # 模型关联关系集中管理
│
├── common/                     # 公共模型层（两端共用）
│   ├── Category.js             # 商品分类模型
│   └── Product.js              # 商品模型
│
├── client/                     # C端模型层（小程序用户端）
│   ├── User.js                 # 用户模型
│   ├── Address.js              # 收货地址模型
│   ├── Cart.js                 # 购物车模型
│   ├── Order.js                # 订单模型
│   └── OrderItem.js            # 订单商品项模型
│
├── admin/                      # B端模型层（管理后台）
│   ├── Admin.js                # 管理员模型
│   └── Role.js                 # 角色权限模型
│
└── index.js                    # 统一入口文件（保持向后兼容）
```

## 架构设计原则

### 1. 关注点分离
- **core/**: 仅包含数据库连接和配置，与业务模型完全解耦
- **common/**: 存放C端和B端都会访问的公共业务模型
- **client/**: 仅存放C端用户相关的业务模型
- **admin/**: 仅存放B端管理后台相关的业务模型

### 2. 单一职责
每个模型文件只负责一个数据表的定义，包括：
- 字段定义与类型
- 表配置（表名、注释等）
- 与当前表直接相关的方法（可选）

### 3. 关联集中管理
所有模型之间的关联关系统一在 `core/associations.js` 中配置，避免循环依赖：

```javascript
// core/associations.js
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
```

## 使用方式

### 方式一：统一导入（推荐）
```javascript
// 保持与旧代码完全兼容
const { User, Order, Product, Admin, sequelize, testConnection } = require('../models');

// 使用模型
const user = await User.findByPk(1);
const orders = await Order.findAll({ where: { userId: 1 } });
```

### 方式二：按端分类导入
```javascript
// C端路由 - 只导入C端和公共模型
const User = require('../models/client/User');
const Order = require('../models/client/Order');
const Product = require('../models/common/Product');

// B端路由 - 只导入B端和公共模型
const Admin = require('../models/admin/Admin');
const Role = require('../models/admin/Role');
const Product = require('../models/common/Product');
```

### 方式三：按需精确导入
```javascript
// 只导入需要的单个模型
const Cart = require('../models/client/Cart');
const cartItem = await Cart.findOne({ where: { userId, productId } });
```

## 模型关联速查表

| 主模型 | 关联类型 | 目标模型 | 别名 | 说明 |
|--------|----------|----------|------|------|
| Order | hasMany | OrderItem | items | 一个订单包含多个商品项 |
| OrderItem | belongsTo | Order | - | 订单项属于一个订单 |
| Product | belongsTo | Category | category | 商品属于一个分类 |
| Category | hasMany | Product | - | 分类包含多个商品 |
| Admin | belongsTo | Role | role | 管理员拥有一个角色 |
| Role | hasMany | Admin | - | 角色有多个管理员 |
| User | hasMany | Address | addresses | 用户有多个地址 |
| Address | belongsTo | User | - | 地址属于一个用户 |
| User | hasMany | Cart | cartItems | 用户有多个购物车项 |
| Cart | belongsTo | User | - | 购物车项属于一个用户 |
| Cart | belongsTo | Product | product | 购物车项关联商品详情 |
| Product | hasMany | Cart | - | 商品可存在于多个购物车 |
| User | hasMany | Order | orders | 用户有多个订单 |
| Order | belongsTo | User | user | 订单属于一个用户 |
| OrderItem | belongsTo | Product | product | 订单项关联商品详情 |
| Product | hasMany | OrderItem | - | 商品可存在于多个订单项 |

## 新增模型步骤

### 1. 确定模型所属层级
- 如果是两端共用的表（如商品、分类）→ 放入 `common/`
- 如果是C端用户专用（如购物车、地址）→ 放入 `client/`
- 如果是B端管理专用（如管理员、角色）→ 放入 `admin/`

### 2. 创建模型文件
```javascript
// models/client/Favorite.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/sequelize');

const Favorite = sequelize.define('Favorite', {
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
  }
}, {
  tableName: 'favorites',
  comment: '用户收藏表'
});

module.exports = Favorite;
```

### 3. 注册关联关系（如有需要）
```javascript
// core/associations.js
const Favorite = require('../client/Favorite');

function setupAssociations() {
  // ... 现有关联
  
  // 新增收藏关联
  User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
  Favorite.belongsTo(User, { foreignKey: 'userId' });
  Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
}
```

### 4. 在 index.js 导出
```javascript
// index.js
const Favorite = require('./client/Favorite');

module.exports = {
  // ... 其他模型
  Favorite  // 添加导出
};
```

## 注意事项

1. **不要直接修改 `core/sequelize.js` 中的配置**，除非需要调整全局数据库设置
2. **所有新增模型必须导出到 `index.js`**，保持统一入口的完整性
3. **关联关系必须集中配置**，不要在模型文件内部定义关联
4. **模型文件只包含表结构定义**，业务逻辑应放在 Service 层
5. **保持命名规范**：模型名使用 PascalCase（如 `OrderItem`），表名使用复数小写下划线（如 `order_items`）

## 与 DDL 迁移的协作

模型定义应与 `DDL/migrations/` 中的迁移脚本保持一致：

1. 先用 DDL 创建迁移脚本并执行
2. 然后在 models 中创建对应的模型文件
3. 保持字段名、类型、约束一致

示例对应关系：
| DDL 迁移 | 模型文件 |
|----------|----------|
| `001_init_core_tables.sql` | `common/`, `client/`, `admin/` 下的各模型 |
| `002_add_coupon_tables.sql` | 新增 `common/Coupon.js`, `client/UserCoupon.js` |
