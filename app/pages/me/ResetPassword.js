/**
 * Created by free on 9/10/16.
 *
 * 通过绑定的邮箱重置密码,如果注册的账号为邮箱已经自动绑定
 */
import React from 'react';
import{
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
} from '../../header';

import AV from 'leancloud-storage';


let email;

export default class ResetPassword extends React.Component{
  constructor(props){
    super(props);

    this.onBackHandle = this.onBackHandle.bind(this);
    this.onRest = this.onRest.bind(this);
  }

  onBackHandle() {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onRest(){
    if(email == undefined || email.length < 1) {
      Alert.alert('提示', '亲, 请输入绑定的邮箱');
      return;
    }

    if(!email.includes('@')) {
      Alert.alert('提示', '亲, 请输入正确的邮箱格式');
      return;
    }

    const that = this;
    AV.User.requestPasswordReset(email).then(function (success) {
      toastShort('重置邮件已经发送到您的邮箱');
      that.onBackHandle();
    }, function (error) {
      toastShort('重置失败');
    });
  }

  render(){
    return(
      <View style={gstyles.container}>
        <NavigationBar
            title={'重置密码'}
            titleColor={'#fff'}
            leftButtonIcon="md-arrow-back"
            onLeftButtonPress={this.onBackHandle}
        />

        <View style={gstyles.content}>
          <TextInput onChangeText={(text) => email=text} style={[gstyles.input, {marginTop: 20}]} placeholder={"请输入绑定的邮箱"}/>

          <TouchableOpacity onPress={this.onRest} style={[gstyles.button, {marginTop:30}]}>
            <Text style={{color:'white'}}>重置</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

}