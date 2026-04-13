# Shopping Mall DDL 数据库管理工具

基于 MySQL 的数据库版本管理工具，支持迁移脚本、种子数据、回滚操作和模型同步。

## 目录结构

```
DDL/
├── cli.js                          # 命令行工具入口
├── package.json                    # 依赖配置
├── .env                            # 环境变量（需自行创建）
├── .env.example                    # 环境变量示例
├── config/
│   └── database.js                 # 数据库配置
├── lib/
│   ├── connection.js               # 数据库连接管理
│   ├── migration.js                # 迁移核心逻辑
│   └── creator.js                  # 数据库/表创建工具
├── migrations/                     # 迁移脚本目录
│   ├── 001_init_core_tables.sql
│   ├── 001_init_core_tables.rollback.sql
│   ├── 002_add_coupon_tables.sql
│   └── 002_add_coupon_tables.rollback.sql
└── seeds/                          # 种子数据目录
    ├── 001_roles.sql
    ├── 002_admins.sql
    └── 003_categories.sql
```

## 快速开始

### 1. 安装依赖

```bash
cd DDL
npm install
```

### 2. 配置数据库连接

复制环境变量示例文件并修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopping_mall
DB_CONNECTION_LIMIT=10
NODE_ENV=development
```

### 3. 创建数据库

```bash
npm run db:create
```

### 4. 执行迁移（创建表结构）

```bash
npm run db:migrate
```

### 5. 导入种子数据

```bash
npm run db:seed
```

## 命令参考

### 数据库管理

| 命令 | 说明 |
|------|------|
| `npm run db:create` | 创建数据库 |
| `npm run db:migrate` | 执行所有待处理的迁移 |
| `npm run db:migrate:undo` | 回滚最后一次批次的迁移 |
| `npm run db:seed` | 执行所有待处理的种子 |
| `npm run db:seed:undo` | 标记所有种子为未执行 |
| `npm run db:reset` | 重置数据库（回滚并重新执行所有迁移和种子） |
| `npm run db:status` | 查看迁移和种子的状态 |
| `npm run db:sync` | 从 Sequelize 模型同步表结构 |

### 文件创建

| 命令 | 说明 |
|------|------|
| `npm run migration:create <name>` | 创建新的迁移文件和回滚文件 |
| `npm run seed:create <name>` | 创建新的种子文件 |

示例：

```bash
# 创建添加用户等级的迁移
npm run migration:create add_user_level

# 创建添加初始配置的种子
npm run seed:create add_initial_config
```

## 迁移文件规范

### 命名规则

迁移文件使用 `{timestamp}_{name}.sql` 格式，例如：
- `001_init_core_tables.sql`
- `002_add_coupon_tables.sql`

### 文件内容规范

每个迁移文件应包含：
1. 文件注释（说明用途）
2. 完整的 DDL 语句（CREATE、ALTER、DROP 等）
3. 适当的索引和约束

示例：

```sql
-- Migration: 添加优惠券表
-- Created at: 2026-04-10
-- Description: 创建优惠券表

CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL COMMENT '优惠券编码',
  -- ... 更多字段
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_code (code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';
```

### 回滚文件

每个迁移文件都应有对应的回滚文件，命名格式为 `{timestamp}_{name}.rollback.sql`

回滚文件应包含与迁移相反的操作：

```sql
-- Rollback: 回滚优惠券表
-- Created at: 2026-04-10

-- 删除外键
ALTER TABLE user_coupons DROP FOREIGN KEY IF EXISTS fk_user_coupons_coupon_id;

-- 删除表
DROP TABLE IF EXISTS coupons;
```

## 种子数据规范

种子文件用于插入初始数据，命名格式与迁移文件相同。

### 最佳实践

1. 使用 `INSERT IGNORE` 避免重复插入
2. 使用 `REPLACE INTO` 更新现有数据
3. 包含必要的注释说明

示例：

```sql
-- Seed: 初始化角色数据
-- Created at: 2026-04-10

INSERT INTO roles (name, code, description, status, created_at, updated_at)
VALUES
  ('超级管理员', 'super_admin', '拥有所有权限', 1, NOW(), NOW()),
  ('运营人员', 'operator', '负责日常运营', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);
```

## 版本管理表

系统自动维护以下两个内部表：

### _migrations 表

记录已执行的迁移：
- `id`: 自增ID
- `name`: 迁移文件名
- `batch`: 执行批次号
- `executed_at`: 执行时间

### _seeds 表

记录已执行的种子：
- `id`: 自增ID
- `name`: 种子文件名
- `executed_at`: 执行时间

## 与 Sequelize 模型集成

如果你使用 Sequelize ORM，可以通过以下方式保持 DDL 和模型同步：

### 方式1：从模型同步到数据库（快速开发）

```bash
npm run db:sync
```

这会直接根据 `server/src/models/` 中的模型定义更新数据库表结构。

### 方式2：模型与 DDL 保持一致（推荐）

1. 先在 `migrations/` 中编写迁移脚本
2. 执行迁移：`npm run db:migrate`
3. 更新 `server/src/models/` 中的模型定义

## 多环境支持

支持 `development`、`test`、`production` 三种环境。

通过环境变量控制：

```bash
# 开发环境（默认）
npm run db:migrate

# 测试环境
NODE_ENV=test npm run db:migrate

# 生产环境
NODE_ENV=production npm run db:migrate
```

## 工作流示例

### 添加新表的工作流

```bash
# 1. 创建迁移文件
npm run migration:create add_product_reviews

# 2. 编辑 migrations/xxx_add_product_reviews.sql，添加建表语句

# 3. 编辑 migrations/xxx_add_product_reviews.rollback.sql，添加回滚语句

# 4. 执行迁移
npm run db:migrate

# 5. 查看状态确认
npm run db:status
```

### 修改现有表的工作流

```bash
# 1. 创建迁移文件
npm run migration:create modify_user_add_level

# 2. 编辑迁移文件，添加 ALTER TABLE 语句
-- ALTER TABLE users
--   ADD COLUMN level TINYINT DEFAULT 1 COMMENT '用户等级' AFTER status,
--   ADD INDEX idx_level (level);

# 3. 编辑回滚文件
-- ALTER TABLE users
--   DROP COLUMN level,
--   DROP INDEX idx_level;

# 4. 执行迁移
npm run db:migrate
```

## 故障排除

### 迁移执行失败

1. 检查数据库连接配置是否正确
2. 查看 SQL 语句语法是否有误
3. 检查是否有外键约束冲突

### 回滚失败

1. 确保对应的 `.rollback.sql` 文件存在
2. 检查回滚 SQL 是否正确
3. 手动修复后，可以直接操作 `_migrations` 表删除记录

### 重置开发环境

```bash
# 完全重置（数据会丢失）
npm run db:reset
```

## 设计原则

1. **版本化**：所有数据库变更都通过版本化的迁移脚本管理
2. **可回滚**：每个迁移都有对应的回滚操作
3. **原子性**：每个迁移在事务中执行，失败自动回滚
4. **可追溯**：通过 `_migrations` 表记录执行历史
5. **环境隔离**：支持多环境配置，互不干扰
