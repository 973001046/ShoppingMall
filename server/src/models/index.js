const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const logger = require('../utils/logger');

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    pool: config.database.pool,
    logging: config.isDev ? (msg) => logger.debug(msg) : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
  } catch (error) {
    logger.error('数据库连接失败:', error.message);
    process.exit(1);
  }
}

// 用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '微信openid'
  },
  unionid: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '微信unionid'
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '昵称'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '头像URL'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '邮箱'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0禁用，1正常'
  },
  lastLoginTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间'
  },
  lastLoginIp: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '最后登录IP'
  }
}, {
  tableName: 'users',
  comment: '用户表'
});

// 管理员模型
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '密码（加密）'
  },
  realName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '真实姓名'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '头像'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '邮箱'
  },
  roleId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '角色ID'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态：0禁用，1正常'
  },
  lastLoginTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间'
  },
  lastLoginIp: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '最后登录IP'
  }
}, {
  tableName: 'admins',
  comment: '管理员表'
});

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
  }
}, {
  tableName: 'roles',
  comment: '角色表'
});

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

// 地址模型
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

// 建立关联关系
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(Admin, { foreignKey: 'roleId' });

module.exports = {
  sequelize,
  testConnection,
  User,
  Admin,
  Role,
  Category,
  Product,
  Order,
  OrderItem,
  Cart,
  Address
};
