# 购物商城后端服务

基于 Koa.js + MySQL + Sequelize 的电商后端API服务，支持C端小程序和B端管理系统。

## 技术栈

- **框架**: Koa.js
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT
- **部署**: 支持多端口运行（client/admin分离）

## 项目结构

```
server/
├── src/
│   ├── app.js                 # 应用入口
│   ├── config/               # 配置文件
│   │   └── index.js
│   ├── models/               # 数据模型
│   │   └── index.js
│   ├── routes/               # 路由
│   │   ├── client/          # C端API路由
│   │   │   ├── index.js
│   │   │   ├── user.js
│   │   │   ├── product.js
│   │   │   ├── cart.js
│   │   │   ├── order.js
│   │   │   └── address.js
│   │   └── admin/           # B端API路由
│   │       ├── index.js
│   │       ├── auth.js
│   │       ├── user.js
│   │       ├── product.js
│   │       ├── order.js
│   │       ├── category.js
│   │       ├── role.js
│   │       └── dashboard.js
│   ├── middlewares/          # 中间件
│   │   ├── auth.js          # JWT认证
│   │   ├── cors.js          # 跨域处理
│   │   ├── errorHandler.js  # 错误处理
│   │   └── logger.js        # 请求日志
│   ├── utils/                # 工具函数
│   │   ├── logger.js
│   │   └── response.js
│   └── scripts/              # 脚本
│       └── init-db.js       # 数据库初始化
├── .env                      # 环境变量
├── .env.example              # 环境变量示例
├── package.json
└── README.md
```

## 核心特性

| 特性 | 说明 |
|-----|------|
| **双端口分离** | Client服务(3001) 和 Admin服务(3002) 完全隔离，互不干扰 |
| **统一响应格式** | 所有接口返回 `{code, message, data, timestamp}` 结构 |
| **JWT认证分离** | 两端使用独立的Token机制，安全性更高 |
| **Sequelize ORM** | 完整的Model定义，支持自动同步数据库结构 |
| **内置初始化** | 提供 `npm run init:db` 脚本快速创建表结构和测试数据 |
| **统一错误处理** | 全局错误拦截，返回标准化错误信息 |
| **请求日志** | 开发环境自动记录请求信息，便于调试 |
| **权限控制** | 基于角色的权限管理（RBAC） |


## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

### 3. 初始化数据库

```bash
npm run init:db
```

### 4. 启动服务

```bash
# 开发模式（同时启动两个服务）
npm run dev:client  # C端服务，默认端口3001
npm run dev:admin   # B端服务，默认端口3002

# 或者分别启动
npm run dev:client
npm run dev:admin

# 生产模式
npm run start:client
npm run start:admin
```

## 端口配置

| 服务类型 | 默认端口 | 说明 |
|---------|---------|------|
| C端 (client) | 3001 | 小程序端API |
| B端 (admin) | 3002 | 管理后台API |

可在 `.env` 文件中修改端口配置：
```env
CLIENT_PORT=3001
ADMIN_PORT=3002
```

## 接口文档

### C端接口 (端口: 3001)

| 接口 | 方法 | 说明 |
|-----|------|-----|
| `GET /api/health` | GET | 健康检查 |
| `POST /api/user/login` | POST | 用户登录（小程序） |
| `GET /api/user/info` | GET | 获取用户信息 |
| `GET /api/product/list` | GET | 获取商品列表 |
| `GET /api/product/detail/:id` | GET | 商品详情 |
| `GET /api/product/category` | GET | 获取分类 |
| `GET /api/cart/list` | GET | 购物车列表 |
| `POST /api/cart/add` | POST | 添加购物车 |
| `POST /api/order/create` | POST | 创建订单 |
| `GET /api/order/list` | GET | 订单列表 |
| `GET /api/address/list` | GET | 地址列表 |
| `POST /api/address/add` | POST | 添加地址 |

### B端接口 (端口: 3002)

| 接口 | 方法 | 说明 |
|-----|------|-----|
| `GET /api/health` | GET | 健康检查 |
| `POST /api/auth/login` | POST | 管理员登录 |
| `GET /api/dashboard/statistics` | GET | 统计数据 |
| `GET /api/user/list` | GET | 用户管理 |
| `GET /api/product/list` | GET | 商品列表 |
| `POST /api/product/create` | POST | 创建商品 |
| `PUT /api/product/update/:id` | PUT | 更新商品 |
| `GET /api/order/list` | GET | 订单管理 |
| `POST /api/order/ship/:id` | POST | 订单发货 |
| `GET /api/category/list` | GET | 分类管理 |
| `GET /api/role/list` | GET | 角色管理 |

## 数据模型

### 用户模型 (User)
- 微信小程序用户
- 字段: openid, nickname, avatar, phone, status

### 管理员模型 (Admin)
- 后台管理员
- 字段: username, password, realName, roleId, status

### 商品模型 (Product)
- 商品信息
- 字段: categoryId, name, subtitle, description, price, stock, status, isHot, isNew

### 订单模型 (Order)
- 订单信息
- 字段: orderNo, userId, totalAmount, payAmount, status, payTime, receiverInfo

### 购物车模型 (Cart)
- 购物车
- 字段: userId, productId, quantity, selected

### 地址模型 (Address)
- 收货地址
- 字段: userId, name, phone, province, city, district, detail, isDefault

### 角色模型 (Role)
- 权限角色
- 字段: name, code, description, permissions

### 分类模型 (Category)
- 商品分类
- 字段: parentId, name, icon, sort, status

## 默认账号

初始化数据库后会创建以下默认账号：

| 账号 | 密码 | 角色 |
|-----|------|-----|
| admin | admin123 | 超级管理员 |
| operator | operator123 | 运营人员 |

## 响应格式

统一响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "timestamp": 1699999999999
}
```

错误响应：

```json
{
  "code": 401,
  "message": "未授权，请先登录",
  "data": null,
  "timestamp": 1699999999999
}
```

分页响应：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [ ... ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "timestamp": 1699999999999
}
```

## 开发说明

1. **多端口架构**: client和admin服务分别运行在不同端口，完全隔离
2. **JWT认证**: 两个服务使用独立的认证机制
3. **统一错误处理**: 所有错误统一格式返回
4. **请求日志**: 开发环境自动记录请求信息
5. **数据库同步**: 开发环境自动同步模型变更

## 部署建议

### 使用PM2部署

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopping-client-api',
      script: './src/app.js',
      env: {
        SERVICE: 'client',
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'shopping-admin-api',
      script: './src/app.js',
      env: {
        SERVICE: 'admin',
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
```

### Nginx反向代理

```nginx
# C端API
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# B端API
server {
    listen 80;
    server_name admin-api.yourdomain.com;
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## License

MIT
