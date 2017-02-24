/**
 * Created by free on 8/18/16.
 *
 * 登陆界面
 */
import React from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  Image,
  InteractionManager,
  TextInput,
  Alert,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  toastShort,
  Register,
  DeviceStorage,
  Consts,
  log,
  CommonUtil,
} from '../../header';

import * as QQAPI from 'react-native-qq';

import ResetPassword from './ResetPassword';


let account;
let pwd;

export default class Login extends React.Component {
  constructor(props){
    super(props);
  }

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return CommonUtil.naviGoBack(navigator);
  };

  onPressQQLogin= ()=>{
    const that = this;
    QQAPI.login('get_simple_userinfo').then(function (userInfo) {
      /* 获取到userinfo的定义
       {
       expires_in: 1487853159797,
       oauth_consumer_key: '1106004972',
       access_token: '911552B8187F77B8DAE2D9E8F3F68134',
       openid: '517847405C7A5AEFE0B6EF439A492EA9',
       errCode: 0
       }
       */
      log('get_simple_userinfo', userInfo);

      userInfo.isQQLogin = true;

      DeviceStorage.save(Consts.ACCOUNT_USERINFO_KEY, userInfo).then(function () {
        DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
      });

      // 获取QQ登陆的用户名和头像url
      NativeModules.QQAPI.updateUserInfo(function (avatar_url, nickname) {
        log('QQAPI updateUserInfo', nickname, avatar_url);
        DeviceStorage.update(Consts.ACCOUNT_USERINFO_KEY, {
          nickname:nickname,
          avatar_url:avatar_url
        }).then(function () {
          DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
        });
      });

      toastShort('登陆成功');

      that.onBackHandle();

    }, function (err) {
      log('QQAPI login err', err);

      toastShort('QQ登陆失败了');
    });
  };

  // register
  onPressRegister= ()=>{
    const {navigator} = this.props;
    InteractionManager.runAfterInteractions(() => {
      navigator.push({
        component: Register,
      });
    });
  };

  onPressLogin= ()=>{
    console.log('onPressLogin', account, pwd);
    if(account == undefined || account.length < 1) {
      Alert.alert('提示', '亲, 请输入账号');
      return;
    }

    if(pwd == undefined || pwd.length < 1) {
      Alert.alert('提示', '亲, 请输入密码');
      return;
    }
  };

  onPressReset(){
    const {navigator} = this.props;
    InteractionManager.runAfterInteractions(() => {
      navigator.push({
        component: ResetPassword,
      });
    });
  }

  render() {
    return (
      <View style={gstyles.container}>
        <NavigationBar
            title={'登陆'}
            leftButtonIcon="md-arrow-back"
            onLeftButtonPress={this.onBackHandle}
            rightButtonTitle={"注册"}
            rightButtonTitleColor={'white'}
            onRightButtonPress={this.onPressRegister}
        />

        <View style={gstyles.content}>

          <View style={{marginTop:40, alignItems:'center'}}>
              <TouchableOpacity onPress={this.onPressQQLogin}>
                <Image source={require('../../img/ic_login_weixin.png')} style={{width:50,height:50}}/>
              </TouchableOpacity>
            <Text style={{fontSize:13, marginTop:5, color:'#777'}}>QQ登录</Text>
          </View>

          <TextInput autoFocus={true} onChangeText={(text)=> account=text} style={[gstyles.input, {marginTop: 40}]} placeholder={"邮箱/手机号"}/>

          <TextInput onChangeText={(text)=> pwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"密码"}/>

          <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:15, }}>
            <TouchableOpacity onPress={this.onPressRegister}>
              <Text style={{color:'blue', alignSelf:'flex-start', marginLeft:15}}>
                注册
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onPressReset}>
              <Text style={{color:'blue', alignSelf:'flex-end', marginRight:15}}>
                忘记密码?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.onPressLogin} style={[gstyles.button, {marginTop:30}]}>
            <Text style={{color:'white'}} >登陆</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
