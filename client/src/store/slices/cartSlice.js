import { createSlice } from '@reduxjs/toolkit';

// 从本地存储加载购物车数据
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
  } catch (e) {
    return { items: [], total: 0 };
  }
};

// 保存购物车数据到本地存储
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error('保存购物车失败', e);
  }
};

// 计算购物车总价
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// 生成购物车项的唯一键（用于区分不同规格的商品）
const generateItemKey = (productId, specs) => {
  if (!specs || Object.keys(specs).length === 0) {
    return `${productId}_default`;
  }
  const specStr = Object.entries(specs)
    .sort()
    .map(([k, v]) => {
      // 处理数组值（多选）
      if (Array.isArray(v)) {
        return `${k}:[${v.sort().join(',')}]`;
      }
      return `${k}:${v}`;
    })
    .join(',');
  return `${productId}_${specStr}`;
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 添加商品到购物车
    addToCart: (state, action) => {
      const { product, quantity = 1, specs = {}, specDescription = '' } = action.payload;
      const itemKey = generateItemKey(product.id, specs);

      const existingItem = state.items.find(item => item.key === itemKey);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          key: itemKey,
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity,
          specs,
          specDescription,
          addedAt: Date.now()
        });
      }

      state.total = calculateTotal(state.items);
      saveCartToStorage(state);
    },

    // 从购物车移除商品
    removeFromCart: (state, action) => {
      const { itemKey } = action.payload;
      state.items = state.items.filter(item => item.key !== itemKey);
      state.total = calculateTotal(state.items);
      saveCartToStorage(state);
    },

    // 更新商品数量
    updateQuantity: (state, action) => {
      const { itemKey, quantity } = action.payload;
      const item = state.items.find(item => item.key === itemKey);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.key !== itemKey);
        } else {
          item.quantity = quantity;
        }
      }

      state.total = calculateTotal(state.items);
      saveCartToStorage(state);
    },

    // 清空购物车
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartToStorage(state);
    },

    // 选中/取消选中商品
    toggleSelect: (state, action) => {
      const { itemKey } = action.payload;
      const item = state.items.find(item => item.key === itemKey);
      if (item) {
        item.selected = !item.selected;
      }
      saveCartToStorage(state);
    },

    // 全选/取消全选
    selectAll: (state, action) => {
      const { selected } = action.payload;
      state.items.forEach(item => {
        item.selected = selected;
      });
      saveCartToStorage(state);
    },

    // 从本地存储加载购物车（用于初始化）
    loadCart: (state) => {
      const savedCart = loadCartFromStorage();
      state.items = savedCart.items;
      state.total = savedCart.total;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleSelect,
  selectAll,
  loadCart
} = cartSlice.actions;

// 选择器
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSelectedItems = (state) => state.cart.items.filter(item => item.selected);
export const selectSelectedTotal = (state) => {
  return state.cart.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
// 获取指定商品的购物车总数量（所有规格合计）
export const selectCartQuantityByProductId = (productId) => (state) => {
  return state.cart.items
    .filter(item => item.productId === productId)
    .reduce((sum, item) => sum + item.quantity, 0);
};

export default cartSlice.reducer;
