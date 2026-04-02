import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import './index.scss';

/**
 * 附近门店入口组件
 * @param {Object} store - 门店信息
 * @param {Function} onClick - 点击回调
 */
const StoreEntry = ({
  store = null,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(store);
    } else {
      Taro.navigateTo({
        url: '/pages/store/list'
      });
    }
  };

  // 如果没有门店数据，显示默认提示
  if (!store) {
    return (
      <View className='store-entry store-entry--empty' onClick={handleClick}>
        <View className='store-entry__left'>
          <AtIcon value='map-pin' size='20' color='#FF6B6B' />
          <Text className='store-entry__text'>查看附近门店</Text>
        </View>
        <View className='store-entry__right'>
          <AtIcon value='chevron-right' size='18' color='#999' />
        </View>
      </View>
    );
  }

  return (
    <View className='store-entry' onClick={handleClick}>
      <View className='store-entry__left'>
        <View className='store-entry__icon-wrapper'>
          <AtIcon value='map-pin' size='20' color='#fff' />
        </View>
        <View className='store-entry__info'>
          <View className='store-entry__name-row'>
            <Text className='store-entry__name'>{store.name}</Text>
            <Text className={`store-entry__status ${store.status === '营业中' ? 'is-open' : 'is-closed'}`}>
              {store.status}
            </Text>
          </View>
          <View className='store-entry__meta'>
            <Text className='store-entry__distance'>
              <AtIcon value='map-pin' size='14' color='#999' />
              {store.distance}
            </Text>
            <Text className='store-entry__hours'>
              <AtIcon value='clock' size='14' color='#999' />
              {store.businessHours}
            </Text>
          </View>
        </View>
      </View>
      <View className='store-entry__right'>
        <AtIcon value='chevron-right' size='18' color='#999' />
      </View>
    </View>
  );
};

export default StoreEntry;
