/**
 * Created by free on 09/02/2017.
 *
 * 粉丝/关注 列表
 */
import React from 'react';
import{
  View,
  ListView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  toastShort,
  LoadingView,
  UserInfo,
  CommonUtil,
  EmptyView,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// 每页拉取数据个数，用于分页拉取
const PAGE_COUNT = 20;

// 当前用户列表的缓存
let userCache = [];

/**
 * props:
 * type: 要展示的列表类型, 1 follows关注, 2 followees粉丝
 * user: 要查看的用户AV.User对象
 */
export default class Follows extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows(userCache),
      isLoading:true,
    };
  }

  componentDidMount(){
    const that = this;
    setTimeout(function () {
      that.loadData(userCache.length);
    }, 300);
  }

  componentWillUnmount(){
    userCache = [];
  }

  /**
   * 从服务器获取列表数据
   * @param index 其实位置
   */
  loadData= (index)=>{
    console.log('loadData', index, this.props.route.type);

    let query;
    if(this.props.route.type == 1) {
      // 查询关注列表
      query = AV.User.current().followeeQuery();
      query.include('followee');
      query.limit(PAGE_COUNT);
    } else if(this.props.route.type == 2){
      // 查询粉丝列表
      query = AV.User.current().followerQuery();
      query.include('follower');
      query.limit(PAGE_COUNT);
    } else {
    }

    query.skip(index);

    const that = this;
    query.find().then(function(users){
      console.log("loadData get users", users);

      //关注的用户列表 follows
      if(users && users.length > 0) {
        userCache = [].concat(userCache, users);
      } else {
        // toastShort('加载完了');
      }

      that.setState({
        isFirstLoading:false,
        dataSource:ds.cloneWithRows(userCache),
      });
    }).catch(function (err) {
      console.log('loadData err', err);
      toastShort('加载出错了');
    });
  };

  onEndReached= ()=>{
    this.loadData(userCache.length);
  };

  onPressRow= (rowData)=>{
    this.props.navigator.push({
      component:UserInfo,
      userData:rowData,
    });
  };

  renderRow= (rowData, sectionID, rowID)=>{
    return (
      <TouchableOpacity onPress={()=>this.onPressRow(rowData)}>
        <View style={{flex:1, flexDirection:'row', height:80, alignItems:'center'}}>
          <Image style={{width:60, height:60, margin:10, borderRadius:30, alignSelf:'center'}}
                 resizeMode="stretch"
                 source={{uri:rowData.attributes.avatar_url}}/>
          <View style={{flex:1}}>
            <Text>{CommonUtil.getReadableUserName(rowData)}</Text>
            <Text>{rowData.attributes.mind}</Text>
          </View>
          <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{marginHorizontal:10}}/>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator= (sectionID, rowID)=>{
    return (<View key={`${sectionID}-${rowID}`} style={gstyles.noMarginline}></View>);
  };

  renderFooter= ()=>{
    return (
        <View style={{flex:1, height:40, justifyContent:'center', alignItems:'center'}}>
          <Text style={{}}>没有更多了</Text>
        </View>
    );
  };

  renderContent= ()=>{
    if(this.state.isFirstLoading){
      return (<LoadingView/>);
    } else if(userCache.length == 0){
      return (<EmptyView message={this.props.route.type == 1 ? '您还未关注其他人哦~' : '您还没有粉丝哦~'} />);
    } else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onEndReached={this.onEndReached}
          renderFooter={this.renderFooter}
          enableEmptySections={true}/>
      );
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={this.props.route.type == 1 ? '我的关注' : '我的粉丝'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>{CommonUtil.naviGoBack(this.props.navigator)}}
          />

          <View style={gstyles.content}>
            {this.renderContent()}
          </View>
        </View>
    );
  }
}