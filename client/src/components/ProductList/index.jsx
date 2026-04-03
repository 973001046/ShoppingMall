import { ProductGrid, ProductScroll, ProductListView } from '../ProductCard';

/**
 * 商品列表组件 - 统一封装各种布局方式
 * @param {Array} products - 商品数据数组
 * @param {String} layout - 布局方式: 'grid' | 'scroll' | 'list'
 * @param {Object} options - 布局配置参数
 * @param {Function} onItemClick - 点击商品回调
 * @param {Function} onAddToCart - 加入购物车回调
 * @param {Function} getCartQuantity - 获取商品购物车数量的函数
 */
const ProductList = ({
  products = [],
  layout = 'grid',
  options = {},
  onItemClick,
  onAddToCart,
  getCartQuantity
}) => {
  // 根据 layout 渲染对应的组件
  switch (layout) {
    case 'grid':
      return (
        <ProductGrid
          products={products}
          columnNum={options.columnNum || 2}
          gutter={options.gutter || 20}
          onItemClick={onItemClick}
          onAddToCart={onAddToCart}
          getCartQuantity={getCartQuantity}
        />
      );

    case 'scroll':
      return (
        <ProductScroll
          products={products}
          title={options.title}
          onItemClick={onItemClick}
          onAddToCart={onAddToCart}
          getCartQuantity={getCartQuantity}
        />
      );

    case 'list':
      return (
        <ProductListView
          products={products}
          onItemClick={onItemClick}
          onAddToCart={onAddToCart}
          getCartQuantity={getCartQuantity}
        />
      );

    default:
      return null;
  }
};

export default ProductList;
