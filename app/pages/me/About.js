/**
 * Created by free on 2/5/17.
 */

import React from 'react';
import{
  View,
  Image,
  Text,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
} from '../../header';

export default class About extends React.Component {

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'关于'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>CommonUtil.naviGoBack(this.props.navigator)} />

          <View style={gstyles.content}>

            <Image source={require('../../img/ic_launcher.png')}
              style={{alignSelf:'center'}}/>

            <Text style={{alignSelf:'center'}}>版本1.0</Text>

            <Text style={{marginTop:40}}>量子VIP</Text>
          </View>
        </View>
    );
  }
}