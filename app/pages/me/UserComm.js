/**
 * Created by free on 24/02/2017.
 *
 * 用户信息和后台交互
 */

import {DeviceEventEmitter} from 'react-native';

import {
  DeviceStorage,
  Consts,
  log,
} from '../../header';

export default UserComm = {

  /**
   * 账号密码登陆
   * @param account
   * @param pwd
   * @param callback
   */
  accountLogin(account, pwd, callback) {
    let url = '?username=' + account + '&password=' +pwd;
    log('UserComm accountLogin url=', url);
    fetch(Consts.BMOB_API_URL + 'login' + url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
    }).then((response) => {
      log('UserComm accountLogin response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('UserComm accountLogin err', error);
    });
  },

  /**
   * 注册账号
   * @param account
   * @param pwd
   * @param nickname
   * @param callback
   */
  register(account, pwd, callback) {
    fetch(Consts.BMOB_API_URL + 'users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
      body: JSON.stringify({
        username:account,
        password:pwd,
      })
    }).then((response) => {
      log('UserComm register response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('UserComm register err', error);
    });
  },

  /**
   * qq三方登陆 response.status 200 old user, 201 new user
   * @param userInfo
   * @param callback(err, response)
   */
  qqlogin(userInfo, callback){
    fetch(Consts.BMOB_API_URL + 'users', {
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
    }).then((response) => {
      log('UserComm qqlogin response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('UserComm qqlogin err', error);
    });
  },

  /**
   * 更新用户信息，完成后通知UI更新
   * @param params 需要更新的字段
   */
  updateUserInfo(params) {
    log('UserComm updateUserInfo', ', params', params);

    DeviceStorage.get(Consts.ACCOUNT_USERINFO_KEY).then(function (userInfo) {
      // 保存到服务器
      fetch(Consts.BMOB_API_URL + 'users/' + userInfo.objectId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
          'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
          'X-Bmob-Session-Token': userInfo.sessionToken,
        },
        body: JSON.stringify(params)
      }).then(function (rsp) {
        log('UserComm updateUserInfo rsp', rsp);
        // 保存服务器成功，通知UI
        DeviceEventEmitter.emit(Consts.EMMIT_ACCOUNT_CHANGED);
      }).catch(function (err) {
        log('UserComm err', err);
      });
    });
  },

  /**
   * 请求验证码
   * @param phoneNumber
   * @param callback
   */
  requestSms(phoneNumber, callback) {
    log('UserComm requestSms', phoneNumber);
    fetch(Consts.BMOB_API_URL + 'requestSms', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
      body: JSON.stringify({
        mobilePhoneNumber:phoneNumber,
        content:'欢迎登陆量子选股，您的验证码是：',
      })
    }).then((response) => {
      log('UserComm phoneLogin qqlogin response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('UserComm phoneLogin qqlogin err', error);
    });
  },

  /**
   * 手机号验证码登陆
   * @param phoneNumber
   * @param smsCode
   * @param callback
   */
  phoneLogin(phoneNumber, smsCode, callback) {
    log('UserComm phoneLogin', phoneNumber, smsCode);
    fetch(Consts.BMOB_API_URL + 'users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Bmob-Application-Id':Consts.BMOB_APP_ID,
        'X-Bmob-REST-API-Key':Consts.BMOB_APP_KEY,
      },
      body: JSON.stringify({
        mobilePhoneNumber:phoneNumber,
        smsCode:smsCode,
      })
    }).then((response) => {
      log('UserComm phoneLogin qqlogin response', response);
      callback(null, response);
    }).catch((error) => {
      callback(error, null);
      log('UserComm phoneLogin qqlogin err', error);
    });
  },
}
