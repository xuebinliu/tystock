/**
 * Created by free on 14/02/2017.
 */
import React from 'react';
import {
  Text,
  View,
  ListView,
  RefreshControl,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  LoadingView,
  EmptyView,
  log,
} from '../header';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// 列表数据缓存
let dataCache = [];

/**
 * BaseListViewComponent是基础的列表加载基类，各个子类只需实现数据接口和行渲染接口即可。基类实现了：
 * 1. 列表展示管理
 * 2. 首次加载过程动画
 * 3. 列表空数据界面
 * 4. 下拉刷新及自动调用加载数据
 * 5. 默认的列表分割线，子类可以覆盖修改样式
 * 6. 导航栏及标题
 * 7. 上拉加载更多自动调用加载数据及无数据footer
 *
 * 子类必须实现：
 *    loadData方法加载数据
 *    renderRow方法渲染行
 *    state.nav_title属性，用于展示导航栏标题
 *    state.isFirstLoading属性用于首次加载列表动画
 *
 * 子类选择实现：
 *    renderBeforeList方法，用于渲染List上部子类自定制区域
 *
 * 调用顺序
 * 1. 子类界面展示时调用loadData(index)加载数据，index分页拉取索引
 * 2. loadData完成后调用updateData(data)方法，更新数据
 * 3. 子类实现renderRow()方法渲染行
 * 4. 子类实现onPullRefresh()方法实现下拉刷新
 * 5. 上拉加载更多基类自动调用子类的loadData方法
 */
export default class BaseListViewComponent extends React.Component {
  constructor(props){
    super(props);

    dataCache = [];
    this.state = {
      dataSource: ds.cloneWithRows(dataCache),
    };

    log('BaseListViewComponent constructor');
  }

  componentDidMount() {
    // 启动时加载数据
    this.loadData(0);
  }

  updateData= (data)=>{
    // log('BaseListViewComponent updateData', data);

    if(data && data.length > 0){
      dataCache = data;
    }

    this.setState({
      dataSource: ds.cloneWithRows(dataCache),
      isFirstLoading:false,
    });
  };

  /**
   * 下拉刷新，索引从0开始
   */
  onPullRefresh= ()=>{
    log('BaseListViewComponent onPullRefresh');

    // 调用子类加载数据
    this.loadData(0);
  };

  /**
   * 到达列表尾部，分页加载数据，索引为目前数据的长度
   */
  onEndReached= ()=>{
    log('BaseListViewComponent onEndReached dataCache.length', dataCache.length);

    // 调用子类加载数据
    this.loadData(dataCache.length);
  };

  /**
   * 渲染list item的分割线
   * @param sectionID
   * @param rowID
   * @return {XML}
   */
  renderSeparator= (sectionID, rowID)=>{
    return (<View key={`${sectionID}-${rowID}`} style={gstyles.noMarginline}></View>);
  };

  /**
   * 渲染list footer
   * @return {XML}
   */
  renderFooter= ()=>{
    return (
        <View style={{flex:1, height:40, justifyContent:'center', alignItems:'center'}}>
          <Text style={{}}>没有更多了</Text>
        </View>
    );
  };

  /**
   * 渲染内容
   * @return {XML}
   */
  renderContent= ()=>{
    if(this.state.isFirstLoading){
      log('renderContent LoadingView');
      return (<LoadingView/>);
    } else if(dataCache.length == 0){
      log('renderContent EmptyView');
      return (<EmptyView message='空空如也~'/>);
    } else {
      log('renderContent ListView');
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onEndReached={this.onEndReached}
          renderFooter={this.renderFooter}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
                refreshing={this.state.isFirstLoading}
                onRefresh={this.onPullRefresh}
            />
          }
        />
      );
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar title={this.state.nav_title} />

          <View style={gstyles.content}>
            {this.renderBeforeList()}
            {this.renderContent()}
          </View>
        </View>
    );
  }

  renderBeforeList= ()=>{

  };
}