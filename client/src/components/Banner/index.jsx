import { useState, useEffect } from 'react';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

/**
 * 轮播图组件
 * @param {Array} data - 轮播图数据数组 {id, imageUrl, linkUrl, title}
 * @param {Number} interval - 自动轮播间隔（毫秒）
 * @param {Boolean} autoplay - 是否自动播放
 * @param {Boolean} circular - 是否循环播放
 */
const Banner = ({
  data = [],
  interval = 3000,
  autoplay = true,
  circular = true
}) => {
  const [current, setCurrent] = useState(0);

  const handleClick = (item) => {
    if (item.linkUrl) {
      Taro.navigateTo({
        url: item.linkUrl
      });
    }
  };

  const handleChange = (e) => {
    setCurrent(e.detail.current);
  };

  // 图片懒加载
  const handleImageLoad = (e) => {
    // 可以在这里处理图片加载完成后的逻辑
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className='banner'>
      <Swiper
        className='banner-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#FF6B6B'
        circular={circular}
        autoplay={autoplay}
        interval={interval}
        current={current}
        onChange={handleChange}
        indicatorDots={data.length > 1}
      >
        {data.map((item) => (
          <SwiperItem key={item.id} className='banner-swiper-item'>
            <View
              className='banner-item'
              onClick={() => handleClick(item)}
            >
              <Image
                className='banner-image'
                src={item.imageUrl}
                mode='aspectFill'
                lazyLoad
                onLoad={handleImageLoad}
              />
              {item.title && (
                <View className='banner-title'>
                  {item.title}
                </View>
              )}
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 自定义指示器 */}
      {data.length > 1 && (
        <View className='banner-dots'>
          {data.map((_, index) => (
            <View
              key={index}
              className={`banner-dot ${index === current ? 'active' : ''}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Banner;
