/**
 * Created by free on 01/04/2017.
 *
 * 金策略历史回测界面
 */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import {
  gstyles,
  log,
  NavigationBar,
  CommonUtil,
} from '../../header';

import GoldComm from './GoldComm';

export default class GoldHisPage extends React.Component {

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={this.props.route.req.name + '-回测'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>CommonUtil.naviGoBack(this.props.navigator)} />

          <View style={gstyles.content}>

          </View>
        </View>
    );
  }
}