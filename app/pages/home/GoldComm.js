/**
 * Created by free on 29/03/2017.
 *
 * 金策略通信
 */

import {
  Consts,
  log,
} from '../../header';

export default GoldComm = {

  /**
   * 查询生效的策略
   * @param callback
   */
  queryStrategy(callback) {
    let url = Consts.BMOB_API_URL + 'classes/Strategy?where={"status":1}';

    log('GoldComm queryStrategy url', encodeURI(url));

    fetch(encodeURI(url), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
    }).then((response) => {
      // log('GoldComm queryStrategy', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('GoldComm queryStrategy err', error);
    });
  },

  /**
   * 查询策略回测
   * @param req : strategy data
   * @param callback
   */
  queryStrategyHis(req, callback) {
    let where = {
      startDate:req.startDate,
      endDate:req.endDate,
      stockHoldCount:req.stockHoldCount
    };

    let url = Consts.BMOB_API_URL + 'classes/' + req.his_table_name + '?where=' + JSON.stringify(where);

    log('GoldComm queryStrategyHis encode url', encodeURI(url));

    fetch(encodeURI(url), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
    }).then((response) => {
      // log('GoldComm queryStrategyHis', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('GoldComm queryStrategyHis err', error);
    });
  },

  /**
   * 上报回测数据Submit结果
   * @param req
   * @param result
   */
  uploadStrategyHisSubmit(req, result) {
    let url = Consts.BMOB_API_URL + 'classes/' + req.his_table_name;

    log('GoldComm queryStrategyHis encode url', encodeURI(url));

    fetch(encodeURI(url), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
      body: JSON.stringify({
        startDate:req.startDate,
        endDate:req.endDate,
        stockHoldCount:req.stockHoldCount,
        submitResult: result,
      })
    }).then((response) => {
      log('GoldComm uploadStrategyHisSubmit', response);
    }).catch((error) => {
      log('GoldComm uploadStrategyHisSubmit err', error);
    });
  },
}