/**
 * Created by free on 11/8/16.
 *
 * 相册设置: 可以创建、修改、删除相册
 */
import React from 'react';
import{
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

// 用户点击提交时，保存的标题
let title='';
let settingData;

export default class AlbumSetting extends React.Component {
  constructor(props) {
    super(props);

    // 获取相册数据
    const {route} = this.props;
    settingData = route.settingData;

    this.state = {
      power: settingData == null ? 0 : settingData.power,
    };

    console.log('AlbumSetting constructor settingData=', settingData);
  }

  onBackHandle=()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onSubmit= ()=>{
    if(settingData == null) {
      // 创建一个相册对象
      settingData = {
        id: new Date().getTime(),
        index:0,
        name:title,
        power:this.state.power
      };
    } else {
      // 修改相册
      settingData = {
        name:title,
        power:this.state.power
      };
    }

    console.log('AlbumSetting onSubmit albumSetting', settingData);

    const {route} = this.props;
    route.albumSettingChange(settingData, false);

    this.onBackHandle();
  };

  setPower= (value)=>{
    this.setState({
      power:value
    });
  };

  onDelAlbum= ()=>{
    const {route} = this.props;
    route.albumSettingChange(settingData, true);
    this.onBackHandle();
    toastShort('删除相册成功');
  };

  /**
   * 非新建相册时，渲染删除按钮
   */
  renderDelBtn= ()=>{
    if(settingData != null){
      return (
          <TouchableOpacity onPress={this.onDelAlbum} style={[gstyles.button, {marginTop:30}]}>
            <Text style={{color:'white'}} >删除相册</Text>
          </TouchableOpacity>
      );
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'相册'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
              rightButtonTitle={'确定'}
              onRightButtonPress={this.onSubmit}
              rightButtonTitleColor={'white'}
          />

          <View style={gstyles.content}>
            <TextInput onChangeText={(text)=> {title=text}} style={[gstyles.input, {marginTop: 20}]} placeholder={settingData==null? '请输入相册名称' : settingData.name}/>

            <Text style={{marginLeft:15, marginTop:30, marginBottom:15, fontSize:15}}>访问权限:</Text>

            <View style={gstyles.line}/>
            <TouchableOpacity onPress={()=>this.setPower(0)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>公开</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.power == 0 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <TouchableOpacity onPress={()=>this.setPower(1)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>好友可见</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.power == 1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <TouchableOpacity onPress={()=>this.setPower(2)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>保密</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.power == 2 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>

            {this.renderDelBtn()}

          </View>
        </View>
    );
  }
}