/**
 * Created by free on 24/02/2017.
 *
 * 用户信息和后台交互
 *
 * 用户快速参考
 URL	            HTTP	功能
 /1/users	        POST	用户注册、使用手机号注册登录、第三方注册登录
 /1/login	        GET	登录
 /1/users/objectId	GET	获取当前用户、查询用户
 /1/users/objectId	PUT	更新用户、第三方连接及断开连接
 /1/users/objectId	DELETE	删除用户
 /1/requestPasswordReset	POST	密码重置
 /1/resetPasswordBySmsCode/smsCode	PUT	短信密码重置
 /1/updateUserPassword/objectId	POST	旧密码更新密码
 /1/requestEmailVerify	POST	邮箱验证
 */

import {
  DeviceStorage,
  Consts,
  log,
} from '../../header';

export default UserComm = {

  /**
   * qq三方登陆
   * @param userInfo
   * @param callback(err, response)
   */
  qqlogin(userInfo, callback){
    fetch(Consts.BMOB_API_URL + '/1/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
      body: JSON.stringify({
        "authData": {
          "qq": {
            "openid": userInfo.openid,
            "access_token": userInfo.access_token,
            "expires_in": userInfo.expires_in
          }
        }
      })
    }).then((response) => response.json()).then((responseJson) => {
      log(responseJson);
      callback(null, responseJson);
    }).catch((error) => {
      callback(error, null);
      log(error);
    });
  },

  getUserInfo(callback) {

  },

  saveUserInfo() {
    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      fetch(Consts.BMOB_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstParam: 'yourValue',
          secondParam: 'yourOtherValue',
        })
      })
    });
  },
}
