/**
 * Created by free on 01/03/2017.
 */


import * as QQ from "react-native-qqsdk";

export default class QQLogin  {

  static isInstall() {
    return QQ.isQQClientInstalled();
  }

  static login() {
    return QQ.ssoLogin();
  }

  static logout() {
    return QQ.logout();
  }
};