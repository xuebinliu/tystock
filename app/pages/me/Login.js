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
import UserComm from './UserComm';
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
      log('Login get_simple_userinfo', userInfo);

      if(!userInfo || userInfo.errCode != 0) {
        toastShort('获取登陆信息失败, 请重试');
        return;
      }

      // 登陆
      UserComm.qqlogin(userInfo, function (err, rsp) {
        if(err){
          toastShort('获取服务器失败, 请重试');
          return;
        }

        if(rsp.status == 200) {
          rsp.json().then(function (userInfo) {
            log('qqlogin old user', userInfo);
            that.handleLogin(200, userInfo);
          });
        } else if(rsp.status == 201) {
          rsp.json().then(function (userInfo) {
            log('qqlogin new user', userInfo);
            that.handleLogin(201, userInfo);
          });
        }
      });

      toastShort('登陆成功');
      that.onBackHandle();
    }, function (err) {
      log('QQAPI login err', err);
      toastShort('QQ登陆失败了');
    });
  };

  /**
   * 处理登陆
   * @param type 1手机号登陆，200 QQ登陆老用户，201 QQ登陆新用户
   * @param userInfo
   */
  handleLogin= (type, userInfo)=>{
    // 保存用户信息到cache
    DeviceStorage.save(Consts.ACCOUNT_USERINFO_KEY, userInfo).then(function () {
      DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
    });

    // 如果是qq新用户登陆，则拉取头像和昵称
    if(type == 201) {
      // 获取QQ登陆的用户名和头像url
      NativeModules.QQAPI.updateUserInfo(function (avatar_url, nickname) {
        log('QQAPI updateUserInfo', nickname, avatar_url);
        if(!avatar_url || !nickname) {
          return;
        }

        // 更新用户信息到cache
        DeviceStorage.update(Consts.ACCOUNT_USERINFO_KEY, {
          nickname:nickname,
          avatar_url:avatar_url
        }).then(function () {
          log('QQAPI updateUserInfo new user save local cache ok');
          // 保存到服务器
          UserComm.updateUserInfo({
            nickname:nickname,
            avatar_url:avatar_url,
          });
        });
      });
    } else if(type == 200) {
      // QQ第三方登陆的老用户没有头像和昵称，则获取QQ登陆的用户名和头像url
      if(!userInfo.avatar_url || !userInfo.nickname) {
        NativeModules.QQAPI.updateUserInfo(function (avatar_url, nickname) {
          log('Login QQAPI old user updateUserInfo', nickname, avatar_url);
          DeviceStorage.update(Consts.ACCOUNT_USERINFO_KEY, {
            nickname:nickname,
            avatar_url:avatar_url
          }).then(function () {
            log('QQAPI updateUserInfo save local cache ok');
            // 保存到服务器
            UserComm.updateUserInfo({
              nickname:nickname,
              avatar_url:avatar_url,
            });
          }, function (err) {
            log('Login QQAPI updateUserInfo', err);
          });
        });
      }
    }
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
    log('onPressLogin', account, pwd);
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
                <Image source={require('../../img/login_icon_qq.png')} style={{width:50,height:50}}/>
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
