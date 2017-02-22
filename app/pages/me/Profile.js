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
    DeviceEventEmitter,
    PixelRatio,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
    loaderHandler,
} from '../../header';

import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AV from 'leancloud-storage';

import ModifySex from './ModifySex';
import ModifyText from './ModifyText';

export default class Profile extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      userinfo:AV.User.current(),
    }
  }

  updateUserProfile= ()=>{
    this.setState({
      userinfo:AV.User.current(),
    });

    // 更新我的界面
    const {route} = this.props;
    route.callback();
  };

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onLogout= ()=>{
    AV.User.logOut();
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
      width: parseInt(300 * PixelRatio.get()),
      height: parseInt(300 * PixelRatio.get()),
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
        AV.User.current().set('avatar_url', url);
        AV.User.current().save();

        // 更新当前界面
        that.forceUpdate();

        // 更新上一级界面（我的）
        const {route} = that.props;
        route.callback();

        toastShort('更改头像成功');

        console.log("onModifyHead success avatar url=", url);
      });
    }).catch((e)=>{
      console.log('onModifyHead e', e);
    });
  };

  onModifyNickName= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('nickname'),
      modifyKey:'nickname',
      callback:this.updateUserProfile
    });
  };

  onModifyAddress= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('address'),
      modifyKey:'address',
      callback:this.updateUserProfile
    });
  };

  onModifySex= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifySex,
      callback:this.updateUserProfile
    });
  };

  onModifyAge= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('age'),
      modifyKey:'age',
      callback:this.updateUserProfile
    });
  };

  onModifyHeight= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('height'),
      modifyKey:'height',
      callback:this.updateUserProfile
    });
  };

  onModifyWeight= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('weight'),
      modifyKey:'weight',
      callback:this.updateUserProfile
    });
  };

  onModifyMind= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: ModifyText,
      value:this.state.userinfo.get('mind'),
      modifyKey:'mind',
      callback:this.updateUserProfile
    });
  };

  getSex= ()=>{
    let sex = this.state.userinfo.get('sex');
    if(sex === 0) {
      return '男';
    } else if(sex === 1){
      return '女';
    } else if(sex ===2){
      return '保密';
    } else {
      return '未设置';
    }
  };

  /**
   * 获取昵称，如果没设置则返回用户名
   * @returns {*}
   */
  getNickName= ()=>{
    let mind = this.state.userinfo.get('nickname');
    if(mind) {
      return mind;
    } else {
      return this.state.userinfo.getUsername();
    }
  };

  // 渲染头像
  renderAvatar= ()=>{
    let url = AV.User.current().get('avatar_url');
    if(url) {
      return (<Image style={{width:60, height:60, borderRadius:30}} source={{uri:url}}></Image>);
    } else {
      return (<Ionicons name={"md-contact"} size={60} color="coral" style={{marginLeft:10, alignSelf:'center'}}/>);
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
                <Text>{this.getNickName()}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifyMind}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>心情</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.state.userinfo.get('mind') ? this.state.userinfo.get('mind') : '未设置'}</Text>
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

          <TouchableOpacity onPress={this.onModifyAge}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>年龄</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.state.userinfo.get('age') ? this.state.userinfo.get('age') : '未设置'}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifyHeight}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>身高</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.state.userinfo.get('height') ? this.state.userinfo.get('height') : '未设置'}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifyWeight}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>体重</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.state.userinfo.get('weight') ? this.state.userinfo.get('weight') : '未设置'}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>
          <View style={gstyles.line}/>

          <TouchableOpacity onPress={this.onModifyAddress}>
            <View style={[gstyles.listItem, styles.item]}>
              <Text>地址</Text>
              <View style={{flex:1, flexDirection:'row', marginRight:10, justifyContent:'flex-end'}}>
                <Text>{this.state.userinfo.get('address') ? this.state.userinfo.get('address') : '未设置'}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={20} color="gray"/>
            </View>
          </TouchableOpacity>

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