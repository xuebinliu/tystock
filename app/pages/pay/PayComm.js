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
    log('saveOrderToServer req', order);

    // 获取用户信息
    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      // 排除User表中订单id相同的订单
      if(userInfo.orders) {
        for(let orderId of userInfo.orders) {
          if(orderId == order.out_trade_no) {
            log('saveOrderToServer order id already exist, orderId=', orderId);
            return;
          }
        }
      }

      // 保存order到order表
      fetch(Consts.BMOB_API_URL + 'classes/Order', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
          'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
        },
        body: JSON.stringify({
          order:order
        })
      }).then(function (rsp) {
        log('saveOrderToServer rsp', rsp);

        if(rsp.status == 201) {
          // order表记录添加成功
          // 保存order表id到user表中
          rsp.json().then(function (data) {
            this.saveOrderIdToUser(userInfo, order, data.objectId)
          });
        }

        // 保存服务器成功，通知UI
      }).catch(function (err) {
        log('saveOrderToServer err', err);
      });
    });
  },

  saveOrderIdToUser(userInfo, order, orderObjectId) {
    log('saveOrderIdToUser req orderObjectId', orderObjectId);
    let orders;
    if(userInfo.orders && userInfo.orders.length > 0) {
      orders = [].concat(userInfo.orders, orderObjectId)
    } else {
      orders = [orderObjectId];
    }

    // 计算有效期
    let orderDate = new Date(order.create_time);
    let year = orderDate.getFullYear();   // 年
    let month = orderDate.getMonth();     // 月
    let date = orderDate.getDate();       // 日

    let buyMonth = parseInt(order.name);
    if(buyMonth == 12) {
      // 购买12个月，加1年
      year += 1;
    } else {
      if(buyMonth + month > 12) {
        // 购买月份和当前月份相加大于12月份，则年加1，月份取余
        year += 1;
        month = (buyMonth + month) % 12;
      } else {
        month = buyMonth + month;
      }
    }

    date += 1;

    log('saveOrderIdToUser deadline', year, month, date);
    let deadline = new Date(year, month, date, 0, 0, 0, 0);

    // 保存order id到user表
    fetch(Consts.BMOB_API_URL + 'users/' + userInfo.objectId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
        'X-Bmob-Session-Token': userInfo.sessionToken,
      },
      body: JSON.stringify({
        orders:orders,
        vip_valid_day:deadline.getTime(),
      })
    }).then(function (rsp) {
      log('saveOrderIdToUser rsp', rsp);

      if(rsp.status == 200) {
        DeviceStorage.update(Consts.ACCOUNT_USERINFO_KEY, {orders: orders});
        // TODO 保存服务器成功，通知UI

      }
    }).catch(function (err) {
      log('saveOrderIdToUser err', err);
    });
  },
}