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
  CommonUtil,
} from '../../header';

let nickName;
let account;
let pwd;
let confirmPwd;

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city:'未知',
    }
  }

  componentDidMount() {
    this.refreshCity();
  }

  refreshCity= ()=>{
    // 获取当前城市
    const that = this;
    CommonUtil.getCurrentCity().then(function (city) {
      that.setState({
        city:city,
      });
    });
  };

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onRegister= ()=> {
    if(nickName == undefined || nickName.length < 1) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    if(account == undefined || account.length < 1) {
      Alert.alert('提示', '请输入账号');
      return;
    }

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

    let user = new AV.User();
    user.setUsername(account);
    user.setPassword(pwd);

    // 用邮箱注册的账号,直接绑定
    if(account.includes("@")) {
      user.setEmail(account);
    }

    user.set('city', this.state.city);

    const that = this;
    user.signUp().then(function (loginedUser) {
      // register successful
      toastShort('亲注册成功,请登录');

      that.onBackHandle();
    }, (function (error) {
      if(error.code === 202) {
        toastShort('用户名重复');
      } else if(error.code === 203) {
        toastShort('邮箱重复');
      } else if(error.code === 214) {
        toastShort('手机号重复');
      }
    }));
  };

  onModifyCity= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: Location,
      refreshCity:this.refreshCity,
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'注册'}
              titleColor={'#fff'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <ScrollView style={gstyles.content}>

            <TextInput onChangeText={(text)=> nickName=text} style={[gstyles.input, {marginTop: 15}]} placeholder={"昵称"}/>

            <TextInput onChangeText={(text)=> account=text} style={gstyles.input} placeholder={"账号(邮箱/手机号)"}/>

            <TextInput onChangeText={(text)=> pwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"密码"}/>

            <TextInput onChangeText={(text)=> confirmPwd=text} secureTextEntry={true} style={gstyles.input} placeholder={"确认密码"}/>

            <TouchableOpacity style={{height: 60, marginHorizontal:15,}} onPress={this.onModifyCity}>
              <Text style={[{fontSize:14, marginTop:15, color:'#777'}]}>城市: {this.state.city}</Text>
              <View style={{marginTop:15, height:1, backgroundColor:'dimgray'}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onRegister} style={[gstyles.button, {marginTop:40}]}>
              <Text style={{color:'white'}} >注册</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
    );
  }

}