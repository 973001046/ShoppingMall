import { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Taro from '@tarojs/taro';

import './app.scss';

class App extends Component {

  componentDidMount() {
    // 应用启动时可以进行全局初始化
    console.log('App mounted');
  }

  componentDidShow() {
    // 应用显示时
  }

  componentDidHide() {
    // 应用隐藏时
  }

  onLaunch() {
    // 小程序启动时
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default App
