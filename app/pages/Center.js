/**
 * Created by free on 8/16/16.
 *
 * 我的界面
 */
import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    Login,
    Feedback,
    About,
    Profile,
    AlbumContainer,
    Follows,
    CommonUtil,
} from '../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Center extends React.Component {
  constructor(props) {
    super(props);

    this.updateUserState = this.updateUserState.bind(this);

    this.state = {
      nickName:'未登陆',
      mind:'',
      avatar_url:null,
    };
  }

  componentDidMount() {
    this.setUser();
  }

  /**
   * 更新头像、昵称状态
   */
  setUser = ()=>{
  };

  // login success callback
  updateUserState(){
    this.setUser();
  }

  // 点击登录
  onLogin= ()=>{
    const {navigator} = this.props;
    // go login
    navigator.push({
      component: Login,
    });
  };

  // 建议
  onFeedback= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: Feedback,
    });
  };


  onAbout = ()=>{
    const {navigator} = this.props;
    navigator.push({
      component: About,
    });
  };

  renderAvatar= ()=>{
    let url = this.state.avatar_url;
    if(url && url.length > 0) {
      return (
          <Image style={{width:60, height:60, borderRadius:30, marginLeft:10, alignSelf:'center'}} source={{uri:url}}></Image>
      );
    } else {
      return (
          <Ionicons name={"md-contact"} size={60} color="coral" style={{marginLeft:10, alignSelf:'center'}}/>
      );
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'Test3'}
              titleColor={'white'}
          />

          <View style={gstyles.content}>
            <TouchableOpacity onPress={() => {this.onLogin()}}>
              <View style={[gstyles.listItem, {flexDirection:'row', height:70, marginTop:15, position:'relative'}]}>
                {this.renderAvatar()}
                <View style={{flexDirection:'column', justifyContent:'center', marginLeft:10}}>
                  <Text>{this.state.nickName}</Text>
                  <Text>{this.state.mind}</Text>
                </View>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <View style={gstyles.noMarginline}/>
            <TouchableOpacity onPress={() => {this.onPressVersion()}}>
              <View style={[gstyles.listItem, styles.item,]}>
                <Text>充值</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.onFeedback()}}>
              <View style={[gstyles.listItem, styles.item, {marginTop:15, position:'relative'}]}>
                <Text>建议</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.noMarginline}/>

            <TouchableOpacity onPress={() => {this.onAbout()}}>
              <View style={[gstyles.listItem, styles.item]}>
                  <Text>关于</Text>
                <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end'}}>
                  <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center', marginRight:15}}/>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  op_action:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  item:{
    alignItems:'center',
    flexDirection:'row',
    height:40,
    paddingLeft:15,
    position:'relative'
  }
});
