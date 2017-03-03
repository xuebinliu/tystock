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
  TextInput,
  Alert,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  toastShort,
  DeviceStorage,
  Consts,
  log,
  CommonUtil,
} from '../../header';

import UserComm from './UserComm';
import Register from './Register';
import QQLogin from '../../utils/QQLogin';

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
    QQLogin.login().then(function (data) {
      log('QQLogin data', data);

      if(!data) {
        toastShort('获取登陆信息失败, 请重试');
        return;
      }

      let userInfo = {
        openid:data.userid,
        access_token:data.access_token,
        expires_in:data.expires_time
      };

      // 登陆
      UserComm.qqlogin(userInfo, function (err, rsp) {
        if(err){
          toastShort('获取服务器失败, 请重试');
          return;
        }

        if(rsp.status == 200) {
          rsp.json().then(function (userInfo) {
            log('qqlogin old user', userInfo);
            that.handleQQLogin(200, userInfo);
          });
        } else if(rsp.status == 201) {
          rsp.json().then(function (userInfo) {
            log('qqlogin new user', userInfo);
            that.handleQQLogin(201, userInfo);
          });
        }
      });

      toastShort('登陆成功');
      that.onBackHandle();
    }, function (err) {
      log('QQLogin login err', err);
      toastShort('QQ登陆失败了');
    });
  };

  /**
   * 处理登陆
   * @param type 1手机号登陆，200 QQ登陆老用户，201 QQ登陆新用户
   * @param userInfo
   */
  handleQQLogin= (type, userInfo)=>{
    // 保存用户信息到cache
    DeviceStorage.save(Consts.ACCOUNT_USERINFO_KEY, userInfo).then(function () {
      DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
    });

    // 如果是qq新用户登陆，则拉取头像和昵称
    if(type == 201) {
      // 获取QQ登陆的用户名和头像url
      this.getAvatarNickname(userInfo);
    } else if(type == 200) {
      // QQ老用户登陆,没有头像和昵称，则获取QQ登陆的用户名和头像url
      if(!userInfo.avatar_url || !userInfo.nickname) {
        this.getAvatarNickname(userInfo);
      }
    }
  };

  // 获取qq头像和昵称
  getAvatarNickname= (userInfo)=>{
    CommonUtil.getQQAvatarAndNickname(userInfo.authData.qq.openid, userInfo.authData.qq.access_token, function (rsp) {
      if(!rsp.figureurl_2 || !rsp.nickname) {
        return;
      }

      // 更新用户信息到cache
      DeviceStorage.update(Consts.ACCOUNT_USERINFO_KEY, {
        nickname:rsp.nickname,
        avatar_url:rsp.figureurl_2
      }).then(function () {
        // 保存到服务器
        UserComm.updateUserInfo({
          nickname:rsp.nickname,
          avatar_url:rsp.figureurl_2,
        });
      });
    });
  };

  onPressLogin= ()=>{
    log('onPressLogin', account, pwd);
    if(!account || account.length == 0) {
      Alert.alert('提示', '亲, 请输入手机号');
      return;
    }
    if(!pwd || pwd.length == 0) {
      Alert.alert('提示', '亲, 请输入验证码');
      return;
    }

    const that = this;
    UserComm.accountLogin(account, pwd, function (err, rsp) {
      if(err) {
        toastShort('登陆失败，请重试');
        return;
      }
      if(rsp.status == 200) {
        // login success
        rsp.json().then(function (userInfo) {
          DeviceStorage.save(Consts.ACCOUNT_USERINFO_KEY, userInfo).then(function () {
            DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
            toastShort('恭喜您登陆成功');
            that.onBackHandle();
          });
        })
      } else {
        toastShort('登陆失败，请检查账号和密码');
      }
    });
  };

  // register
  onPressRegister= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: Register,
    });
  };

  render() {
    return (
      <View style={gstyles.container}>
        <NavigationBar
            title={'登陆'}
            leftButtonIcon="md-arrow-back"
            onLeftButtonPress={this.onBackHandle}
            rightButtonTitle={"注册"}
            rightButtonTitleColor={'white'}
            onRightButtonPress={this.onPressRegister}/>

        <View style={gstyles.content}>

          <View style={{marginTop:30, alignItems:'center'}}>
              <TouchableOpacity onPress={this.onPressQQLogin}>
                <Image source={require('../../img/login_icon_qq.png')} style={{width:50,height:50}}/>
              </TouchableOpacity>
            <Text style={{fontSize:13, marginTop:5, color:'#777'}}>QQ登录</Text>
          </View>

          <TextInput autoFocus={true} onChangeText={(text)=> account=text} style={[gstyles.input, {marginTop: 20}]} placeholder={"邮箱/手机号"}/>

          <TextInput onChangeText={(text)=> pwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"密码"}/>

          <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:15, }}>
            <TouchableOpacity onPress={this.onPressRegister}>
              <Text style={{color:'blue', alignSelf:'flex-start', marginLeft:15}}>
                注册
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
