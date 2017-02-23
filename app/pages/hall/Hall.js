/**
 * Created by free on 8/16/16.
 *
 * 大厅页面
 */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
} from '../../header';

import * as Const from '../../const.js';

export default class Hall extends React.Component {
  constructor(props) {
    super(props);
    console.log('Hall constructor');

    this.state = {
      isFirstLoading: false,
    };
  }

  render(){
    return (
        <View style={gstyles.container}>
          <NavigationBar title={'量子'}/>

          <View style={gstyles.content}>
          </View>

        </View>
    );
  }
}

const IMAGE_SIZE = (Dimensions.get('screen').width - 5*4)/2;
const styles = StyleSheet.create({
  itemContainer:{
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
    marginTop:5,
    marginHorizontal:5,
    borderRadius:4,
  },

  itemImage:{
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
    borderRadius:4,
  },
});
