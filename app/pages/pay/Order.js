/**
 * Created by free on 06/03/2017.
 *
 * 订单界面
 */
import React from 'react';
import{
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
  Consts,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Order extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      checked:0,    // checkbox选择态，0都未选中，1支付宝，2微信
    };
  }

  // 点击选择支付
  onPressSelectPay= (select)=>{
    this.setState({
      checked:select,
    })
  };

  // 点击支付
  onPressPay= ()=>{

  };

  getProductInfo= ()=>{
    let info;
    if(this.props.route.number == 1) {
      info = '量子VIP(1个月)';
    } else if(this.props.route.number == 3) {
      info = '量子VIP(3个月)';
    } else if(this.props.route.number == 6) {
      info = '量子VIP(6个月)';
    } else if(this.props.route.number == 12) {
      info = '量子VIP(12个月)';
    } else {
      info = '量子VIP(1个月)';
    }
    return info;
  };

  getPrice= ()=>{
    let price;
    if(this.props.route.number == 1) {
      price = 300;
    } else if(this.props.route.number == 3) {
      price = 810;
    } else if(this.props.route.number == 6) {
      price = 1530;
    } else if(this.props.route.number == 12) {
      price = 2880;
    } else {
      price = 300;
    }
    return '￥' + price + '元';
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'支付'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>CommonUtil.naviGoBack(this.props.navigator)} />

          <View style={gstyles.contentMargin}>

            <View style={styles.productItem}>
              <Text style={styles.productItemText}>商品信息</Text>
              <Text style={styles.productItemText}>{this.getProductInfo()}</Text>
            </View>
            <View style={gstyles.noMarginline}/>

            <View style={styles.productItem}>
              <Text style={styles.productItemText}>支付金额</Text>
              <Text style={[styles.productItemText, {color:Consts.COLOR_MAIN}]}>{this.getPrice()}</Text>
            </View>

            <Text style={{fontSize:14, margin:10}}>选择支付方式</Text>

            <TouchableOpacity style={styles.payItem} onPress={()=>this.onPressSelectPay(1)}>
              <Image source={require('../../img/pay_ali.png')} style={styles.payImg}/>
              <Text style={styles.productItemText}>支付宝支付</Text>
              <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end'}}>
                <Ionicons name={this.state.checked==1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24}
                          color={this.state.checked==1 ? "#fd7736" : "dimgray"}/>
              </View>
            </TouchableOpacity>
            <View style={gstyles.noMarginline}/>

            <TouchableOpacity style={styles.payItem}  onPress={()=>this.onPressSelectPay(2)}>
              <Image source={require('../../img/pay_weixin.png')} style={styles.payImg}/>
              <Text style={styles.productItemText}>微信支付</Text>
              <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end'}}>
                <Ionicons name={this.state.checked==2 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24}
                          color={this.state.checked==2 ? "#fd7736" : "dimgray"}/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onPressLogin} style={[gstyles.button, {marginTop:30}]}>
              <Text style={{color:'white'}}>支付</Text>
            </TouchableOpacity>

          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  productItem:{
    backgroundColor:'white',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    height:48,
    paddingHorizontal:10,
  },

  productItemText:{
    fontSize:16,
    color:'#252525cc',
  },

  payItem:{
    backgroundColor:'white',
    alignItems:'center',
    flexDirection:'row',
    height:60,
    paddingHorizontal:10,
  },

  payImg:{
    width:40,
    height:40,
    marginRight:10,
  }


});

