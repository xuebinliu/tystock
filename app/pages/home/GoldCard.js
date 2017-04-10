/**
 * Created by free on 29/03/2017.
 *
 * 金策略卡片
 */
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  gstyles,
  crawler,
  log,
} from '../../header';

import GoldHisPage from './GoldHisPage';
import GoldComm from './GoldComm';

let objectId;

// 回测结果
let submitResult;   // 收益回测结果
let stockData;      // 当前选股结果
let transactionResult; // 模拟交易结果

export default class GoldCard extends React.Component {
  constructor(props){
    super(props);

    log('GoldCard constructor');

    this.state = {
      name:this.props.data.name,
      maxWinRate:0.0,
      maxWinRateDay:0,
      maxAnnualYield:0.0,
      currentSelectStock:'',
      currentTransStock:'',
    };

    let date = new Date();
    this.props.data.startDate = '2017-01-01';
    this.props.data.endDate = '2017-04-01';
  }

  componentDidMount() {
    this.reloadData();
  }

  onPressCard= ()=>{
    if(submitResult) {
      const {navigator} = this.props;
      navigator.push({
        component:GoldHisPage,
        submitResult:submitResult,
        stockData:stockData,
        transactionResult:transactionResult,
        req:this.props.data,
      });
    }
  };

  /**
   * 拉不到回测数据则抓取并上传
   */
  reloadData= ()=>{
    const that = this;
    GoldComm.queryStrategyHis(this.props.data, function (err, response) {
      if(err) {
        return;
      }

      response.json().then(function (data) {
        if(data.results.length > 0) {

          objectId = data.data;
          log('queryStrategyHis objectId', objectId);

          // 其他人已经抓取过了，直接用
          if(data.results[0].submitResult) {
            that.updateSubmitResult(data.results[0].submitResult, data.results[0].stockData);
          } else {
            // 服务器还没有数据，去抓取Submit结果
            that.crawlerSubmit();
          }

          if(data.results[0].transactionResult) {
            that.updateTransactionResult(data.results[0].transactionResult);
          } else {
            that.crawlerTransaction();
          }
        } else {
          // 服务器还没有数据，抓取Submit结果
          that.crawlerSubmit();
        }
      }).catch(function (err) {
        // 抓取失败
        log('queryStrategyHis json err', err);
      });
    });
  };

  crawlerSubmit= ()=>{
    log('crawlerSubmit start');

    const that = this;
    crawler.crawlerIWenCaiStrategySubmit(this.props.data, function (rsp) {
      if(rsp.success) {
        // 抓取成功，刷新界面
        that.updateSubmitResult(rsp.data.result, rsp.data.stockData);
        // 上传服务器
        GoldComm.uploadStrategyHisSubmit(that.props.data, rsp.data.result, rsp.data.stockData, function (err, rsp) {
          rsp.json().then(function (data) {
            objectId = data.objectId;
            log('crawlerSubmit uploadStrategyHisSubmit complete objectId', objectId);

            if(!transactionResult && objectId) {
              that.crawlerTransaction();
            }
          });
        });

        log('crawlerSubmit complete');
      } else {
        log('crawlerIWenCaiStrategySubmit failed', rsp);
      }
    });
  };

  crawlerTransaction= ()=>{
    if(this.state.maxWinRateDay == 0 || !submitResult) {
      log('crawlerTransaction not ready');
      return;
    }

    log('crawlerTransaction start');

    const that = this;
    crawler.crawlerIWenCaiStrategyTransaction(this.props.data, 19, function (rsp) {
      if(rsp.success) {
        that.updateTransactionResult(rsp);
        GoldComm.uploadStrategyHisTransaction(that.props.data, objectId, rsp);
        log('crawlerTransaction complete');
      } else {
        log('crawlerIWenCaiStrategyTransaction failed', rsp);
      }
    });
  };

  // 更新submit接口结果
  updateSubmitResult= (sr, sd)=> {
    submitResult = sr;
    stockData = sd;
    this.setState({
      maxWinRate:submitResult.rating.maxWinRate.value,
      maxWinRateDay:submitResult.rating.maxWinRate.day,
      maxAnnualYield:submitResult.rating.maxAnnualYield.value,
      currentSelectStock:stockData.list.data[0].codeName
    });
  };

  // 更新transaction接口结果
  updateTransactionResult= (tr)=>{
    transactionResult = tr;
    this.setState({
      currentTransStock:transactionResult.data[0].stock_name
    });
  };

  render() {
    return (
      <TouchableOpacity style={styles.card_container} onPress={this.onPressCard}>

        <Text style={styles.name}>{this.state.name}</Text>

        <View style={gstyles.line}/>

        <View style={styles.content_container}>

          <View style={styles.content_item_container}>
            <Text>最佳持股</Text>
            <Text style={{fontSize:18, color:'red'}}>{this.state.maxWinRateDay + '天'}</Text>
          </View>

          <View style={{backgroundColor:'#e4e4e4', width:1, marginVertical:5}}/>

          <View style={styles.content_item_container}>
            <Text>最大胜率</Text>
            <Text style={{fontSize:18, color:'red'}}>{(this.state.maxWinRate*100).toFixed(2) + '%'}</Text>
          </View>

          <View style={{backgroundColor:'#e4e4e4', width:1, marginVertical:5}}/>

          <View style={styles.content_item_container}>
            <Text>最大年化收益率</Text>
            <Text style={{fontSize:18, color:'red'}}>{(this.state.maxAnnualYield*100).toFixed(2) + '%'}</Text>
          </View>

        </View>

        <View style={styles.stock_container}>
          <Text style={{fontSize:14}}>今日精选</Text>
          <Text style={{fontSize:14}}>{this.state.currentSelectStock}</Text>
        </View>

        <View style={styles.stock_container}>
          <Text>今日持仓</Text>
          <Text>{this.state.currentTransStock}</Text>
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card_container:{
    flexDirection:'column',
    height:180,
    backgroundColor:'white',
    borderRadius:4,
    margin:10,
  },

  name:{
    fontSize:16,
    alignSelf:'center',
    marginVertical:10,
  },

  content_container:{
    flexDirection:'row',
  },

  content_item_container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginVertical:5,
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