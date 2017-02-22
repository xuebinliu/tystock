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
} from '../header';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let dataCache = [];

/**
 * 子类必须实现loadData方法、renderRow方法, onPullRefresh
 *
 */
export default class BaseListViewComponent extends React.Component {
  constructor(props){
    super(props);

    dataCache = [];
    this.state = {
      dataSource: ds.cloneWithRows(dataCache),
      isFirstLoading:true,    // 是否首次加载中
    };

    console.log('BaseListViewComponent constructor');
  }

  updateData= (data)=>{

    console.log('BaseListViewComponent updateData', data);

    if(data && data.length > 0){
      dataCache = data;
    }

    this.setState({
      dataSource: ds.cloneWithRows(dataCache),
      isFirstLoading:false,
    });
  };

  /**
   * 到达列表尾部，分页加载数据
   */
  onEndReached= ()=>{
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
      return (<LoadingView/>);
    } else if(dataCache.length == 0){
      return (<EmptyView message='空空如也~'/>);
    } else {
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
          <NavigationBar title={'私信'} />

          <View style={gstyles.content}>
            {this.renderContent()}
          </View>
        </View>
    );
  }
}