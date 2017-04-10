/**
 * Created by free on 8/16/16.
 *
 * 大厅页面
 */
import React from 'react';
import {
  View,
} from 'react-native';

import {
  BaseListViewComponent,
  log,
} from '../../header';

import GoldComm from './GoldComm';
import GoldCard from './GoldCard';

export default class Home extends BaseListViewComponent {
  constructor(props) {
    super(props);
    log('Home constructor');

    this.state = {
      nav_title:'量子金策',
      isFirstLoading:true,    // 是否首次加载
    };
  }

  // 加载量子金策数据
  loadData= (index)=>{
    log('Home loadData index', index);

    const that = this;
    GoldComm.queryStrategy(function (err, response) {
      if(err) {
        return;
      }

      response.json().then(function (jsonData) {
        that.updateData(jsonData.results);
      }).catch(function (err) {
        log('Home loadData err', err);
      })
    });
  };

  // 渲染行
  renderRow= (rowData, sectionID, rowID, highlightRow)=>{
    log('Home renderRow',  sectionID, rowID);
    return (<GoldCard navigator={this.props.navigator} data={rowData}/>);
  };

  // 重载去掉分割线
  renderSeparator= (sectionID, rowID)=>{
    return (<View key={`${sectionID}-${rowID}`}></View>);
  };
}
