/**
 * Created by free on 09/03/2017.
 *
 * 获取vip状态，获取时机：
 * 1）每次启动获取一次
 * 2）支付完成获取一次
 *
 * vip状态保存在全局变量里面, 以便各个模块方便查询
 *
 * 请求参数
 * request: {
 *  userId : xxx,
 * }
 *
 * 返回
 * response: {
 *  deadline: 2017-09-19 00:00:00
 * }
 */

function onRequest(request, response, modules) {
  var userId = request.body.userId;
  if(userId && userId.length > 0) {
    // 获取数据库对象
    var db = modules.oData;
    db.find({
      "table":"VIP",
      "where":{"userId":userId},
    }, function(err, data) {
      if(err) {
        response.send('not invalid user object id');
      } else {
        var vipInfo = JSON.parse(data);
        if(vipInfo.results && vipInfo.results.length > 0) {
          response.send(vipInfo.results[0].expires);
        } else {
          response.send(-1);
        }
      }
    });
  } else {
    response.send('not invalid user object id');
  }
}