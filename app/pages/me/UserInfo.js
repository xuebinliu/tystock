/**
 * Created by free on 12/26/16.
 *
 * 展示用户的基本信息
 */

import React from 'react';
import{
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeModules,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
  AlbumContainer,
  Login,
  toastShort,
  CommonUtil,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class UserInfo extends React.Component {
  constructor(props){
    super(props);

    const {route} = this.props;
    this.state = {
      userData:route.userData,
      isFollow:false,
    };

    console.log('UserInfo userData', route.userData);
  }

  componentDidMount(){
    const that = this;
    // AV.User.currentAsync().then((currentUser)=>{
    //   if(currentUser) {
    //     // 已登录,获取关注列表
    //     var query = AV.User.current().followeeQuery();
    //     query.include('followee');
    //     query.find().then(function(followeeIds){
    //       //关注的用户列表 followees
    //       console.log('componentDidMount', followeeIds);
    //       followeeIds.find(function (user) {
    //         if(user.id == that.state.userData.id) {
    //           that.setState({
    //             isFollow:true,
    //           });
    //         }
    //       })
    //     });
    //   } else {
    //     console.log('componentDidMount not login');
    //   }
    // });
  }

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  // 发送私信
  onPressSendMessage= ()=>{
    const that = this;
    // AV.User.currentAsync().then((currentUser)=>{
    //   if(currentUser) {
    //       NativeModules.ReactProxy.openChat({
    //         userId:currentUser.id,
    //         avatar_url:currentUser.get('avatar_url'),
    //         name:CommonUtil.getUserNickName(currentUser)
    //       },{
    //         userId:that.state.userData.id,
    //         avatar_url:that.state.userData.get('avatar_url'),
    //         name:CommonUtil.getUserNickName(that.state.userData)
    //       });
    //   } else {
    //     const {navigator} = this.props;
    //     navigator.push({
    //       component:Login,
    //     });
    //   }
    // }).catch(function (error) {
    //   console.log(error);
    // });
  };

  // 关注/取消关注
  onPressFollow= ()=>{
    const that = this;
    // AV.User.currentAsync().then((currentUser)=>{
    //   if(currentUser) {
    //     if(that.state.isFollow) {
    //       // 取消关注
    //       currentUser.unfollow(that.state.userData.id).then(function(){
    //         toastShort('取消关注成功');
    //         that.setState({
    //           isFollow:false,
    //         });
    //       });
    //     } else {
    //       // 关注
    //       currentUser.follow(that.state.userData.id).then(function(){
    //         toastShort('关注成功');
    //         that.setState({
    //           isFollow:true,
    //         });
    //       });
    //     }
    //   } else {
    //     const {navigator} = this.props;
    //     navigator.push({
    //       component:Login,
    //     });
    //   }
    // });
  };

  // 点赞
  onPressSupport= ()=>{
    // AV.User.currentAsync().then((currentUser)=>{
    //   if(currentUser) {
    //
    //   } else {
    //     const {navigator} = this.props;
    //     navigator.push({
    //       component:Login,
    //     });
    //   }
    // }).catch(function (error) {
    // });
  };

  // 点击相册
  onPressAlbum= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component:AlbumContainer,
      currentUser:this.state.userData,
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'TA的主页'}
              titleColor={'#fff'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <ScrollView style={gstyles.content}>
            <Image style={styles.userAvatar} source={{uri:this.state.userData.attributes.avatar_url}}/>

            <View style={{flexDirection:'row', height:40, marginTop:0}}>
              <TouchableOpacity onPress={this.onPressSendMessage} style={styles.action}>
                <Ionicons name={"ios-mail-outline"} size={24} color="darkgray" style={{marginRight:5,}}/>
                <Text>发私信</Text>
              </TouchableOpacity>
              <View style={styles.actionDividLine}/>
              <TouchableOpacity onPress={this.onPressFollow} style={styles.action}>
                <Ionicons name={"md-heart"} size={24} color="darkgray" style={{marginRight:5,}}/>
                <Text>{this.state.isFollow ? '取消关注' : '关注'}</Text>
              </TouchableOpacity>
              <View style={styles.actionDividLine}/>
              <TouchableOpacity onPress={this.onPressSupport} style={styles.action}>
                <Ionicons name={"ios-thumbs-up"} size={24} color="darkgray" style={{marginRight:5,}}/>
                <Text>赞TA</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoItem}>
              <Ionicons name={"md-person"} size={24} color="coral" style={{marginLeft:10,}}/>
              <Text style={{marginLeft:15, fontSize:20, fontFamily:'bold', color:'black'}}>{this.state.userData.attributes.username}</Text>
            </View>

            <View style={styles.userInfoItem}>
              <Ionicons name={"md-heart"} size={24} color="coral" style={{marginLeft:10,}}/>
              <Text style={{marginLeft:15, fontSize:16}}>{this.state.userData.attributes.mind}</Text>
            </View>

            <TouchableOpacity style={styles.userInfoItem} onPress={this.onPressAlbum}>
              <Ionicons name={"md-albums"} size={24} color="coral" style={{marginLeft:10,}}/>
              <Text style={{marginLeft:15, fontSize:16}}>TA的相册</Text>
            </TouchableOpacity>

            <View style={styles.userInfoItem}>
              <Ionicons name={"md-menu"} size={24} color="coral" style={{marginLeft:10,}}/>
              <Text style={{marginLeft:15, fontSize:16}}>详细资料</Text>
            </View>
            <Text style={styles.materialText}>年龄: {this.state.userData.attributes.age}</Text>
            <Text style={styles.materialText}>身高: {this.state.userData.attributes.height}</Text>
            <Text style={styles.materialText}>体重: {this.state.userData.attributes.weight}</Text>
            <Text style={styles.materialText}>地址: {this.state.userData.attributes.address}</Text>
          </ScrollView>
        </View>
    )
  };
}

const styles = StyleSheet.create({
  userAvatar:{
    width:Dimensions.get('window').width,
    height:300,
  },

  action:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'green'
  },

  actionDividLine:{
    width:1,
    height:40,
    backgroundColor:'darkgray'
  },

  userInfoItem:{
    flexDirection:'row',
    marginTop:15,
    alignItems:'center',
  },

  materialText:{
    marginLeft:48,
    marginTop:5,
    fontSize:16,
  },

});
