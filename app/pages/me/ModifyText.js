/**
 * Created by free on 12/20/16.
 *
 * 个人信息文本信息修改
 */
import React from 'react';
import{
  View,
  TextInput,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
  toastShort,
} from '../../header';

import AV from 'leancloud-storage';

let modifyKey;   // 要修改的key
let value;

export default class ModifyText extends React.Component {
  constructor(props){
    super(props);

    const {route} = this.props;
    value = route.value;
    modifyKey = route.modifyKey;
  }

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  // 未设置过时，根据类型给提示
  getPlaceHolder= ()=>{
    if(!value){
      let holder = '';
      switch (modifyKey) {
        case 'nickname':
          holder = '亲, 请输入昵称';
          break;
        case 'mind':
          holder = '亲, 请输入心情';
          break;
        case 'sex':
          holder = '亲, 请输入性别';
          break;
        case 'age':
          holder = '亲, 请输入年龄';
          break;
        case 'address':
          holder = '亲, 请输入联系地址';
          break;
        case 'height':
          holder = '亲, 请输入身高';
          break;
        case 'weight':
          holder = '亲, 请输入体重';
          break;
        default:
          holder = '亲, 请输入';
          break;
      }
      return holder;
    }
  };

  getDefaultValue= ()=>{
    if(value){
      return value;
    }
  };

  getKeyboardType= ()=>{
    let type = 'default';
    switch (modifyKey) {
      case 'age':
        type = 'numeric';
        break;

    }
    return type;
  };

  onSubmit= ()=>{
    AV.User.current().set(modifyKey, value);
    AV.User.current().save();

    const {route} = this.props;
    route.callback();

    this.onBackHandle();
    toastShort('提交成功');
  };

  render(){
    return(
        <View style={gstyles.container}>
          <NavigationBar
              title={'修改年龄'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
              rightButtonTitle={'提交'}
              onRightButtonPress={this.onSubmit}
              rightButtonTitleColor={'white'}
          />

          <View style={gstyles.content}>
            <TextInput
                style={{flex:1, fontSize: 18, padding: 15, textAlignVertical: 'top' }}
                placeholder={this.getPlaceHolder()}
                defaultValue={this.getDefaultValue()}
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                numberOfLines={20}
                multiline={true}
                autoFocus={true}
                onChangeText={(text) => value=text}
                keyboardType={this.getKeyboardType()}
            />
          </View>
        </View>
    );
  }
}
