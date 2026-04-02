import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtGrid } from 'taro-ui';
import './index.scss';

/**
 * 分类网格组件
 * @param {Array} data - 分类数据数组 {id, name, icon, color}
 * @param {Number} columnNum - 每行显示的列数
 * @param {Boolean} showAll - 是否显示全部按钮
 * @param {Function} onItemClick - 点击分类的回调函数
 */
const CategoryGrid = ({
  data = [],
  columnNum = 4,
  onItemClick
}) => {
  // 将数据转换为 AtGrid 需要的格式
  const gridData = data.map(item => ({
    image: item.icon,
    value: item.name,
    ...item
  }));

  const handleClick = (item, index) => {
    if (onItemClick) {
      onItemClick(item, index);
    } else {
      // 默认跳转到分类详情页
      Taro.navigateTo({
        url: `/pages/category/detail?id=${item.id}&name=${item.name}`
      });
    }
  };

  return (
    <View className='category-grid'>
      <AtGrid
        mode='rect'
        data={gridData}
        columnNum={columnNum}
        onClick={handleClick}
      />
    </View>
  );
};

// 简化的分类网格（使用自定义样式）
export const SimpleCategoryGrid = ({
  data = [],
  columnNum = 4,
  onItemClick
}) => {
  const handleClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <View className='simple-category-grid'>
      <View className='category-list' style={{ gridTemplateColumns: `repeat(${columnNum}, 1fr)` }}>
        {data.map((item) => (
          <View
            key={item.id}
            className='category-item'
            onClick={() => handleClick(item)}
          >
            <View
              className='category-icon-wrapper'
              style={{ backgroundColor: item.color || '#FF6B6B' }}
            >
              <Image
                className='category-icon'
                src={item.icon}
                mode='aspectFit'
                lazyLoad
              />
            </View>
            <View className='category-name'>{item.name}</View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CategoryGrid;
