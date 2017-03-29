/**
 * Created by free on 25/03/2017.
 *
 * 抓取
 */


export default class crawler {

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
  static crawlerIWenCaiStrategySubmit(formData, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://www.iwencai.com/traceback/strategy/submit', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    let reqData = 'query=BBI大于5小于10；量比大于0.5小于3；换手率大于2%小于7%；按总市值从小到大排列;&' +
        'daysForSaleStrategy=2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30&' +
        'startDate=2016-01-01&' +
        'endDate=2016-04-01&' +
        'fell=0.001&' +
        'upperIncome=5&' +
        'lowerIncome=15&' +
        'fallIncome=4&' +
        'stockHoldCount=1';

    xhr.send(reqData);

    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE){
        console.log('crawlerTest rsp', xhr.responseText);
      }
    };
  }

  /**
   * 抓取iwencai策略回测 模拟交易结果
   * @param formData
   * @param callback
   */
  static crawlerIWenCaiStrategyTransaction(formData, callback) {

  }

}
