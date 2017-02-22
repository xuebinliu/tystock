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

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return CommonUtil.naviGoBack(navigator);
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'关于'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle} />

          <View style={gstyles.content}>

            <Image source={require('../../img/ic_launcher.png')}
              style={{alignSelf:'center'}}/>

            <Text style={{alignSelf:'center'}}>版本1.0</Text>

            <Text style={{marginTop:40}}>    红楼是腾云出品的一款高端私密同城社交APP</Text>
          </View>
        </View>
    );
  }
}