import { useState, useEffect } from 'react';
import { View, Image, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import {
  AtList,
  AtListItem,
  AtAvatar,
  AtTag,
  AtBadge,
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtButton,
  AtTabBar
} from 'taro-ui';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import {
  selectUserInfo,
  selectCoupons,
  setUserInfo,
  fetchUserInfo
} from '../../store/slices/userSlice';

// Mock 数据
import { mockApi, mockUserInfo, mockAddresses } from '../../mock';

// 样式
import './index.scss';

const UserCenter = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const coupons = useSelector(selectCoupons);

  // 状态
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [orderStats, setOrderStats] = useState({
    pendingPayment: 0,
    pendingDelivery: 0,
    pendingReceive: 0,
    pendingReview: 0
  });

  // 加载用户数据
  useEffect(() => {
    loadUserData();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadUserData();
    Taro.stopPullDownRefresh();
  });

  // 加载用户数据
  const loadUserData = async () => {
    try {
      setLoading(true);

      // 如果没有用户信息，加载 mock 数据
      if (!userInfo) {
        const res = await mockApi.getUserInfo();
        if (res.code === 200) {
          dispatch(setUserInfo(res.data));
        }
      }

      // 加载地址数据
      const addressesRes = await mockApi.getAddresses();
      if (addressesRes.code === 200) {
        setAddresses(addressesRes.data);
      }

      // 模拟订单统计数据
      setOrderStats({
        pendingPayment: 2,
        pendingDelivery: 1,
        pendingReceive: 3,
        pendingReview: 0
      });
    } catch (error) {
      console.error('加载用户数据失败:', error);
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取用户信息（微信登录）
  const handleGetUserInfo = () => {
    Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const newUserInfo = {
          ...userInfo,
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        };
        dispatch(setUserInfo(newUserInfo));
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: () => {
        Taro.showToast({
          title: '授权失败',
          icon: 'none'
        });
      }
    });
  };

  // 导航到订单列表
  const goToOrders = (status) => {
    Taro.navigateTo({
      url: `/pages/order/list${status ? `?status=${status}` : ''}`
    });
  };

  // 导航到优惠券
  const goToCoupons = () => {
    Taro.navigateTo({
      url: '/pages/coupon/list'
    });
  };

  // 导航到地址管理
  const goToAddresses = () => {
    Taro.navigateTo({
      url: '/pages/address/list'
    });
  };

  // 导航到客服
  const goToService = () => {
    Taro.navigateTo({
      url: '/pages/service/index'
    });
  };

  // 导航到设置
  const goToSettings = () => {
    Taro.navigateTo({
      url: '/pages/settings/index'
    });
  };

  // 退出登录
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // 清除用户数据
    dispatch(setUserInfo(null));
    setShowLogoutModal(false);
    Taro.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  };

  // 会员卡背景颜色根据等级
  const getMemberColor = (level) => {
    switch (level) {
      case '金牌会员': return { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', text: '#8B4513' };
      case '银牌会员': return { bg: 'linear-gradient(135deg, #C0C0C0, #A9A9A9)', text: '#4a4a4a' };
      case '铜牌会员': return { bg: 'linear-gradient(135deg, #CD7F32, #B87333)', text: '#fff' };
      default: return { bg: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)', text: '#fff' };
    }
  };

  const memberStyle = getMemberColor(userInfo?.memberLevel);

  return (
    <View className='user-center-page'>
      {/* 用户信息卡片 */}
      <View className='user-header'>
        <View className='user-header__bg' />
        <View className='user-header__content'>
          <View className='user-info'>
            <View className='user-avatar-wrapper'>
              {userInfo?.avatarUrl ? (
                <AtAvatar
                  circle
                  size='large'
                  image={userInfo.avatarUrl}
                />
              ) : (
                <View
                  className='user-avatar-placeholder'
                  onClick={handleGetUserInfo}
                >
                  <AtIcon value='user' size='40' color='#999' />
                </View>
              )}
            </View>
            <View className='user-meta'>
              {userInfo?.nickname ? (
                <>
                  <View className='user-name-row'>
                    <Text className='user-nickname'>{userInfo.nickname}</Text>
                    <AtTag
                      size='small'
                      type='primary'
                      active
                      customStyle={{
                        backgroundColor: memberStyle.bg,
                        color: memberStyle.text,
                        border: 'none'
                      }}
                    >
                      {userInfo.memberLevel}
                    </AtTag>
                  </View>
                  <Text className='user-phone'>{userInfo.phone}</Text>
                </>
              ) : (
                <Button
                  className='login-btn'
                  onClick={handleGetUserInfo}
                >
                  点击登录
                </Button>
              )}
            </View>
          </View>

          {/* 会员积分 */}
          {userInfo && (
            <View className='user-points'>
              <View className='points-item'>
                <Text className='points-value'>{userInfo.memberPoints}</Text>
                <Text className='points-label'>积分</Text>
              </View>
              <View className='points-divider' />
              <View className='points-item'>
                <Text className='points-value'>{coupons.length}</Text>
                <Text className='points-label'>优惠券</Text>
              </View>
              <View className='points-divider' />
              <View className='points-item'>
                <Text className='points-value'>0</Text>
                <Text className='points-label'>收藏</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 我的订单 */}
      <View className='section section-orders'>
        <View className='section-header' onClick={() => goToOrders()}>
          <Text className='section-title'>我的订单</Text>
          <View className='section-more'>
            <Text className='more-text'>查看全部</Text>
            <AtIcon value='chevron-right' size='16' color='#999' />
          </View>
        </View>
        <View className='order-status-grid'>
          <View className='order-status-item' onClick={() => goToOrders('pending_payment')}>
            <AtBadge value={orderStats.pendingPayment > 0 ? orderStats.pendingPayment : ''}>
              <View className='status-icon-wrapper'>
                <AtIcon value='shopping-bag' size='32' color='#FF6B6B' />
              </View>
            </AtBadge>
            <Text className='status-text'>待付款</Text>
          </View>
          <View className='order-status-item' onClick={() => goToOrders('pending_delivery')}>
            <AtBadge value={orderStats.pendingDelivery > 0 ? orderStats.pendingDelivery : ''}>
              <View className='status-icon-wrapper'>
                <AtIcon value='shopping-cart' size='32' color='#FF6B6B' />
              </View>
            </AtBadge>
            <Text className='status-text'>待发货</Text>
          </View>
          <View className='order-status-item' onClick={() => goToOrders('pending_receive')}>
            <AtBadge value={orderStats.pendingReceive > 0 ? orderStats.pendingReceive : ''}>
              <View className='status-icon-wrapper'>
                <AtIcon value='truck' size='32' color='#FF6B6B' />
              </View>
            </AtBadge>
            <Text className='status-text'>待收货</Text>
          </View>
          <View className='order-status-item' onClick={() => goToOrders('pending_review')}>
            <AtBadge value={orderStats.pendingReview > 0 ? orderStats.pendingReview : ''}>
              <View className='status-icon-wrapper'>
                <AtIcon value='message' size='32' color='#FF6B6B' />
              </View>
            </AtBadge>
            <Text className='status-text'>待评价</Text>
          </View>
          <View className='order-status-item' onClick={() => goToOrders('refund')}>
            <View className='status-icon-wrapper'>
              <AtIcon value='repeat' size='32' color='#FF6B6B' />
            </View>
            <Text className='status-text'>退款/售后</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className='section section-menu'>
        <AtList hasBorder={false}>
          <AtListItem
            title='我的优惠券'
            arrow='right'
            thumb='https://via.placeholder.com/40/FF6B6B/FFFFFF?text=券'
            onClick={goToCoupons}
            extraText={`${coupons.length}张`}
          />
          <AtListItem
            title='地址管理'
            arrow='right'
            thumb='https://via.placeholder.com/40/4ECDC4/FFFFFF?text=址'
            onClick={goToAddresses}
            extraText={`${addresses.length}个`}
          />
          <AtListItem
            title='联系客服'
            arrow='right'
            thumb='https://via.placeholder.com/40/95E1D3/FFFFFF?text=服'
            onClick={goToService}
          />
          <AtListItem
            title='设置'
            arrow='right'
            thumb='https://via.placeholder.com/40/AA96DA/FFFFFF?text=设'
            onClick={goToSettings}
          />
        </AtList>
      </View>

      {/* 退出登录按钮 */}
      {userInfo && (
        <View className='logout-section'>
          <AtButton
            type='secondary'
            size='normal'
            onClick={handleLogout}
          >
            退出登录
          </AtButton>
        </View>
      )}

      {/* 底部 TabBar */}
      <AtTabBar
        fixed
        tabList={[
          { title: '首页', iconType: 'home' },
          { title: '我的', iconType: 'user' }
        ]}
        onClick={(index) => {
          if (index === 0) {
            Taro.navigateBack();
          }
        }}
        current={1}
        color='#999'
        selectedColor='#FF6B6B'
      />

      {/* 退出登录确认弹窗 */}
      <AtModal
        isOpened={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <AtModalHeader>确认退出</AtModalHeader>
        <AtModalContent>
          确定要退出登录吗？
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowLogoutModal(false)}>取消</Button>
          <Button onClick={confirmLogout} style={{ color: '#FF6B6B' }}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default UserCenter;
