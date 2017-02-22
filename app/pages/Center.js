/**
 * Created by free on 8/16/16.
 *
 * 我的界面
 */

import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    Login,
    Feedback,
    About,
    Profile,
    AlbumContainer,
    Follows,
    CommonUtil,
} from '../header';

import AV from 'leancloud-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Center extends React.Component {
  constructor(props) {
    super(props);

    this.updateUserState = this.updateUserState.bind(this);

    this.state = {
      nickName:'未登陆',
      mind:'',
      avatar_url:null,
      followees:0,    // 关注数
      followers:0,    // 粉丝数
    };
  }

  componentDidMount() {
    this.setUser();
  }

  /**
   * 更新头像、昵称状态
   */
  setUser = ()=>{
    // 更新用户状态
    const that = this;
    AV.User.currentAsync().then((currentUser)=>{
      console.log('setUser currentUser', currentUser);
      let nickName='未登录';
      let mind = '';
      let avatar_url = '';
      if(currentUser) {
        nickName = CommonUtil.getReadableUserName(currentUser);
        mind = currentUser.get('mind');
        avatar_url = currentUser.get('avatar_url');
      }

      that.setState({
        nickName:nickName,
        mind:mind,
        avatar_url:avatar_url,
      });
    }).catch(function (error) {
      console.log('setUser no user info', error);
      that.setState({
        nickName:'未登陆',
        mind:'',
        avatar_url:null,
      });
    });

    // 更新关注数
    this.updateFolloweesCount();
    this.updateFollowersCount();
  };

  // login success callback
  updateUserState(){
    this.setUser();
  }

  // 点击登录
  onLogin= ()=>{
    const {navigator} = this.props;
    AV.User.currentAsync().then((currentUser)=>{
      if(currentUser) {
        navigator.push({
          component: Profile,
          callback: this.updateUserState,
        });
      } else {
        // go login
        navigator.push({
          component: Login,
          callback: this.updateUserState,
        });
      }
    });
  };

  // 点击关注
  onPressFollows= ()=>{
    const {navigator} = this.props;
    AV.User.currentAsync().then((currentUser)=>{
      if(currentUser) {
        navigator.push({
          component: Follows,
          type:1,
          user:currentUser,
        });
      } else {
        // go login
        navigator.push({
          component: Login,
          callback: this.updateUserState,
        });
      }
    });
  };

  // 点击粉丝
  onPressFollowees= ()=>{
    const {navigator} = this.props;
    AV.User.currentAsync().then((currentUser)=>{
      if(currentUser) {
        navigator.push({
          component: Follows,
          type:2,
          user:currentUser,
        });
      } else {
        // go login
        navigator.push({
          component: Login,
          callback: this.updateUserState,
        });
      }
    });
  };

  // 建议
  onFeedback= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: Feedback,
    });
  };

  // 相册
  onPressAlbum = ()=>{
    const that = this;
    AV.User.currentAsync().then((currentUser)=>{
      const {navigator} = that.props;
      if(currentUser) {
        navigator.push({
          component: AlbumContainer,
          currentUser:currentUser,
        });
      } else {
        navigator.push({
          component: Login,
          callback: this.updateUserState,
        });
      }
    });
  };

  onAbout = ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: About,
    });
  };

  renderAvatar= ()=>{
    let url = this.state.avatar_url;
    if(url && url.length > 0) {
      return (
          <Image style={{width:60, height:60, borderRadius:30, marginLeft:10, alignSelf:'center'}} source={{uri:url}}></Image>
      );
    } else {
      return (
          <Ionicons name={"md-contact"} size={60} color="coral" style={{marginLeft:10, alignSelf:'center'}}/>
      );
    }
  };

  // 获取关注数
  updateFolloweesCount= ()=>{
    const that = this;
    AV.User.currentAsync().then((currentUser)=>{
      if(currentUser){
        let query = currentUser.followeeQuery();
        query.count(function (count) {
          that.setState({
            followees:count
          });
        });
      }
    });
  };

  // 获取粉丝数
  updateFollowersCount= ()=>{
    const that = this;
    AV.User.currentAsync().then((currentUser)=>{
      if(currentUser){
        let query = currentUser.followerQuery();
        query.count(function (count) {
          that.setState({
            followers:count
          });
        });
      }
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'Test3'}
              titleColor={'white'}
          />

          <View style={gstyles.content}>
            <TouchableOpacity onPress={() => {this.onLogin()}}>
              <View style={[gstyles.listItem, {flexDirection:'row', height:70, marginTop:15, position:'relative'}]}>
                {this.renderAvatar()}
                <View style={{flexDirection:'column', justifyContent:'center', marginLeft:10}}>
                  <Text>{this.state.nickName}</Text>
                  <Text>{this.state.mind}</Text>
                </View>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <View style={[gstyles.listItem, {flexDirection:'row', paddingVertical:10}]}>
              <TouchableOpacity style={styles.op_action}>
                <View style={{alignItems:'center'}}>
                  <Text>红豆</Text>
                  <Text>100</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressFollowees} style={styles.op_action}>
                <View style={{alignItems:'center'}}>
                  <Text>粉丝</Text>
                  <Text>{this.state.followers}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressFollows} style={styles.op_action}>
                <View style={{alignItems:'center'}}>
                  <Text>关注</Text>
                  <Text>{this.state.followees}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {this.onPressAlbum()}}>
              <View style={[gstyles.listItem, styles.item, {marginTop:15, position:'relative'}]}>
                <Text>相册</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.noMarginline}/>
            <TouchableOpacity onPress={() => {this.onPressVersion()}}>
              <View style={[gstyles.listItem, styles.item,]}>
                <Text>充值</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.onFeedback()}}>
              <View style={[gstyles.listItem, styles.item, {marginTop:15, position:'relative'}]}>
                <Text>建议</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.noMarginline}/>

            <TouchableOpacity onPress={() => {this.onAbout()}}>
              <View style={[gstyles.listItem, styles.item]}>
                  <Text>关于</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  op_action:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  item:{
    alignItems:'center',
    flexDirection:'row',
    height:40,
    paddingLeft:15,
    position:'relative'
  }
});
