/**
 * Created by free on 8/31/16.
 *
 * 发布单子页面
 *
 */

import React from 'react';
import {
    View,
} from 'react-native';

import {
    NavigationBar,
    gstyles,
    naviGoBack,
} from '../header';

import * as Const from '../const';


export default class Publish extends React.Component{
  constructor(props) {
    super(props);

    this.onBackHandle = this.onBackHandle.bind(this);
    this.onClickPublish = this.onClickPublish.bind(this);
  }

  onBackHandle() {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onClickPublish(){

  }

  render(){
    return(
        <View style={gstyles.container}>

          <NavigationBar
              title={'发单'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
              onRightButtonPress={this.onClickPublish}
              rightButtonIcon={Const.IC_NAV_CHECK}
          />

          <View style={gstyles.content}>

          </View>

        </View>
    );
  }
}