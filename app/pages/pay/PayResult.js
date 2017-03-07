/**
 * Created by free on 06/03/2017.
 *
 * 支付结果界面
 */
import React from 'react';
import{
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
  log,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PayResult extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const that = this;
    setTimeout(function () {
      that.pay();
    }, 200);
  }

  pay= ()=>{
    let payData = this.props.route.payData;
    log('PayResult payData', payData);
    NativeModules.PayUtils.pay(payData.isAliPay, payData.params, function (orderId) {
      // 查询
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'支付'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={() => CommonUtil.naviGoBack(this.props.navigator)}/>

          <View style={gstyles.contentMargin}>
          </View>

        </View>
    );
  }
}