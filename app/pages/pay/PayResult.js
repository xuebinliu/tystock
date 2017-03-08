/**
 * Created by free on 06/03/2017.
 *
 * 支付结果界面
 */
import React from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
  LoadingView,
  toastShort,
  log,
} from '../../header';

import PayComm from './PayComm';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class PayResult extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading:true,
      payResult:null,
      orderId:null,
    };
  }

  componentDidMount() {
    this.pay();
  }

  pay= ()=>{
    let payData = this.props.route.payData;
    log('PayResult payData', payData);

    const that = this;
    NativeModules.PayUtils.pay(payData.isAliPay, payData.params, function (result, orderId) {
      that.setState({
        isLoading:false,
        payResult:result,
        orderId:orderId
      });

      that.query();
    });
  };

  query= ()=>{
    const that = this;
    PayComm.queryOrder(this.state.orderId, function (err, rsp) {
      that.setState({
        isLoading:false,
      });

      if(err) {
        toastShort('查询失败，请稍后重试');
        return;
      }

      rsp.json().then(function (data) {
        log('query order=', that.state.orderId, ', rsp data=', data);
        if(data.trade_state == 'NOTPAY') {
          // 未支付成功
          that.setState({
            payResult:'failed',
          });

          // 保存订单信息到服务器
          PayComm.saveOrderToServer(data, function (err) {
            if(err) {
              log('saveOrderToServer failed', data, err);
              toastShort('保存订单到服务器失败，如未开通请联系客服');
              return;
            } else {
              toastShort('恭喜您已开通量子VIP服务');
            }
          });

        } else if(data.trade_state == 'SUCCESS') {
          that.setState({
            payResult:'success',
          });

          // 保存订单信息到服务器
          PayComm.saveOrderToServer(data, function (err) {
            if(err) {
              log('saveOrderToServer failed', data, err);
              toastShort('保存订单到服务器失败，如未开通请联系客服');
              return;
            } else {
              toastShort('恭喜您已开通量子VIP服务');
            }
          });
        }
      });
    });
  };

  onPressQuery= ()=>{
    this.setState({
      isLoading:true,
    });

    this.query();
  };

  renderContent= ()=> {
    if(this.state.isLoading) {
      if(!this.state.orderId) {
        return (<LoadingView text="正在获取订单，请稍后..."/>);
      } else {
        return (<LoadingView text="正在查询，请稍后..."/>);
      }
    } else {
      // 展示支付结果
      if(this.state.payResult == 'success') {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Ionicons name="md-checkmark" size={80} color="green"/>
              <Text style={{fontSize:16, marginTop:10}}>恭喜您支付成功</Text>
            </View>
        );
      } else if(this.state.payResult == 'failed') {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Ionicons name="md-close" size={80} color="red"/>
              <Text style={{fontSize:16, marginTop:10}}>亲，支付失败了，请重新支付</Text>
            </View>
        );
      } else if(this.state.payResult == 'unknown') {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity onPress={this.onPressQuery}>
                <Ionicons name="md-refresh" size={80} color="gray"/>
              </TouchableOpacity>
              <Text style={{fontSize:16, marginTop:10}}>支付结果未知，请您点击刷新按钮查询</Text>
            </View>
        );
      }
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'支付'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={() => CommonUtil.naviGoBack(this.props.navigator)}/>

          <View style={gstyles.contentMargin}>
            {this.renderContent()}
          </View>

        </View>
    );
  }
}