/**
 * Mock 数据模块
 * 便于后续替换为真实接口
 */

// 轮播图数据
export const mockBanners = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/848989ed53776bc1e1e1b1d60ab77c32/750/500?text=新品上市',
    linkUrl: '/pages/detail/detail?id=1',
    title: '新品上市'
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/848989ed53776bc1e1e1b1d60ab77c32/750/500?text=限时特惠',
    linkUrl: '/pages/detail/detail?id=2',
    title: '限时特惠'
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/848989ed53776bc1e1e1b1d60ab77c32/750/500?text=会员专享',
    linkUrl: '/pages/detail/detail?id=3',
    title: '会员专享'
  }
];

// 分类导航数据
export const mockCategories = [
  { id: 1, name: '咖啡', icon: 'https://via.placeholder.com/80/FF6B6B/FFFFFF?text=咖啡', color: '#FF6B6B' },
  { id: 2, name: '茶饮', icon: 'https://via.placeholder.com/80/4ECDC4/FFFFFF?text=茶饮', color: '#4ECDC4' },
  { id: 3, name: '轻食', icon: 'https://via.placeholder.com/80/95E1D3/FFFFFF?text=轻食', color: '#95E1D3' },
  { id: 4, name: '甜点', icon: 'https://via.placeholder.com/80/F38181/FFFFFF?text=甜点', color: '#F38181' },
  { id: 5, name: '面包', icon: 'https://via.placeholder.com/80/AA96DA/FFFFFF?text=面包', color: '#AA96DA' },
  { id: 6, name: '周边', icon: 'https://via.placeholder.com/80/FCBAD3/FFFFFF?text=周边', color: '#FCBAD3' },
  { id: 7, name: '咖啡豆', icon: 'https://via.placeholder.com/80/A8D8EA/FFFFFF?text=咖啡豆', color: '#A8D8EA' },
  { id: 8, name: '全部', icon: 'https://via.placeholder.com/80/FFD93D/FFFFFF?text=全部', color: '#FFD93D' }
];

// 商品规格模板
export const mockSkuTemplates = {
  // 咖啡规格模板
  coffee: {
    dimensions: [
      {
        id: 'temperature',
        name: '温度',
        options: [
          { id: 'hot', name: '热', icon: '🔥', price: 10 },
          { id: 'cold', name: '冰', icon: '🧊' }
        ],
        // 当选择热饮时，隐藏冰度选项
        rules: {
          hideWhen: { temperature: 'hot'},
          target: 'iceLevel'
        }
      },
      {
        id: 'iceLevel',
        name: '冰度',
        type: 'single',
        options: [
          { id: 'normal', name: '正常冰' },
          { id: 'less', name: '少冰' },
          { id: 'no', name: '去冰' }
        ]
      },
      {
        id: 'sugar',
        name: '糖度',
        type: 'single',
        options: [
          { id: 'normal', name: '标准糖' },
          { id: 'less70', name: '七分糖' },
          { id: 'less50', name: '半糖' },
          { id: 'less30', name: '三分糖' },
          { id: 'no', name: '不另外加糖' }
        ]
      },
      {
        id: 'size',
        name: '杯型',
        type: 'single',
        options: [
          { id: 'medium', name: '中杯', price: 0 },
          { id: 'large', name: '大杯', price: 3 }
        ]
      }
    ]
  },
  // 茶饮规格模板
  tea: {
    dimensions: [
      {
        id: 'temperature',
        name: '温度',
        type: 'single',
        options: [
          { id: 'hot', name: '热', icon: '🔥' },
          { id: 'cold', name: '冰', icon: '🧊' }
        ],
        rules: {
          hideWhen: { temperature: 'hot' },
          target: 'iceLevel'
        }
      },
      {
        id: 'iceLevel',
        name: '冰度',
        type: 'single',
        options: [
          { id: 'normal', name: '正常冰' },
          { id: 'less', name: '少冰' },
          { id: 'no', name: '去冰' }
        ]
      },
      {
        id: 'sugar',
        name: '糖度',
        type: 'single',
        options: [
          { id: 'normal', name: '标准糖' },
          { id: 'less70', name: '七分糖' },
          { id: 'less50', name: '半糖' },
          { id: 'less30', name: '三分糖' },
          { id: 'no', name: '无糖' }
        ]
      }
    ]
  },
  // 轻食规格模板 - 份量单选 + 酱料多选
  food: {
    dimensions: [
      {
        id: 'portion',
        name: '份量',
        type: 'single',
        options: [
          { id: 'regular', name: '标准份', price: 0 },
          { id: 'large', name: '大份', price: 5 }
        ]
      },
      {
        id: 'sauce',
        name: '酱料（可多选）',
        type: 'multiple',
        maxSelect: 2,
        options: [
          { id: 'caesar', name: '凯撒酱', price: 0 },
          { id: 'vinaigrette', name: '油醋汁', price: 0 },
          { id: 'ranch', name: 'ranch酱', price: 0 },
          { id: 'none', name: '无酱料', exclusive: true }
        ]
      }
    ]
  },
  // 咖啡豆规格 - 加购配件多选
  coffeeBean: {
    dimensions: [
      {
        id: 'roast',
        name: '烘焙度',
        type: 'single',
        options: [
          { id: 'light', name: '浅烘' },
          { id: 'medium', name: '中烘' },
          { id: 'dark', name: '深烘' }
        ]
      },
      {
        id: 'grind',
        name: '研磨度',
        type: 'single',
        options: [
          { id: 'whole', name: '咖啡豆' },
          { id: 'coarse', name: '粗粉' },
          { id: 'medium', name: '中粉' },
          { id: 'fine', name: '细粉' }
        ]
      },
      {
        id: 'addons',
        name: '加购配件（可多选）',
        type: 'multiple',
        maxSelect: 3,
        options: [
          { id: 'filter', name: '滤纸', price: 5 },
          { id: 'spoon', name: '咖啡勺', price: 8 },
          { id: 'bag', name: '密封袋', price: 3 },
          { id: 'none', name: '不需要', price: 0, exclusive: true }
        ]
      }
    ]
  }
};

// 推荐商品数据
export const mockProducts = [
  {
    id: 1,
    name: '生椰拿铁',
    description: '浓郁咖啡与清甜椰乳的完美融合浓郁咖啡与清甜椰乳的完美融合浓郁咖啡与清甜椰乳的完美融合',
    price: 22,
    originalPrice: 28,
    imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=生椰拿铁',
    categoryId: 1,
    tag: '爆款',
    sales: 1523,
    allowMultiple: true, // 允许多份购买
    skuTemplate: 'coffee',
    specs: {
      default: {
        temperature: 'cold',
        iceLevel: 'normal',
        sugar: 'normal',
        size: 'medium'
      }
    }
  },
  {
    id: 2,
    name: '燕麦拿铁',
    description: '植物基燕麦奶，健康新选择',
    price: 24,
    originalPrice: 30,
    allowMultiple: true,
    imageUrl: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=燕麦拿铁',
    categoryId: 1,
    tag: '新品',
    sales: 892,
    skuTemplate: 'coffee',
    specs: {
      default: {
        temperature: 'hot',
        iceLevel: 'normal',
        sugar: 'normal',
        size: 'medium'
      }
    }
  },
  {
    id: 3,
    name: '芝士草莓茶',
    description: '新鲜草莓配芝士奶盖',
    price: 18,
    originalPrice: 22,
    imageUrl: 'https://via.placeholder.com/300x300/95E1D3/FFFFFF?text=芝士草莓茶',
    categoryId: 2,
    tag: '人气',
    sales: 2341,
    allowMultiple: true,
    skuTemplate: 'tea',
    specs: {
      default: {
        temperature: 'cold',
        iceLevel: 'normal',
        sugar: 'normal'
      }
    }
  },
  {
    id: 4,
    name: '凯撒沙拉',
    description: '新鲜蔬菜配帕玛森芝士',
    price: 32,
    originalPrice: 38,
    imageUrl: 'https://via.placeholder.com/300x300/A8D8EA/FFFFFF?text=凯撒沙拉',
    categoryId: 3,
    tag: '健康',
    sales: 567,
    allowMultiple: true,
    skuTemplate: 'food',
    specs: {
      default: {
        portion: 'regular',
        sauce: 'caesar'
      }
    }
  },
  {
    id: 5,
    name: '提拉米苏',
    description: '经典意式甜点',
    price: 28,
    originalPrice: 32,
    imageUrl: 'https://via.placeholder.com/300x300/F38181/FFFFFF?text=提拉米苏',
    categoryId: 4,
    tag: '甜点',
    sales: 789,
    allowMultiple: false, // 不允许多份购买
    skuTemplate: null
  },
  {
    id: 6,
    name: '美式咖啡',
    description: '经典美式，纯粹醇香',
    price: 15,
    originalPrice: 1800,
    imageUrl: 'https://via.placeholder.com/300x300/FFD93D/FFFFFF?text=美式咖啡',
    categoryId: 1,
    tag: '超值',
    sales: 3456,
    allowMultiple: true,
    skuTemplate: 'coffee',
    specs: {
      default: {
        temperature: 'hot',
        iceLevel: 'normal',
        sugar: 'normal',
        size: 'medium'
      }
    }
  }
];

// 门店数据
export const mockStores = [
  {
    id: 1,
    name: '中央公园店',
    address: '中央公园购物中心1楼A101',
    distance: '0.5km',
    businessHours: '08:00-22:00',
    phone: '400-123-4567',
    status: '营业中'
  },
  {
    id: 2,
    name: '万达广场店',
    address: '万达广场3楼B305',
    distance: '1.2km',
    businessHours: '09:00-21:30',
    phone: '400-123-4568',
    status: '营业中'
  },
  {
    id: 3,
    name: '国贸中心店',
    address: '国贸中心负一楼C08',
    distance: '2.5km',
    businessHours: '07:30-21:00',
    phone: '400-123-4569',
    status: '休息中'
  }
];

// 用户信息
export const mockUserInfo = {
  id: 1,
  nickname: '咖啡爱好者',
  avatarUrl: 'https://via.placeholder.com/100/FF6B6B/FFFFFF?text=User',
  phone: '138****8888',
  memberLevel: '金牌会员',
  memberPoints: 2580,
  coupons: [
    { id: 1, name: '新人5折券', type: 'discount', value: 50, minAmount: 20, validDate: '2026-12-31', status: 'valid' },
    { id: 2, name: '满30减10', type: 'minus', value: 10, minAmount: 30, validDate: '2026-06-30', status: 'valid' },
    { id: 3, name: '免配送费', type: 'freeDelivery', value: 0, minAmount: 0, validDate: '2026-05-31', status: 'valid' }
  ]
};

// 地址数据
export const mockAddresses = [
  {
    id: 1,
    name: '张先生',
    phone: '138****8888',
    fullAddress: '北京市朝阳区建国路88号SOHO现代城A座1201',
    tag: '家',
    isDefault: true
  },
  {
    id: 2,
    name: '张先生',
    phone: '138****8888',
    fullAddress: '北京市海淀区中关村大街1号海龙大厦15层',
    tag: '公司',
    isDefault: false
  }
];

// 模拟 API 请求
export const mockApi = {
  // 获取轮播图
  getBanners: () => Promise.resolve({ code: 200, data: mockBanners }),

  // 获取分类
  getCategories: () => Promise.resolve({ code: 200, data: mockCategories }),

  // 获取商品列表
  getProducts: (page = 1, pageSize = 10, categoryId = null) => {
    let list = [...mockProducts];
    if (categoryId) {
      list = list.filter(p => p.categoryId === categoryId);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return Promise.resolve({
      code: 200,
      data: {
        list: list.slice(start, end),
        total: list.length,
        page,
        pageSize,
        hasMore: end < list.length
      }
    });
  },

  // 获取商品详情
  getProductDetail: (id) => {
    const product = mockProducts.find(p => p.id === id);
    return Promise.resolve({ code: 200, data: product || null });
  },

  // 获取规格模板
  getSkuTemplate: (templateName) => {
    return Promise.resolve({
      code: 200,
      data: mockSkuTemplates[templateName] || null
    });
  },

  // 获取门店列表
  getStores: () => Promise.resolve({ code: 200, data: mockStores }),

  // 获取用户信息
  getUserInfo: () => Promise.resolve({ code: 200, data: mockUserInfo }),

  // 获取地址列表
  getAddresses: () => Promise.resolve({ code: 200, data: mockAddresses })
};

export default mockApi;
