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
   * 抓取iwencai策略回测 Submit接口 持股天数胜率及选股结果
   * @param formData
   * @param callback
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
   * 抓取iwencai策略回测 Transaction接口 模拟交易结果
   * @param formData
   * @param callback
   */
  crawlerIWenCaiStrategyTransaction(formData, hold_for, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.iwencai.com/traceback/strategy/transaction', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    let reqData = 'hold_for=19&';
    reqData += 'sort=desc&';
    reqData += 'newType=0&';
    reqData += 'title=bought_at&';
    for(let key in formData) {
      switch (key) {
        case 'query':
          reqData += key + '=' + formData[key] + '&';
          break;
        case 'startDate':
          reqData += key + '=' + formData[key] + '&';
          reqData += 'stime' + '=' + formData[key] + '&';
          break;
        case 'endDate':
          reqData += key + '=' + formData[key] + '&';
          reqData += 'etime' + '=' + formData[key] + '&';
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

    log('crawlerIWenCaiStrategyTransaction start reqData', reqData);

    xhr.send(reqData);

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE){
        callback(JSON.parse(xhr.responseText));
      }
    };
  }

}
