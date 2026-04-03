import { View, Text } from '@tarojs/components';
import { AtActivityIndicator, AtDivider } from 'taro-ui';
import './index.scss';

/**
 * 加载更多/无更多数据组件
 * @param {String} status - 状态: 'loading' | 'noMore' | 'more'
 * @param {String} noMoreText - 无更多数据时的提示文字
 * @param {String} loadingText - 加载中的提示文字
 */
const LoadMore = ({
  status = 'more',
  noMoreText = '没有更多数据了',
  loadingText = '加载中...'
}) => {
  if (status === 'loading') {
    return (
      <View className='load-more load-more--loading'>
        <AtActivityIndicator size={28} color='#FF6B6B' />
        <Text className='load-more__text'>{loadingText}</Text>
      </View>
    );
  }

  if (status === 'noMore') {
    return (
      <View className='load-more load-more--no-more'>
        <AtDivider content={noMoreText} fontColor='#ccc' lineColor='#eee' fontSize='22' />
      </View>
    );
  }

  return null;
};

export default LoadMore;
