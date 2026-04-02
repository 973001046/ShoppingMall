import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略非序列化数据的警告（如日期对象）
        ignoredActions: ['cart/addToCart', 'cart/updateQuantity'],
        ignoredPaths: ['cart.items.addedAt']
      }
    })
});

export default store;
