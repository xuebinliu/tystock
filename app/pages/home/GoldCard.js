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

import GoldHis from './GoldHis';
import GoldComm from './GoldComm';

// 历史回测结果
let hisResult;

export default class GoldCard extends React.Component {
  constructor(props){
    super(props);

    log('GoldCard constructor');

    this.state = {
      name:this.props.data.name,
      maxWinRate:0.0,
      maxWinRateDay:0,
      maxAnnualYield:0.0,
      maxAnnualYieldDay:0,
    };

    let date = new Date();
    this.props.data.startDate = '2017-01-01';
    this.props.data.endDate = '2017-04-01';
  }

  componentDidMount() {
    this.reloadData();
  }

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
          // 其他人已经抓取过了，直接用
          that.updateState(data.results[0].submitResult);
        } else {
          // 服务器还没有数据，去抓取
          crawler.crawlerIWenCaiStrategySubmit(that.props.data, function (rsp) {
            if(rsp.success) {
              // 抓取成功，刷新界面
              that.updateState(rsp.data.result);
              // 上传服务器
              GoldComm.uploadStrategyHisSubmit(that.props.data, rsp.data.result);
            } else {
              log('crawlerIWenCaiStrategySubmit failed', rsp);
            }
          });
        }
      }).catch(function (err) {
        // 抓取失败
        log('queryStrategyHis json err', err);
      });
    });
  };

  updateState= (result)=> {
    this.setState({
      maxWinRate:result.rating.maxWinRate.value,
      maxWinRateDay:result.rating.maxWinRate.day,
      maxAnnualYield:result.rating.maxAnnualYield.value,
      maxAnnualYieldDay:result.rating.maxAnnualYield.day,
    });

    hisResult = result;
  };

  onPressCard= ()=>{
    if(hisResult) {
      const {navigator} = this.props;
      navigator.push({
        component:GoldHis,
        result:hisResult,
        req:this.props.data,
      });
    }
  };

  render() {
    return (
      <TouchableOpacity style={styles.card_container} onPress={this.onPressCard}>

        <Text style={styles.name}>{this.state.name}</Text>

        <View style={gstyles.line}/>

        <View style={styles.content_container}>

          <View style={styles.content_item_container}>
            <Text>最佳持股</Text>
            <Text style={{fontSize:18, color:'red'}}>{'9天'}</Text>
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
          <Text style={{fontSize:14}}>今日精选股</Text>
          <Text style={{fontSize:14}}>中远海特</Text>
        </View>

        <View style={styles.stock_container}>
          <Text>今日持仓股</Text>
          <Text>中远海特</Text>
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