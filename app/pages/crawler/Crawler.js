/**
 * Created by free on 31/03/2017.
 *
 * 全网选股策略
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  log,
} from '../../header';

import * as Const from '../../const.js';

export default class Crawler extends React.Component {

  render(){
    return (
        <View style={gstyles.container}>
          <NavigationBar title={'全网策略'}/>

          <View style={gstyles.content}>

          </View>

        </View>
    );
  }
}
