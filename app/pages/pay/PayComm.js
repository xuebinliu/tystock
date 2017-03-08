/**
 * Created by free on 08/03/2017.
 */

import {
  Consts,
  log,
} from '../../header';

export default PayComm = {

  /**
   * 查询订单支付结果
   * @param orderId
   * @param callback
   */
  queryOrder(orderId, callback) {
    log('PayComm queryOrder orderId=', orderId);
    fetch(Consts.BMOB_API_URL + 'pay/' + orderId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
    }).then((response) => {
      // log('PayComm queryOrder response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('PayComm queryOrder err', error);
    });
  },
}