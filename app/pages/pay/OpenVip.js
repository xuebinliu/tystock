/**
 * Created by free on 06/03/2017.
 *
 * 开通VIP界面
 */
import React from 'react';
import{
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  CommonUtil,
  Consts,
} from '../../header';

import Order from './Order';


export default class OpenVip extends React.Component {

  /**
   * 点击开通按钮
   * @param number 开通月数 1个月
   */
  onPressOpen= (number)=>{
    const {navigator} = this.props;
    navigator.push({
      component:Order,
      number:number,
    })
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'开通量子VIP'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>CommonUtil.naviGoBack(this.props.navigator)} />

          <ScrollView style={gstyles.contentMargin}>

            <Text style={styles.title}>
              选择套餐
            </Text>
            <View style={gstyles.noMarginline}/>

            <Text style={[styles.title, {fontSize:14}]}>
              开通VIP即可随时查看所有量子策略的选股结果及调仓情况
            </Text>
            <View style={gstyles.noMarginline}/>

            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>1个月</Text>
              <Text style={styles.price}>￥300元</Text>
              <TouchableOpacity style={styles.btn} onPress={()=>this.onPressOpen(1)}>
                <Text style={styles.btnText}>开通</Text>
              </TouchableOpacity>
            </View>
            <View style={gstyles.noMarginline}/>

            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>3个月</Text>
              <Text style={styles.price}>￥810元</Text>
              <TouchableOpacity style={styles.btn} onPress={()=>this.onPressOpen(3)}>
                <Text style={styles.btnText}>开通</Text>
              </TouchableOpacity>
            </View>
            <View style={gstyles.noMarginline}/>

            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>6个月</Text>
              <Text style={styles.price}>￥1530元</Text>
              <TouchableOpacity style={styles.btn} onPress={()=>this.onPressOpen(6)}>
                <Text style={styles.btnText}>开通</Text>
              </TouchableOpacity>
            </View>
            <View style={gstyles.noMarginline}/>

            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>12个月</Text>
              <Text style={styles.price}>￥2880元</Text>
              <TouchableOpacity style={styles.btn} onPress={()=>this.onPressOpen(12)}>
                <Text style={styles.btnText}>开通</Text>
              </TouchableOpacity>
            </View>
            <View style={gstyles.noMarginline}/>

            <View style={{paddingHorizontal:10, paddingTop:20}}>
              <Text style={{fontSize:16, color:Consts.COLOR_TEXT_60, paddingBottom:5}}>
                VIP开通说明：
              </Text>
              <Text style={{fontSize:14, color:Consts.COLOR_TEXT_60, paddingBottom:5}}>
                1) 点击"开通"按钮即代表您同意"量子选股"服务协议
              </Text>
              <Text style={{fontSize:14, color:Consts.COLOR_TEXT_60, paddingBottom:5}}>
                2) 购买过程如遇问题可联系量子客服QQ: Tel:
              </Text>

              <Text style={{alignSelf:'center',fontSize:14, color:Consts.COLOR_TEXT_LINK, paddingBottom:5}}>
                服务协议
              </Text>
            </View>

          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  title:{
    fontSize:16,
    color:'#252525cc',
    paddingVertical:10,
    paddingLeft:10,
    backgroundColor:'white'
  },

  itemContainer:{
    flexDirection:'row',
    flex:1,
    height:60,
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:10,
    backgroundColor:'white'
  },

  itemTitle:{
    flex:2,
    fontSize:16,
    color:'#252525cc'
  },

  price:{
    flex:1,
    fontSize:16,
    color:'#fd7736'
  },

  btn:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
  },

  btnText:{
    color:'white',
    backgroundColor:'#fd7736',
    paddingVertical:5,
    paddingHorizontal:20,
    borderRadius:2,
    fontSize:14,
  }

});