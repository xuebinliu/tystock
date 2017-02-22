/**
 * Created by free on 8/16/16.
 *
 * 大厅页面
 */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ListView,
  Image,
  RefreshControl,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
  Location,
  UserInfo,
  DeviceStorage,
  toastShort,
} from '../../header';

import AV from 'leancloud-storage';

import HallDataMgr from './HallDataMgr.js';
import HallFilter from './HallFilter.js';
import * as Const from '../../const.js';

const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// 当前用户列表缓存
let userCache = [];
// 过滤器对象
var filterObj = {
  city:'',
  sex:-1,
  hot:-1,
  time:-1,
};

export default class Hall extends React.Component {
  constructor(props) {
    super(props);
    console.log('Hall constructor');

    userCache = [];
    this.state = {
      isFirstLoading: false,
      peopleItems:dataSource.cloneWithRows([]),
    };

    // 初始化过滤器数据
    this.initFilterData();
  }

  // 初始化过滤器数据
  initFilterData= ()=>{
    const that = this;
    DeviceStorage.get(Const.SK_HALL_FILTER).then(function (obj) {
      if(obj) {
        filterObj = obj;
      }

      if(filterObj.city.length == 0) {
        // 获取当前城市
        that.cbRefreshCity();
      } else {
        // 刷新当前城市
        that.forceUpdate();
        // 首次拉取当前用户
        that.reloadPeopleList();
      }
      console.log('initFilterData filterObj', filterObj);
    }).catch(function (err) {
      console.log('initFilterData filterObj catch err', err);
    });
  };

  // 保存过滤器数据
  saveFilterData= (newFilter)=>{
    filterObj = newFilter;
    DeviceStorage.save(Const.SK_HALL_FILTER, filterObj);
  };

  /**
   * 获取用户列表
   * @param index 起始索引，用于分页拉取
   * @param filterObj 过滤条件
   */
  getPeopleList= (index, filterObj)=>{
    const that = this;
    that.setState({
      isFirstLoading:true,
    });

    HallDataMgr.getDefaultPeopleList(index, filterObj).then(function (users) {
      console.log('getPeopleList ok', users);
      if(users && users.length > 0) {
        userCache = [].concat(userCache, users);
      } else {
        // toastShort('加载完了');
      }
      that.setState({
        isFirstLoading:false,
        peopleItems:dataSource.cloneWithRows(userCache),
      });
    }).catch(function (error) {
      console.log('getPeopleList err', error);
      toastShort('加载数据失败');
      that.setState({
        isFirstLoading:false,
      });
    });
  };

  onClickCity= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: Location,
      cbRefreshCity:this.cbRefreshCity,
    });
  };

  onPressFilter= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: HallFilter,
      filterObj:filterObj,
      cbFilterChange:this.cbFilterChange,
    });
  };

  /**
   * 回调函数，过滤条件发生了变化
   */
  cbFilterChange= (filterObj)=>{
    console.log('cbFilterChange sex', filterObj);
    filterObj.sex = filterObj.sex;
    filterObj.hot = filterObj.hot;
    filterObj.time = filterObj.time;
    DeviceStorage.save(Const.SK_HALL_FILTER, filterObj);

    // 重新加载用户列表
    this.reloadPeopleList();
  };

  /**
   * 刷新当前城市
   */
  cbRefreshCity= ()=> {
    const that = this;
    CommonUtil.getCurrentCity().then((city)=>{
      // save to server
      AV.User.currentAsync().then(function (user) {
        if(user != null){
          user.set('city', city);
          user.save().then(function (data) {
            console.log('cbRefreshCity save ok', data);
          });
        }

        // 重新加载用户列表
        that.reloadPeopleList();
      });

      filterObj.city = city;
      that.saveFilterData(filterObj);
      // 显示当前城市
      that.forceUpdate();
    });
  };

  reloadPeopleList= ()=>{
    // 获取用户列表
    userCache = [];
    this.getPeopleList(0, filterObj);
  };

  onPressRow= (rowData)=>{
    const {navigator} = this.props;
    navigator.push({
      component: UserInfo,
      userData:rowData,
    });
  };

  renderItemImage= (rowData)=>{
    if(rowData.avatar_url && rowData.avatar_url.length > 0){
      return (<Image resizeMode='stretch' style={styles.itemImage} source={{uri:rowData.avatar_url}}/>);
    } else {
      return (<Image resizeMode='stretch' style={styles.itemImage} source={require('../../img/default_image.png')}/>);
    }
  };

  renderRow = (rowData, secId, rowId)=>{
    let user = rowData._serverData;
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={()=>{this.onPressRow(rowData)}}>
        {this.renderItemImage(user)}
      </TouchableOpacity>
    );
  };

  onEndReached= ()=>{
    console.log('onEndReached');
    // 上拉加载更多，增量加载
    this.getPeopleList(userCache.length, filterObj);
  };

  onRefresh= ()=>{
    console.log('onRefresh');
    // 下拉刷新，清空缓存
    this.reloadPeopleList();
  };

  render(){
    return (
        <View style={gstyles.container}>
          <NavigationBar
            title={'同城'}
            leftButtonTitle={filterObj.city}
            leftButtonTitleColor={'#fff'}
            onLeftButtonPress={this.onClickCity}
            onRightButtonPress={this.onPressFilter}
            rightButtonIcon={'ios-funnel-outline'}/>

          <View style={gstyles.content}>
            <ListView
              contentContainerStyle={{flexDirection:'row', flexWrap:'wrap'}}
              dataSource={this.state.peopleItems}
              renderRow={this.renderRow}
              enableEmptySections={true}
              pageSize={2}
              onEndReached={this.onEndReached}
              refreshControl={
                <RefreshControl
                    refreshing={this.state.isFirstLoading}
                    onRefresh={this.onRefresh}
                />
              }/>
          </View>

        </View>
    );
  }
}

const IMAGE_SIZE = (Dimensions.get('screen').width - 5*4)/2;
const styles = StyleSheet.create({
  itemContainer:{
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
    marginTop:5,
    marginHorizontal:5,
    borderRadius:4,
  },

  itemImage:{
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
    borderRadius:4,
  },
});
