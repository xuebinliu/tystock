/**
 * Created by free on 8/20/16.
 *
 * 注册界面
 */
import React from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
  toastShort,
  log,
} from '../../header';

import UserComm from './UserComm';

let account;
let pwd;
let confirmPwd;

export default class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onRegister= ()=> {
    log('onRegister', account, pwd, confirmPwd);

    if(account == undefined || account.length < 1) {
      Alert.alert('提示', '请输入账号');
      return;
    }

    // TODO 限定注册账号字符
    // var sEmailReg =/^[w-]+(.[w-]+)*@[w-]+(.[w-]+)+$/;
    // var sNumReg = /^d+$/;
    // if (sNumReg.test(account)){
    //   if(account.length!=11){
    //     Alert.alert('提示', '手机号格式不正确');
    //     return false;
    //   }
    // } else if(!sEmailReg.test(account)){
    //   Alert.alert('提示', '邮箱格式不正确');
    //   return false;
    // }

    if(pwd == undefined || pwd.length < 1) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    if(confirmPwd == undefined || confirmPwd.length < 1) {
      Alert.alert('提示', '请输入确认密码');
      return;
    }

    if(pwd !== confirmPwd) {
      Alert.alert('提示', '两次输入密码不一致, 请重新输入');
      return;
    }

    this.handleRegister();
  };

  handleRegister= ()=> {
    const that = this;
    UserComm.register(account, pwd, function (err, rsp) {
      if(err) {
        toastShort('注册失败');
        return;
      }

      if(rsp.status == 201) {
        // create success
        rsp.json().then(function (data) {
          log('register rsp success data', data);
          toastShort('注册成功，请您登陆');
          that.onBackHandle();
        });
      } else {
        rsp.json().then(function (data) {
          log('register rsp err data', data);
          if(data.code == 202) {
            // user already exist
            toastShort('注册失败, 账号已存在');
          }
        });
      }
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'注册'}
              titleColor={'#fff'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle} />

          <ScrollView style={gstyles.content}>

            <TextInput onChangeText={(text)=> account=text} style={gstyles.input} placeholder={"邮箱/手机号"}/>

            <TextInput onChangeText={(text)=> pwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"密码"}/>

            <TextInput onChangeText={(text)=> confirmPwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"确认密码"}/>

            <TouchableOpacity onPress={this.onRegister} style={[gstyles.button, {marginTop:40}]}>
              <Text style={{color:'white'}} >注册</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
    );
  }
}