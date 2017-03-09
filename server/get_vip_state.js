/**
 * Created by free on 09/03/2017.
 *
 * 获取vip状态，获取时机：
 * 1）每次启动获取一次
 * 2）支付完成获取一次
 *
 * vip状态保存在全局变量里面
 *
 * 请求参数
 * request: {
 *  userId : xxx,
 * }
 *
 * 返回
 * response: {
 *  isVip:  true/false,
 *  deadline: 2017-09-19 00:00:00
 * }
 */

function onRequest(request, response, modules) {
  var userId = request.body.userId;

  // 获取数据库对象
  var db = modules.oData;
  db.find({
    "table":"Order",
    "where":{"userId":userId},
  }, function(err, data) {
    response.send(data);
  });

}