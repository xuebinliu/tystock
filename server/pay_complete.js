/**
 * Created by free on 09/03/2017.
 *
 * 服务器计算本次开通的有效期
 * 1) 新用户或者过期用户，从服务器当前时间计算下一个有效期
 * 2）有效期内续费，累加新的开通月数
 *
 * 请求参数
 * request: {
 *  userId: xxx, 用户id
 *  month: xxx, 开通月数
 * }
 *
 * 返回
 * response: {
 *  isVip:  true/false,
 *  deadline: 2017-09-19 00:00:00
 * }
 *
 */
function onRequest(request, response, modules) {
  var userId = request.body.userId;
  var month = request.body.month;

  // 获取数据库对象
  var db = modules.oData;
  db.find({
    "table": "VIP",
    "keys": "expires",
    "where":{"userId":userId},
  }, function(err, data) {
    if(err) {
      response.send(err);
      return;
    }

    var vipInfo = JSON.parse(data);

    var oldExpires = vipInfo.results[0].expires;
    var objectId = vipInfo.results.objectId;

    var newExpires = handleExpires(month, oldExpires);

    // 把过期时间写入VIP表
    if(oldExpires) {
      // 更新过期时间
      db.update({
        "table": "VIP",
        "objectId": objectId,
        "data": {"expires": newExpires}
      },function(err, data){
        if(err) {
          response.send(err);
          return;
        }
      });
    } else {
      // 插入过期时间
      db.insert({
        "table":"VIP",
        "userId":userId,
        "data": {"expires": newExpires}
      },function(err, data){
        if(err) {
          response.send(err);
          return;
        }
      });
    }

    response.send(newExpires);
  });
}

/**
 * 获取新的过期时间
 * @param month
 * @param oldExpires
 * @return {{y, m, d}|*}
 */
function handleExpires(month, oldExpires) {
  var now = new Date();

  if(oldExpires) {
    // 字段存在，老用户
    var deadline = new Date(oldExpires.y, oldExpires.m, oldExpires.d, 0, 0, 0, 0);
    if(now.getTime() > deadline.getTime()) {
      // 过期了
      return getNewExpires(month, now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      // 没过期，累加
      return getNewExpires(month, oldExpires.y, oldExpires.m, oldExpires.d);
    }
  } else {
    // 字段不存在，首次开通
    return getNewExpires(month, now.getFullYear(), now.getMonth(), now.getDate());
  }
}

/**
 * 获取新的过期时间
 * @param month 购买月数
 * @param newYear 起始年
 * @param newMonth 起始月
 * @param newDate 起始日
 * @return {{y: *, m: *, d: number}}
 */
function getNewExpires(month, newYear, newMonth, newDate) {
  if(month == 12) {
    // 开通一年
    newYear += 1;
  } else {
    if(newMonth + month > 12) {
      // 开通月份到了下一年
      newYear += 1;
      newMonth = (newMonth + month) % 12;
    } else {
      // 没有跨年
      newMonth = newMonth + month;
    }
  }

  // 日期总是算到下一天
  newDate += 1;

  return {
    y: newYear,
    m: newMonth,
    d: newDate
  }
}
