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
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
    Register,
} from '../../header';

import ResetPassword from './ResetPassword';

let account;
let pwd;

export default class Login extends React.Component {
  constructor(props){
    super(props);
  }

  onBackHandle= ()=>{
    console.log('onBackHandle');
    const {navigator} = this.props;
    return naviGoBack(navigator);
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

    const that = this;
    AV.User.logIn(account, pwd).then(function (loginedUser) {
      console.log('onPressLogin sucess');

      // refresh center ui
      const {route} = that.props;
      if(route.callback){
        route.callback();
      }

      toastShort('登陆成功');
      that.onBackHandle();
    }, function (error) {
      toastShort('用户名或密码错误');
    });
  }

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
          <TextInput autoFocus={true} onChangeText={(text)=> account=text} style={[gstyles.input, {marginTop: 20}]} placeholder={"邮箱/手机号"}/>

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

          <View style={{marginTop:70,alignItems:'center'}}>
            <Text style={{fontSize:13,color:'#777'}}>------------第三方账号登录------------</Text>
            <View style={{flexDirection:'row',marginTop:20}}>
              <TouchableOpacity>
                <Image source={require('../../img/ic_login_weixin.png')} style={{width:50,height:50}}/>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </View>
    );
  }
}


