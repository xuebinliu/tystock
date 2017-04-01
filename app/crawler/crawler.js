/**
 * Created by free on 25/03/2017.
 *
 * 抓取
 */

import {
  log
} from '../header';

export default crawler = {

  /**
   * 抓取iwencai策略回测 持股天数胜率及选股结果
   * @param formData
   * @param callback
   *
   * Form Data:
       query:BBI大于5小于10；量比大于0.5小于3；换手率大于2%小于7%；按总市值从小到大排列;
       daysForSaleStrategy:2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
       startDate:2016-01-01
       endDate:2017-02-20
       fell:0.001
       upperIncome:5
       lowerIncome:15
       fallIncome:4
       stockHoldCount:1
   */
  crawlerIWenCaiStrategySubmit(formData, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.iwencai.com/traceback/strategy/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    let reqData = '';
    for(let key in formData) {
      switch (key) {
        case 'query':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'startDate':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'endDate':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'fell':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'upperIncome':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'lowerIncome':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'fallIncome':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'stockHoldCount':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'daysForSaleStrategy':
          reqData += key + '=' + formData[key] + '&';
          break;
      }
    }
    log('crawlerIWenCaiStrategySubmit start reqData', reqData);

    xhr.send(reqData);

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE){
        callback(JSON.parse(xhr.responseText));
      }
    };
  },

  /**
   * 抓取iwencai策略回测 模拟交易结果
   * @param formData
   * @param callback
   */
  crawlerIWenCaiStrategyTransaction(formData, callback) {

  }

}
