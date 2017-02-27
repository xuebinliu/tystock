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
  DeviceEventEmitter,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  Login,
  Feedback,
  About,
  DeviceStorage,
  Profile,
  CommonUtil,
  Consts,
  log,
} from '../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Center extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo:null,
    };

    log('Center constructor');
  }

  componentDidMount() {
    const that = this;

    // 注册账号变化监听
    this.accountSub = DeviceEventEmitter.addListener(Consts.EMMIT_ACCOUNT_CHANGED, function () {
      DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
        log('Center EMMIT_ACCOUNT_CHANGED new userinfo', userInfo);
        that.setState({
          userInfo:userInfo
        });
      });
    });

    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      log('Center init userinfo', userInfo);
      if(userInfo) {
        that.setState({
          userInfo:userInfo
        });
      }
    });
  }

  componentWillUnmount() {
    if(this.accountSub) {
      this.accountSub.remove();
    }
  }

  // 点击登录
  onLogin= ()=>{
    const {navigator} = this.props;
    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      log('Center init userinfo', userInfo);
      if(userInfo) {
        // 已登陆，去个人信息页面
        navigator.push({
          component: Profile,
        });
      } else {
        // 未登录,去登陆页面
        navigator.push({
          component: Login,
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


  onAbout = ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: About,
    });
  };

  renderAvatar= ()=>{
    let url = this.state.userInfo ? this.state.userInfo.avatar_url : null;
    log('renderAvatar', url);
    if(url && url.length > 0) {
      return (
          <Image style={styles.avatar} source={{uri:url}}></Image>
      );
    } else {
      return (
          <Ionicons name={"md-contact"} size={60} color="coral" style={{marginLeft:10, alignSelf:'center'}}/>
      );
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'我的'}
              titleColor={'white'}
          />

          <View style={gstyles.content}>
            <TouchableOpacity onPress={() => {this.onLogin()}}>
              <View style={[gstyles.listItem, {flexDirection:'row', height:70, marginTop:15, position:'relative'}]}>
                {this.renderAvatar()}
                <View style={{flexDirection:'column', justifyContent:'center', marginLeft:10}}>
                  <Text>{CommonUtil.getUserNickName(this.state.userInfo)}</Text>
                </View>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <View style={gstyles.noMarginline}/>
            <TouchableOpacity>
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
  avatar:{
    width:60,
    height:60,
    borderRadius:30,
    marginLeft:10,
    alignSelf:'center'
  },

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
