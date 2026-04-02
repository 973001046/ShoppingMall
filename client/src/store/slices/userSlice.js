import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi } from '../../mock';

// 异步获取用户信息
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.getUserInfo();
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue('获取用户信息失败');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 从本地存储加载用户信息
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  info: loadUserFromStorage(),
  addresses: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action) => {
      state.info = action.payload;
      try {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } catch (e) {
        console.error('保存用户信息失败', e);
      }
    },

    // 清除用户信息
    clearUserInfo: (state) => {
      state.info = null;
      state.addresses = [];
      try {
        localStorage.removeItem('user');
      } catch (e) {
        console.error('清除用户信息失败', e);
      }
    },

    // 更新用户地址
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },

    // 添加地址
    addAddress: (state, action) => {
      const newAddress = { ...action.payload, id: Date.now() };
      state.addresses.push(newAddress);
    },

    // 更新地址
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },

    // 删除地址
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },

    // 设置默认地址
    setDefaultAddress: (state, action) => {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === action.payload;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setUserInfo,
  clearUserInfo,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = userSlice.actions;

// 选择器
export const selectUserInfo = (state) => state.user.info;
export const selectAddresses = (state) => state.user.addresses;
export const selectDefaultAddress = (state) =>
  state.user.addresses.find(addr => addr.isDefault) || state.user.addresses[0];
export const selectUserLoading = (state) => state.user.loading;
export const selectCoupons = (state) => state.user.info?.coupons || [];

export default userSlice.reducer;
