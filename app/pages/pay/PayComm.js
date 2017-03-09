/**
 * Created by free on 08/03/2017.
 */

import {
  UserComm,
  Consts,
  DeviceStorage,
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

  /**
   * 成功的订单信息保存到服务器
    * @param order 订单信息
   * @param callback
   */
  saveOrderToServer(order, callback) {
    log('PayComm saveOrderToServer req', order);

    // 获取用户信息
    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      // 保存订单
      fetch(Consts.BMOB_API_URL + 'classes/Order', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
          'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
        },
        body: JSON.stringify({
          order:order,
          userId:userInfo.objectId,
        })
      }).then(function (rsp) {
        log('PayComm saveOrderToServer rsp', rsp);

        if(rsp.status == 201) {
          // 保存order成功，计算保存会员有效期

          callback(null, rsp);
        }
        // 保存服务器成功，通知UI
      }).catch(function (err) {
        log('PayComm saveOrderToServer err', err);
      });
    });
  },
}