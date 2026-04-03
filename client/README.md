# 咖啡小站 - C端小程序

基于 Taro 4.x + React + Taro UI 构建的电商小程序项目。

## 技术栈

- **框架**: Taro 4.x (React 语法)
- **UI 组件库**: Taro UI
- **状态管理**: Redux + Redux Toolkit
- **样式**: Less
- **网络请求**: Axios (已预留)

## 项目结构

```
src/
├── components/           # 可复用组件
│   ├── Banner/          # 轮播图组件
│   ├── CategoryGrid/    # 分类网格组件
│   ├── ProductCard/     # 商品卡片组件
│   ├── SkuSelector/    # 规格选择器组件
│   ├── StoreEntry/      # 门店入口组件
│   ├── LoadMore/        # 加载更多组件
│   └── index.js         # 组件导出
├── mock/               # Mock 数据
│   └── index.js         # 所有 mock 数据和 API
├── pages/              # 页面
│   ├── index/           # 首页
│   │   ├── index.jsx
│   │   ├── index.less
│   │   └── index.config.js
│   └── user-center/     # 个人中心
│       ├── index.jsx
│       ├── index.less
│       └── index.config.js
├── store/              # Redux Store
│   ├── index.js         # Store 配置
│   └── slices/          # Slice
│       ├── cartSlice.js # 购物车状态
│       └── userSlice.js # 用户状态
├── app.js              # 应用入口
├── app.config.js       # 应用配置
└── app.less            # 全局样式
```

#### 商品组件设计

```
ProductCard/
├── ProductCard (单个商品卡片)
├── ProductGrid (网格布局)
├── ProductScroll (横向滚动)
└── ProductListView (列表布局)
ProductList (统一入口)
├── layout='grid' → 渲染 ProductGrid
├── layout='scroll' → 渲染 ProductScroll
└── layout='list' → 渲染 ProductListView
```

###### 使用方式：

 1.统一入口（简洁）：
 ```
  <ProductList layout='grid' options={{ columnNum: 2 }} products={products} />
  <ProductList layout='scroll' options={{ title: '热门' }} products={products} />
  <ProductList layout='list' products={products} />
 ```

 2.直接使用子组件（更细粒度控制）：
  ```
    import { ProductGrid, ProductScroll, ProductListView } from '../../components';
    <ProductGrid columnNum={3} products={products} />
    <ProductScroll title="推荐" products={products} />
    <ProductListView products={products} />
  ```

  ┌──────────────────────────────┐
  │ ┌──────────┐ ┌─────────────┐ │
  │ │          │ │ 商品名称      │ │
  │ │  商品图   │ │ 描述文字...   │ │
  │ │  240x240 │ │ 已售 1234    │ │
  │ │          │ │              │ │
  │ └──────────┘ │ ¥28    [+]   │ │
  │              └─────────────┘ │
  ├──────────────────────────────┤  ← 渐变分隔线
  │ ┌──────────┐ ┌─────────────┐ │
  │ │          │ │ 商品名称      │ │
  │ │  商品图   │ │ 描述文字...   │ │
  │ └──────────┘ └─────────────┘ │
  └──────────────────────────────┘

## 快速开始

### 1. 安装依赖

```bash
cd client
yarn add @reduxjs/toolkit react-redux axios
```

### 2. 运行项目

```bash
# 微信小程序
yarn dev:weapp

# H5
yarn dev:h5

# 其他平台请参考 package.json 中的 scripts
```

## 功能模块

### 首页 (pages/index)
- 顶部搜索栏
- 轮播图展示
- 分类导航（咖啡、茶饮、轻食等）
- 附近门店入口
- 热门推荐（横向滚动）
- 推荐商品列表（网格布局）
- 下拉刷新
- 上拉加载更多
- 购物车快捷入口

### 个人中心 (pages/user-center)
- 用户信息/头像
- 会员等级和积分
- 订单状态追踪
- 我的优惠券
- 地址管理
- 客服入口
- 设置

## 核心组件

### 1. Banner 轮播图
支持图片懒加载、自动播放、循环播放。

### 2. CategoryGrid 分类网格
支持自定义列数，点击回调。

### 3. ProductCard 商品卡片
支持两种布局方式（vertical/horizontal），显示标签、销量、折扣信息。

### 4. SkuSelector 规格选择器
核心特性：
- 多维度规格选择（温度、冰度、糖度、杯型等）
- **联动规则支持**：如选择热饮时自动隐藏冰度选项
- 价格实时计算
- 可扩展的规格模板

### 5. StoreEntry 门店入口
显示最近门店信息，支持营业状态展示。

### 6. LoadMore 加载状态
支持三种状态：加载中、无更多数据、更多。

## 状态管理

### 购物车 (cartSlice)
- 添加商品（支持规格）
- 移除商品
- 更新数量
- 选中/取消选中
- 本地存储持久化

### 用户 (userSlice)
- 用户信息管理
- 地址管理
- 优惠券管理
- 本地存储持久化

## 规格系统（Sku）

### 规格模板设计

```javascript
// 示例：咖啡规格模板
{
  dimensions: [
    {
      id: 'temperature',
      name: '温度',
      options: [
        { id: 'hot', name: '热', icon: '🔥' },
        { id: 'cold', name: '冰', icon: '🧊' }
      ],
      // 联动规则：当选择热饮时，隐藏冰度选项
      rules: {
        hideWhen: { temperature: 'hot' },
        target: 'iceLevel'
      }
    },
    {
      id: 'iceLevel',
      name: '冰度',
      options: [
        { id: 'normal', name: '正常冰' },
        { id: 'less', name: '少冰' },
        { id: 'no', name: '去冰' }
      ]
    }
  ]
}
```

### 扩展新规格

在 `mock/index.js` 中的 `mockSkuTemplates` 添加新的模板即可。

## Mock 数据

所有数据都在 `src/mock/index.js` 中，便于后续替换为真实接口：

```javascript
// 使用示例
import { mockApi } from '../../mock';

// 获取商品列表
const response = await mockApi.getProducts(page, pageSize);
```

## 开发注意事项

1. **图片懒加载**：所有商品图片都使用了 `lazyLoad` 属性
2. **本地存储**：购物车和用户数据自动持久化到 `localStorage`
3. **样式规范**：使用 `px` 单位，Taro 会自动转换为对应平台的单位
4. **主题色**：主要使用 `#FF6B6B` 作为品牌色

## 待完善页面（需额外开发）

- 商品详情页 (`pages/product/detail`)
- 分类详情页 (`pages/category/detail`)
- 购物车页 (`pages/cart/index`)
- 订单列表页 (`pages/order/list`)
- 优惠券页 (`pages/coupon/list`)
- 地址管理页 (`pages/address/list`)
- 客服页 (`pages/service/index`)
- 设置页 (`pages/settings/index`)
- 搜索页 (`pages/search/result`)
- 门店列表页 (`pages/store/list`)

## 性能优化建议

1. 使用图片 CDN 并开启 WebP 格式
2. 对长列表使用虚拟滚动
3. 接口请求添加缓存策略
4. 骨架屏提升感知性能

## 许可证

MIT
