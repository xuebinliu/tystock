/**
 * Created by free on 01/04/2017.
 *
 * 金策略历史回测界面
 */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ListView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';

import {
  gstyles,
  log,
  NavigationBar,
  CommonUtil,
} from '../../header';

import GoldComm from './GoldComm';

// 请求参数
let req;
// 选股结果
var stock_ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
// 历史交易结果
var transaction_ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class GoldHisPage extends React.Component {

  constructor(props) {
    super(props);

    req = this.props.route.req;

    this.state = {
      startDate:req.startDate,
      endDate:req.endDate,
      holdStockCount:req.stockHoldCount,
      submitResult:this.props.route.submitResult,           // 收益回测结果
      stockData:this.props.route.stockData,                 // 当前选股结果
      transactionResult:this.props.route.transactionResult, // 模拟交易结果

      stock_dataSource:stock_ds.cloneWithRows(this.props.route.stockData.list.data),
      transaction_dataSource:transaction_ds.cloneWithRows(this.props.route.transactionResult.data),
    };

    log('GoldHisPage constructor req=', req);
  }

  // 执行回测
  onPressTest= ()=>{
    Keyboard.dismiss();
  };

  /**
   * 渲染胜率、年化收益率等结果
   */
  renderResult= ()=>{
    return (
        <View style={styles.result_container}>
          <View style={styles.result_item_container}>
            <Text>最佳持股</Text>
            <Text style={{fontSize:18, color:'red'}}>{this.state.submitResult.rating.maxWinRate.day + '天'}</Text>
          </View>

          <View style={{backgroundColor:'#e4e4e4', width:1, marginVertical:5}}/>

          <View style={styles.result_item_container}>
            <Text>最大胜率</Text>
            <Text style={{fontSize:18, color:'red'}}>{(this.state.submitResult.rating.maxWinRate.value*100).toFixed(2) + '%'}</Text>
          </View>

          <View style={{backgroundColor:'#e4e4e4', width:1, marginVertical:5}}/>

          <View style={styles.result_item_container}>
            <Text>最大年化收益率</Text>
            <Text style={{fontSize:18, color:'red'}}>{(this.state.submitResult.rating.maxAnnualYield.value*100).toFixed(2) + '%'}</Text>
          </View>
        </View>
    );
  };

  /**
   * 渲染回测条件
   */
  renderFilter= ()=>{
    return (
      <View style={styles.filter_container}>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', height:45}}>
          <Text style={{}}>起始时间:</Text>
          <DatePicker
              style={{width: 200, marginLeft:10}}
              date={this.state.startDate}
              mode="date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => {this.setState({startDate: date})}}
              onOpenModal={()=>Keyboard.dismiss()}
              customStyles={{
                dateInput:{
                  borderWidth: 0,
                }
              }}
          />
          <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center'}}/>
        </View>

        <View style={gstyles.noMarginline}/>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', height:45}}>
          <Text style={{}}>截止时间:</Text>
          <DatePicker
              style={{width: 200, marginLeft:10}}
              date={this.state.endDate}
              mode="date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => {this.setState({endDate: date})}}
              onOpenModal={()=>Keyboard.dismiss()}
              customStyles={{
                dateInput:{
                  borderWidth: 0,
                }
              }}
          />
          <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{alignSelf:'center'}}/>
        </View>

        <View style={gstyles.noMarginline}/>

        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{}}>持股数量:</Text>
          <TextInput onChangeText={(text)=> {this.setState({holdStockCount:Number(text)})}}
                     style={[gstyles.input, {height: 50, flex:1, borderBottomColor:'#fd7736'}]}
                     value={this.state.holdStockCount == 0 ? '' : this.state.holdStockCount + ''}
                     keyboardType="numeric"
                     multiline={false}
                     textAlign="center"
                     maxLength={2}
          />
        </View>

        <View style={gstyles.noMarginline}/>

        <TouchableOpacity onPress={this.onPressTest} style={[gstyles.button, {marginVertical:10}]}>
          <Text style={{color:'white'}}>执行回测</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * 渲染选股结果
   * @param rowData
   * @return {XML}
   */
  renderStockResultRow= (rowData)=>{
    log('renderStockResultRow', rowData);
    return (
        <View style={{flexDirection:'row', alignItems:'center', height:30}}>
          <Text style={{flex:1}}>{rowData.codeName}</Text>
          <Text style={{flex:1}}>{rowData.code}</Text>
          <Text style={{flex:1}}>{rowData.zdf + '%'}</Text>
          <Text style={{flex:1}}>{rowData.dde}</Text>
        </View>
    );
  };

  /**
   * 渲染list头部
   * @return {XML}
   */
  renderStockHeader= ()=>{
    return (
      <View>
        <View style={{flexDirection:'row', alignItems:'center', height:30}}>
          <Text style={{flex:1}}>名称</Text>
          <Text style={{flex:1}}>代码</Text>
          <Text style={{flex:1}}>涨跌幅</Text>
          <Text style={{flex:1}}>DDE</Text>
        </View>
        <View style={gstyles.noMarginline}></View>
      </View>
    );
  };

  /**
   * 渲染当前条件的选股结果
   */
  renderStockResult= ()=>{
    return (
      <View>
        <Text style={{margin:10, fontSize:16}}>选股结果</Text>
        <ListView
            style={{backgroundColor:'white', paddingHorizontal:10}}
            renderHeader={this.renderStockHeader}
            dataSource={this.state.stock_dataSource}
            renderRow={this.renderStockResultRow}
            renderSeparator={this.renderSeparator}
        />
      </View>
    );
  };

  /**
   * 渲染历史交易结果
   */
  renderTransactionResult= ()=>{
    return (
      <View>
        <Text style={{margin:10, fontSize:16}}>历史交易结果</Text>
        <ListView
            style={{backgroundColor:'white', paddingHorizontal:10}}
            renderHeader={this.renderTransactionHeader}
            dataSource={this.state.transaction_dataSource}
            renderRow={this.renderTransactionResultRow}
            renderSeparator={this.renderSeparator}
        />
      </View>
    );
  };

  renderTransactionHeader= ()=>{
    return(
      <View>
        <View style={{flexDirection:'row', alignItems:'center', height:30}}>
          <Text style={{flex:1}}>名称/代码</Text>
          <Text style={{flex:1}}>买入/价格</Text>
          <Text style={{flex:1}}>卖出/价格</Text>
          <Text style={{flex:1}}>盈亏</Text>
        </View>
        <View style={gstyles.noMarginline}></View>
      </View>
    );
  };

  /**
   * 渲染选股结果
   * @param rowData
   * @return {XML}
   */
  renderTransactionResultRow= (rowData)=>{
    log('renderTransactionResultRow', rowData);
    return (
      <View style={{flexDirection:'row', alignItems:'center', height:50}}>
        <View style={{flex:1}}>
          <Text>{rowData.stock_name}</Text>
          <Text>{rowData.stock_code}</Text>
        </View>
        <View style={{flex:1}}>
          <Text>{rowData.bought_at}</Text>
          <Text>{rowData.buying_price}</Text>
        </View>
        <View style={{flex:1}}>
          <Text>{rowData.sold_at}</Text>
          <Text>{rowData.selling_price}</Text>
        </View>
        <View style={{flex:1}}>
          <Text>{rowData.signal_return_rate + '%'}</Text>
        </View>
      </View>
    );
  };

  renderSeparator= (sectionID, rowID)=>{
    return (<View key={`${sectionID}-${rowID}`} style={gstyles.noMarginline}></View>);
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'-回测'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={()=>CommonUtil.naviGoBack(this.props.navigator)} />

          <ScrollView style={gstyles.content}>
            {this.renderResult()}
            {this.renderFilter()}
            {this.renderStockResult()}
            {this.renderTransactionResult()}
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  result_container:{
    flexDirection:'row',
    backgroundColor:'white',
    marginVertical:10
  },

  result_item_container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginVertical:5,
  },

  time_container:{
    flexDirection:'row',
  },

  filter_container:{
    backgroundColor:'white',
    paddingHorizontal:10,
  },

  // 选出的股票
  stock_container:{
    flexDirection:'row',
    backgroundColor:'#f9f9f9',
    height:35,
    marginTop:5,
    justifyContent:'space-around',
    alignItems:'center',
  },

  // 调仓容器
  trans_container:{

  },

});