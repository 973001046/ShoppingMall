import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtFloatLayout, AtButton, AtInputNumber } from 'taro-ui';
import './index.scss';

/**
 * 商品规格选择器组件
 * 支持单选、多选、无SKU三种模式
 * 支持多维度联动（如选热饮时隐藏冰度选项）
 * @param {Boolean} isOpen - 是否显示
 * @param {Object} product - 商品信息
 * @param {Object} skuTemplate - 规格模板
 * @param {Function} onClose - 关闭回调
 * @param {Function} onConfirm - 确认回调
 * @param {Function} onDirectAdd - 无SKU时直接加入购物车回调
 */
const SkuSelector = ({
  isOpen = false,
  product: productProp = null,
  skuTemplate: skuTemplateProp = null,
  onClose,
  onConfirm,
  onDirectAdd
}) => {
  // 确保 product 和 skuTemplate 不为 null
  const product = productProp || {};
  const skuTemplate = skuTemplateProp || null;

  // 当前选中的规格
  // 格式: { dimensionId: optionId } 或 { dimensionId: [optionId1, optionId2] }
  const [selectedSpecs, setSelectedSpecs] = useState({});
  // 计算后的价格
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  // 隐藏的规则
  const [hiddenDimensions, setHiddenDimensions] = useState([]);
  // 购买数量
  const [quantity, setQuantity] = useState(1);

  // 判断商品是否有 SKU
  const hasSku = skuTemplate?.dimensions && skuTemplate.dimensions.length > 0;

  // 检查维度是否应该被隐藏（基于传入的 specs 状态）
  const shouldHideDimension = useCallback((dim, specs = selectedSpecs) => {
    if (!dim.rules?.hideWhen) return false;
    const condition = dim.rules.hideWhen;
    return Object.entries(condition).every(
      ([key, value]) => specs[key] === value
    );
  }, [selectedSpecs]);

  // 初始化选中规格
  useEffect(() => {
    if (!hasSku) return;

    const defaults = {};
    skuTemplate.dimensions.forEach(dim => {
      if (dim.options && dim.options.length > 0) {
        if (dim.type === 'multiple') {
          // 多选：如果有 exclusive 选项，默认选中它；否则空数组
          const exclusiveOption = dim.options.find(opt => opt.exclusive === true);
          defaults[dim.id] = exclusiveOption ? [exclusiveOption.id] : [];
        } else {
          // 单选默认选第一个
          defaults[dim.id] = dim.options[0].id;
        }
      }
    });
    setSelectedSpecs(defaults);
    // 根据商品配置设置数量：允许多份则保持当前值或默认为1，不允许多份则强制为1
    setQuantity(prev => product.allowMultiple === false ? 1 : (prev || 1));
  }, [product, skuTemplate, hasSku]);

  // 计算价格和隐藏的规则
  useEffect(() => {
    if (!hasSku) {
      setCalculatedPrice(product.price || 0);
      return;
    }

    let price = product.price || 0;
    const hidden = [];

    skuTemplate.dimensions.forEach(dim => {
      // 检查是否应该隐藏
      if (shouldHideDimension(dim)) {
        hidden.push(dim.id);
        return;
      }

      // 计算价格增量
      const specValue = selectedSpecs[dim.id];
      if (!specValue) return;

      if (dim.type === 'multiple' && Array.isArray(specValue)) {
        // 多选价格累加
        specValue.forEach(id => {
          const option = dim.options?.find(opt => opt.id === id);
          if (option?.price) {
            price += option.price;
          }
        });
      } else {
        // 单选价格
        const option = dim.options?.find(opt => opt.id === specValue);
        if (option?.price) {
          price += option.price;
        }
      }
    });

    setCalculatedPrice(price);
    setHiddenDimensions(hidden);
  }, [selectedSpecs, product, skuTemplate, hasSku, shouldHideDimension]);

  // 检查规格选项是否互斥
  const isExclusiveOption = (option) => option.exclusive === true;

  // 处理单选 - 点击后直接设置为新值，旧值自动被取消
  const handleSingleSelect = (dimensionId, optionId) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [dimensionId]: optionId
    }));
  };

  // 处理多选
  const handleMultipleSelect = (dimension, option) => {
    const { id: dimensionId, maxSelect } = dimension;
    const optionId = option.id;

    // 先获取当前已选中的值（使用最新的 state）
    const current = selectedSpecs[dimensionId] || [];

    // 如果点击的是互斥选项（如"不需要"）
    if (isExclusiveOption(option)) {
      if (current.includes(optionId)) {
        // 如果已经选中，则取消
        setSelectedSpecs(prev => ({ ...prev, [dimensionId]: [] }));
      } else {
        // 选中此项并清空其他
        setSelectedSpecs(prev => ({ ...prev, [dimensionId]: [optionId] }));
      }
      return;
    }

    // 如果当前已选中有互斥选项，先清空
    const hasExclusive = dimension.options?.some(
      opt => isExclusiveOption(opt) && current.includes(opt.id)
    );

    if (hasExclusive) {
      setSelectedSpecs(prev => ({ ...prev, [dimensionId]: [optionId] }));
      return;
    }

    // 正常多选逻辑
    if (current.includes(optionId)) {
      // 取消选中
      setSelectedSpecs(prev => ({
        ...prev,
        [dimensionId]: current.filter(id => id !== optionId)
      }));
      return;
    }

    // 检查是否超过最大选择数
    if (maxSelect && current.length >= maxSelect) {
      Taro.showToast({
        title: `${dimension.name}最多选择${maxSelect}项`,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 添加选中
    setSelectedSpecs(prev => ({
      ...prev,
      [dimensionId]: [...current, optionId]
    }));
  };

  // 通用选择处理
  const handleSelect = (dimension, option) => {
    if (dimension.type === 'multiple') {
      handleMultipleSelect(dimension, option);
    } else {
      handleSingleSelect(dimension.id, option.id);
    }
  };

  // 检查选项是否被选中
  const isOptionSelected = (dimension, option) => {
    const specValue = selectedSpecs[dimension.id];
    if (!specValue) return false;

    if (dimension.type === 'multiple' && Array.isArray(specValue)) {
      return specValue.includes(option.id);
    }
    // 单选：直接比较值
    const selected = specValue === option.id;
    return selected;
  };

  // 获取选中规格的描述
  const getSpecDescription = () => {
    if (!hasSku) return '无规格';

    const descriptions = [];
    skuTemplate.dimensions.forEach(dim => {
      // 跳过隐藏的维度
      if (hiddenDimensions.includes(dim.id)) return;

      const specValue = selectedSpecs[dim.id];
      if (!specValue) return;

      if (dim.type === 'multiple' && Array.isArray(specValue)) {
        if (specValue.length > 0) {
          const names = specValue.map(id => {
            const opt = dim.options?.find(o => o.id === id);
            return opt?.name || '';
          }).filter(Boolean);
          if (names.length > 0) {
            descriptions.push(`${dim.name}: ${names.join('+')}`);
          }
        }
      } else {
        const option = dim.options?.find(opt => opt.id === specValue);
        if (option) {
          descriptions.push(option.name);
        }
      }
    });

    return descriptions.length > 0 ? descriptions.join(' / ') : '请选择规格';
  };

  // 检查是否所有必选项都已选择
  const isAllSelected = () => {
    if (!hasSku) return true;

    return skuTemplate.dimensions.every(dim => {
      // 跳过隐藏的维度
      if (hiddenDimensions.includes(dim.id)) return true;

      const value = selectedSpecs[dim.id];
      if (dim.type === 'multiple') {
        return Array.isArray(value) && value.length > 0;
      }
      return !!value;
    });
  };

  // 确认选择
  const handleConfirm = () => {
    if (!hasSku) {
      // 无 SKU 商品直接回调
      if (onDirectAdd) {
        onDirectAdd(product, quantity);
      }
      return;
    }

    // 检查是否都选完了
    if (!isAllSelected()) {
      Taro.showToast({
        title: '请选择完整规格',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 过滤掉隐藏的维度
    const finalSpecs = {};
    Object.entries(selectedSpecs).forEach(([key, value]) => {
      if (!hiddenDimensions.includes(key)) {
        finalSpecs[key] = value;
      }
    });

    if (onConfirm) {
      onConfirm({
        product,
        specs: finalSpecs,
        price: calculatedPrice,
        specDescription: getSpecDescription(),
        quantity
      });
    }
  };

  // 关闭选择器
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // 无 SKU 的简单弹窗
  if (!hasSku) {
    return (
      <AtFloatLayout
        isOpened={isOpen}
        title='确认购买'
        onClose={handleClose}
      >
        <View className='sku-selector sku-selector--simple'>
          <View className='sku-header'>
            <View className='sku-header__info'>
              <Text className='sku-header__name'>{product?.name || '商品'}</Text>
              <Text className='sku-header__desc'>{product?.description || ''}</Text>
              <View className='sku-header__price'>
                <Text className='price-symbol'>¥</Text>
                <Text className='price-value'>{calculatedPrice}</Text>
              </View>
            </View>
          </View>

          {/* 数量选择 - 放在商品信息下方 */}
          {product.allowMultiple !== false && (
            <View className='sku-body sku-body--simple'>
              <View className='sku-dimension sku-dimension--quantity'>
                <View className='sku-dimension__title'>
                  <Text>数量</Text>
                </View>
                <View className='sku-dimension__options sku-dimension__options--quantity'>
                  <AtInputNumber
                    type='number'
                    min={1}
                    max={99}
                    step={1}
                    value={quantity}
                    onChange={(val) => setQuantity(val)}
                    className='sku-quantity-input'
                  />
                </View>
              </View>
            </View>
          )}

          <View className='sku-footer'>
            <AtButton
              type='primary'
              size='normal'
              className='sku-confirm-btn'
              onClick={handleConfirm}
            >
              加入购物车
            </AtButton>
          </View>
        </View>
      </AtFloatLayout>
    );
  }

  return (
    <AtFloatLayout
      isOpened={isOpen}
      title='选择规格'
      onClose={handleClose}
    >
      <View className='sku-selector sku-selector--fixed'>
        {/* 商品信息 - 固定头部 */}
        <View className='sku-header sku-header--fixed'>
          <View className='sku-header__info'>
            <Text className='sku-header__name'>{product?.name || '商品'}</Text>
            <Text className='sku-header__selected'>
              已选：{getSpecDescription()}
            </Text>
            <View className='sku-header__price'>
              <Text className='price-symbol'>¥</Text>
              <Text className='price-value'>{calculatedPrice}</Text>
            </View>
          </View>
        </View>

        {/* 规格维度 - 可滚动区域 */}
        <ScrollView
          className='sku-body sku-body--scrollable'
          scrollY
          scrollWithAnimation
        >
          {/* 数量选择 - 作为独立维度放在最上面 */}
          {product.allowMultiple !== false && (
            <View className='sku-dimension sku-dimension--quantity'>
              <View className='sku-dimension__title'>
                <Text>数量</Text>
              </View>
              <View className='sku-dimension__options sku-dimension__options--quantity'>
                <AtInputNumber
                  type='number'
                  min={1}
                  max={99}
                  step={1}
                  value={quantity}
                  onChange={(val) => setQuantity(val)}
                  className='sku-quantity-input'
                />
              </View>
            </View>
          )}

          {skuTemplate.dimensions.map((dimension) => {
            // 如果该维度被隐藏，则不渲染
            if (hiddenDimensions.includes(dimension.id)) {
              return null;
            }

            const isMultiple = dimension.type === 'multiple';

            return (
              <View key={dimension.id} className='sku-dimension'>
                <View className='sku-dimension__title'>
                  <Text>{dimension.name}</Text>
                  {isMultiple && dimension.maxSelect && (
                    <Text className='sku-dimension__tip'>（最多{dimension.maxSelect}项）</Text>
                  )}
                </View>
                <View className='sku-dimension__options'>
                  {dimension.options?.map((option) => {
                    const isSelected = isOptionSelected(dimension, option);
                    const optionClass = [
                      'sku-option',
                      isMultiple ? 'sku-option--multiple' : '',
                      isSelected ? 'sku-option--selected' : ''
                    ].filter(Boolean).join(' ');

                    return (
                      <View
                        key={option.id}
                        className={optionClass}
                        onClick={() => handleSelect(dimension, option)}
                      >
                        {option.icon && (
                          <Text className='sku-option__icon'>{option.icon}</Text>
                        )}
                        <Text className='sku-option__text'>{option.name}</Text>
                        {option.price > 0 && (
                          <Text className='sku-option__extra'>+¥{option.price}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
          {/* 底部安全间距 */}
          <View className='sku-body__safe-area' />
        </ScrollView>

        {/* 底部操作栏 - 固定底部 */}
        <View className='sku-footer sku-footer--fixed'>
          <AtButton
            type='primary'
            size='normal'
            className='sku-confirm-btn'
            onClick={handleConfirm}
          >
            加入购物车
          </AtButton>
        </View>
      </View>
    </AtFloatLayout>
  );
};

export default SkuSelector;
