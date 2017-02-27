/**
 * Created by free on 9/9/16.
 * 个人信息展示页面
 */
import React from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  NativeModules,
  PixelRatio,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
  toastShort,
  loaderHandler,
  DeviceStorage,
  CommonUtil,
  Consts,
  log,
} from '../../header';

import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ModifyText from './ModifyText';

export default class Profile extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      userInfo:null,
    };

    this.updateUserInfo();
  }

  updateUserInfo= ()=> {
    const that = this;
    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      that.setState({
        userInfo:userInfo
      });
    });
  };

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onLogout= ()=>{
    toastShort('退出登录成功');

    // 更新我的界面
    const {route} = this.props;
    route.callback();

    this.onBackHandle();
  };

  onModifyHead= ()=>{
    const that = this;

    // 获取头像
    ImagePicker.openPicker({
      width: parseInt(120 * PixelRatio.get()),
      height: parseInt(120 * PixelRatio.get()),
      cropping: true,
    }).then((image)=>{
      // 上传前，显示加载框
      loaderHandler.showLoader('正在上传...');

      // save to server via native
      NativeModules.FileUpload.upload(image.path, function (error, url) {
        // 取消加载框
        loaderHandler.hideLoader();

        if(!error){
          console.log('upload avatar failed', error);
          toastShort('更改头像失败');
          return;
        }

        // 头像上传成功后，把url地址保存到User中

        // 更新当前界面
        that.forceUpdate();

        // 更新上一级界面（我的）

        toastShort('更改头像成功');

        log("onModifyHead success avatar url=", url);
      });
    }).catch((e)=>{
      log('onModifyHead e', e);
    });
  };

  onModifyNickName= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userInfo.nickname,
      modifyKey:'nickname',
    });
  };


  onModifySex= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifySex,
      callback:this.updateUserProfile
    });
  };

  getSex= ()=>{
    if(!this.state.userInfo) {
      return '未设置';
    }

    let sex = this.state.userInfo.sex;
    if(sex == 0) {
      return '男';
    } else if(sex === 1){
      return '女';
    } else if(sex ===2){
      return '保密';
    } else {
      return '未设置';
    }
  };

  // 渲染头像
  renderAvatar= ()=>{
    if(!this.state.userInfo || !this.state.userInfo.avatar_url) {
      return (<Ionicons name={"md-contact"} size={60} color="coral"
                        style={{marginLeft:10, alignSelf:'center'}}/>);
    } else {
      return (<Image style={{width:60, height:60, borderRadius:30}}
                     source={{uri:this.state.userInfo.avatar_url}}></Image>);
    }
  };

  render(){
    return(
      <View style={gstyles.container}>
        <NavigationBar
            title={'个人信息'}
            leftButtonIcon="md-arrow-back"
            onLeftButtonPress={this.onBackHandle}
        />

        <ScrollView style={[gstyles.content,]}>
          <TouchableOpacity onPress={this.onModifyHead}>
            <View style={[gstyles.listItem, styles.item, {height:70, marginTop:15}]}>
              <Text>头像</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                {this.renderAvatar()}
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifyNickName}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>昵称</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{CommonUtil.getUserNickName(this.state.userInfo)}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifySex}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>性别</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.getSex()}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onLogout} style={[gstyles.button, {marginTop:30}]}>
            <Text style={{color:'white'}}>退出登录</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  item:{
    flexDirection:'row',
    alignItems:'center',
    height:40,
    position:'relative',
    paddingHorizontal:15,
  },
});