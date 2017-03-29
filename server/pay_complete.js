/**
 * Created by free on 09/03/2017.
 *
 * 用户支付成功后，调用服务器计算本次开通的有效期
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
  {
    "code": 200,
    "msg":  VIP过期时间，1970年到现在的毫秒数
  }
 */

// TODO 为了更安全，应该把订单号传上来，让服务器查询支付结果，并保存

// exports.pay = onRequest;

// 31天的毫秒数, 用于购买月份时累加计算购买时间
var MS_PER_MONTH = 31 * 24 * 60 * 60 * 1000;

function onRequest(request, response, modules) {
  var userId = request.body.userId;
  var month = request.body.month;

  // 获取数据库对象
  var db = modules.oData;
  db.find({
    "table": "VIP",
    "where":{"userId":userId},
  }, function(err, data) {
    if(err) {
      return;
    }

    var objectId = null;
    var oldExpires = null;
    var newExpires = null;

    var vipInfo = JSON.parse(data);
    if(vipInfo.results && vipInfo.results.length > 0) {
      oldExpires = vipInfo.results[0].expires;
      objectId = vipInfo.results[0].objectId;
    }

    var now = new Date();
    if(oldExpires) {
      // 字段存在，老用户
      if (now.getTime() < oldExpires) {
        // 没过期，累加月份
        newExpires = new Date(oldExpires + month * MS_PER_MONTH);
        // setMonth 不被服务器支持
        // newExpires.setMonth(oldExpires.getMonth() + month);
      } else {
        // 过期了，从当前时间开始
        newExpires = new Date(now.getTime() + month * MS_PER_MONTH);
      }
    } else {
      // 新购买用户，从当前时间开始
      newExpires = new Date(now.getTime() + month * MS_PER_MONTH);
    }

    // 把新的过期时间写入VIP表
    if(oldExpires) {
      // 老用户，更新过期时间
      db.update({
        "table": "VIP",
        "objectId": objectId,
        "data": {"expires": newExpires.getTime()}
      },function(err, data){
        if(err) {
          return;
        }
        response.send(newExpires.getTime());
      });
    } else {
      // 插入过期时间
      db.insert({
        "table":"VIP",
        "data": {"userId":userId, "expires": newExpires.getTime()}
      }, function(err, data){
        if(err) {
          return;
        }
        response.send(newExpires.getTime());
      });
    }
  });
}
