/**
 * Created by free on 9/12/16.
 * 修改性别
 */
import React from 'react';
import{
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AV from 'leancloud-storage';

/**
 * sex: 0男 1女 2保密
 */
export default class ModifySex extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sex:AV.User.current().get('sex'),
    }
  }

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onPressSexRadio= (sex)=>{
    AV.User.current().set('sex', sex);
    AV.User.current().save();

    const {route} = this.props;
    route.callback();

    this.onBackHandle();
    toastShort('修改成功');
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'修改性别'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <View style={gstyles.content}>
            <TouchableOpacity onPress={()=>this.onPressSexRadio(0)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>男</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.sex==0 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.onPressSexRadio(1)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>女</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.sex==1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.onPressSexRadio(2)}>
              <View style={[gstyles.listItem, {height:50, flexDirection:'row', alignItems:'center', paddingHorizontal:15}]}>
                <Text>保密</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={this.state.sex==2 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </View>
    );
  }
}