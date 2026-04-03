import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { AtNoticebar, AtIcon, AtTabBar } from 'taro-ui';
import { useDispatch, useSelector } from 'react-redux';

// 组件
import {
  Banner,
  SimpleCategoryGrid,
  ProductList,
  StoreEntry,
  LoadMore,
  SkuSelector
} from '../../components';

// Mock 数据
import { mockApi, mockProducts, mockStores } from '../../mock';

// Redux
import { addToCart, selectCartItemCount, selectCartItems } from '../../store/slices/cartSlice';

// 样式
import './index.scss';

const Index = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartItemCount);
  const cartItems = useSelector(selectCartItems);

  // 状态
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nearbyStore, setNearbyStore] = useState(null);

  // SKU 选择器状态
  const [skuSelectorOpen, setSkuSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [skuTemplate, setSkuTemplate] = useState(null);

  // 加载初始数据
  useEffect(() => {
    loadInitialData();
  }, []);

  // 加载初始数据
  const loadInitialData = async () => {
    try {
      setLoading(true);

      // 并行加载所有数据
      const [bannersRes, categoriesRes, hotRes, productsRes, storesRes] = await Promise.all([
        mockApi.getBanners(),
        mockApi.getCategories(),
        mockApi.getProducts(1, 6), // 热门商品
        mockApi.getProducts(1, 10), // 商品列表
        mockApi.getStores()
      ]);

      if (bannersRes.code === 200) setBanners(bannersRes.data);
      if (categoriesRes.code === 200) setCategories(categoriesRes.data);
      if (hotRes.code === 200) setHotProducts(hotRes.data.list);
      if (productsRes.code === 200) {
        setProducts(productsRes.data.list);
        setHasMore(productsRes.data.hasMore);
      }
      if (storesRes.code === 200 && storesRes.data.length > 0) {
        setNearbyStore(storesRes.data[0]); // 取最近门店
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  usePullDownRefresh(async () => {
    setRefreshing(true);
    setPage(1);
    await loadInitialData();
    setRefreshing(false);
    Taro.stopPullDownRefresh();
  });

  // 上拉加载更多
  useReachBottom(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const res = await mockApi.getProducts(nextPage, 10);

      if (res.code === 200) {
        setProducts(prev => [...prev, ...res.data.list]);
        setHasMore(res.data.hasMore);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoading(false);
    }
  });

  // 分类点击
  const handleCategoryClick = (category) => {
    Taro.navigateTo({
      url: `/pages/category/detail?id=${category.id}&name=${encodeURIComponent(category.name)}`
    });
  };

  // 商品点击
  const handleProductClick = (product) => {
    Taro.navigateTo({
      url: `/pages/product/detail?id=${product.id}`
    });
  };

  // 加载 SKU 模板
  const loadSkuTemplate = async (templateName) => {
    const res = await mockApi.getSkuTemplate(templateName);
    return res.data;
  };

  // 加入购物车
  const handleAddToCart = async (product) => {
    // 先选中商品，然后打开选择器
    setSelectedProduct(product);

    // 如果商品有 SKU 模板，加载模板
    if (product.skuTemplate) {
      const template = await loadSkuTemplate(product.skuTemplate);
      setSkuTemplate(template);
    } else {
      // 无 SKU 商品，模板设为 null
      setSkuTemplate(null);
    }

    setSkuSelectorOpen(true);
  };

  // SKU 选择确认（有 SKU）
  const handleSkuConfirm = ({ product, specs, price, specDescription, quantity }) => {
    if (product) {
      const productWithPrice = {
        ...product,
        price: price
      };

      dispatch(addToCart({
        quantity: quantity || 1,
        product: productWithPrice,
        specs,
        specDescription
      }));

      Taro.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }

    setSkuSelectorOpen(false);
    setSelectedProduct(null);
    setSkuTemplate(null);
  };

  // 无 SKU 商品直接加入购物车
  const handleDirectAdd = (product, quantity = 1) => {
    console.log('handleDirectAdd', product, quantity);
    dispatch(addToCart({
      product,
      quantity: quantity || 1,
      specs: null,
      specDescription: '无规格'
    }));

    Taro.showToast({
      title: '已加入购物车',
      icon: 'success'
    });

    setSkuSelectorOpen(false);
    setSelectedProduct(null);
    setSkuTemplate(null);
  };

  // 获取商品在购物车中的数量
  const getCartQuantity = useCallback((productId) => {
    return cartItems
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <View className='index-page'>
      <ScrollView
        className='index-scroll'
        scrollY
        enableBackToTop
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={loadInitialData}
      >
        {/* 公告栏 */}
        <AtNoticebar icon='volume-plus' marquee>
          欢迎来到咖啡小站！新人首单5折优惠，快来选购吧~ 配送费限时减免活动火热进行中！
        </AtNoticebar>

        {/* 轮播图 */}
        <Banner data={banners} interval={4000} autoplay circular />

        {/* 分类导航 */}
        <View className='section section-categories'>
          <View className='section-header'>
            <Text className='section-title'>分类导航</Text>
          </View>
          <SimpleCategoryGrid
            data={categories}
            columnNum={4}
            onItemClick={handleCategoryClick}
          />
        </View>

        {/* 附近门店入口 */}
        <View className='section section-store'>
          <StoreEntry store={nearbyStore} />
        </View>

        {/* 热门推荐（横向滚动） */}
        {hotProducts.length > 0 && (
          <View className='section section-hot'>
            <ProductList
              layout='scroll'
              options={{ title: '🔥 热门推荐' }}
              products={hotProducts}
              onItemClick={handleProductClick}
              onAddToCart={handleAddToCart}
              getCartQuantity={getCartQuantity}
            />
          </View>
        )}

        {/* 推荐商品（网格布局） */}
        <View className='section section-products'>
          <View className='section-header'>
            <Text className='section-title'>🌟 为你推荐</Text>
            <Text className='section-subtitle'>精选好物，品质保证</Text>
          </View>
          
          <ProductList
            layout='grid'
            options={{ columnNum: 2, gutter: 10 }}
            products={products}
            onItemClick={handleProductClick}
            onAddToCart={handleAddToCart}
            getCartQuantity={getCartQuantity}
          />

          {/* 加载更多 */}
          <LoadMore status={loading ? 'loading' : (hasMore ? 'more' : 'noMore')} />
        </View>

        {/* 底部安全区域 */}
        <View className='safe-area-bottom' />
      </ScrollView>

      {/* 底部 TabBar */}
      <AtTabBar
        fixed
        tabList={[
          { title: '首页', iconType: 'home' },
          { title: '我的', iconType: 'user' }
        ]}
        onClick={(index) => {
          if (index === 1) {
            Taro.navigateTo({ url: '/pages/user-center/index' });
          }
        }}
        current={0}
        color='#999'
        selectedColor='#FF6B6B'
      />

      {/* SKU 规格选择器 */}
      {
        skuSelectorOpen && (
          <SkuSelector
            isOpen={skuSelectorOpen}
            product={selectedProduct}
            skuTemplate={skuTemplate}
            onClose={() => setSkuSelectorOpen(false)}
            onConfirm={handleSkuConfirm}
            onDirectAdd={handleDirectAdd}
          />
        )
      }
      {/* <SkuSelector
        isOpen={skuSelectorOpen}
        product={selectedProduct}
        skuTemplate={skuTemplate}
        onClose={() => setSkuSelectorOpen(false)}
        onConfirm={handleSkuConfirm}
        onDirectAdd={handleDirectAdd}
      /> */}
    </View>
  );
};

export default Index;
