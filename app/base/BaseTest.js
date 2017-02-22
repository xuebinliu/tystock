/**
 * Created by free on 14/02/2017.
 *
 * 测试base list view
 */

import React from 'react';
import{
  Text,
} from 'react-native';

import BaseListViewComponent from './BaseListViewComponent';

export default class BaseTest extends BaseListViewComponent {
  constructor(props){
    super(props);

    console.log('BaseTest constructor');
  }

  componentDidMount(){
    console.log('BaseTest componentDidMount');

    this.loadData(0);
  }

  loadData= (index)=>{
    console.log('BaseTest loadData');

    const that = this;
    setTimeout(function () {
      that.updateData(['row1', 'row2']);
    }, 3000);
  };

  renderRow= (rowData, sectionID, rowID)=>{
    console.log('BaseTest renderRow');
    return (<Text>'1111'</Text>);
  };
}