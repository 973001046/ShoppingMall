import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtTag, AtButton, AtIcon } from 'taro-ui';
import './index.scss';

/**
 * 商品卡片组件
 * @param {Object} product - 商品数据
 * @param {String} layout - 布局方式: 'vertical' | 'horizontal'
 * @param {Boolean} showTag - 是否显示标签
 * @param {Boolean} showSales - 是否显示销量
 * @param {Number} cartQuantity - 购物车中的数量
 * @param {Function} onClick - 点击回调
 * @param {Function} onAddToCart - 加入购物车回调
 */
const ProductCard = ({
  product = {},
  layout = 'vertical',
  showTag = true,
  showSales = true,
  cartQuantity = 0,
  onClick,
  onAddToCart
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      Taro.navigateTo({
        url: `/pages/product/detail?id=${product.id}`
      });
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // 计算折扣
  const discount = product.originalPrice
    ? Math.round((product.price / product.originalPrice) * 10)
    : null;

  return (
    <View className={`product-card product-card--${layout}`} onClick={handleClick}>
      {/* 图片区域 */}
      <View className='product-card__image-wrapper'>
        <Image
          className='product-card__image'
          src={product.imageUrl}
          mode='aspectFill'
          lazyLoad
        />
        {showTag && product.tag && (
          <View className='product-card__tag'>
            <AtTag size='small' type='primary' active>{product.tag}</AtTag>
          </View>
        )}
        {discount && discount < 10 && (
          <View className='product-card__discount'>
            {discount}折
          </View>
        )}
      </View>

      {/* 内容区域 */}
      <View className='product-card__content'>
        <View className='product-card__name'>{product.name}</View>
        <View className='product-card__description'>{product.description}</View>

        {showSales && product.sales > 0 && (
          <View className='product-card__sales'>
            已售 {product.sales}
          </View>
        )}

        <View className='product-card__footer'>
          <View className='product-card__price-wrapper'>
            <Text className='product-card__price-symbol'>¥</Text>
            <Text className='product-card__price'>{product.price}</Text>
            {product.originalPrice && (
              <Text className='product-card__original-price'>
                ¥{product.originalPrice}
              </Text>
            )}
          </View>

          <View className='product-card__cart-wrapper' onClick={handleAddToCart}>
            <AtButton
              className='product-card__add-btn'
              size='small'
              type='primary'
              circle
            >
              <AtIcon value='shopping-cart' size='small' color='#fff' />
            </AtButton>
            {cartQuantity > 0 && (
              <View className='product-card__cart-badge'>
                <Text className='product-card__cart-badge-text'>
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// 商品列表（网格布局）
export const ProductGrid = ({
  products = [],
  columnNum = 2,
  gutter = 20,
  onItemClick,
  onAddToCart,
  getCartQuantity
}) => {
  return (
    <View
      className='product-grid'
      style={{
        gridTemplateColumns: `repeat(${columnNum}, 1fr)`,
        gap: `${gutter}px`
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout='vertical'
          cartQuantity={getCartQuantity ? getCartQuantity(product.id) : 0}
          onClick={onItemClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </View>
  );
};

// 商品列表（横向滚动）
export const ProductScroll = ({
  products = [],
  title,
  onItemClick,
  onAddToCart,
  getCartQuantity
}) => {
  return (
    <View className='product-scroll'>
      {title && (
        <View className='product-scroll__header'>
          <Text className='product-scroll__title'>{title}</Text>
        </View>
      )}
      <View className='product-scroll__list'>
        {products.map((product) => (
          <View key={product.id} className='product-scroll__item'>
            <ProductCard
              product={product}
              layout='vertical'
              showTag={false}
              showSales={false}
              cartQuantity={getCartQuantity ? getCartQuantity(product.id) : 0}
              onClick={onItemClick}
              onAddToCart={onAddToCart}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// 商品列表（列表布局）
export const ProductListView = ({
  products = [],
  onItemClick,
  onAddToCart,
  getCartQuantity
}) => {
  return (
    <View className='product-list-view'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout='horizontal'
          cartQuantity={getCartQuantity ? getCartQuantity(product.id) : 0}
          onClick={onItemClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </View>
  );
};

export default ProductCard;
