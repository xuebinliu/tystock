/**
 * Created by free on 8/16/16.
 */
import DeviceStorage from './Storage';

import {BD_MAP_IP_URL, SK_CURR_CITY} from '../const';

/**
 * 获取QQ用户头像昵称
 * @param openid
 * @param access_token
 * @param callback
 */
export function getQQAvatarAndNickname(openid, access_token, callback) {
  fetch("https://graph.qq.com/user/get_user_info?access_token=" + access_token +
      "&oauth_consumer_key=1106004972&openid=" + openid, {
    method:'GET',
    headers: {
      'Accept': 'application/json',
    },
  }).then(function (data) {
    data.json().then(function (rsp) {
      callback(rsp);
      /*{
      // 返回结构体
          ret: 0,
          msg: '',
          is_lost: 0,
          nickname: 'Free',
          gender: '男',
          province: '湖北',
          city: '武汉',
          year: '1983',
          figureurl: 'http://qzapp.qlogo.cn/qzapp/1106004972/517847405C7A5AEFE0B6EF439A492EA9/30',
          figureurl_1: 'http://qzapp.qlogo.cn/qzapp/1106004972/517847405C7A5AEFE0B6EF439A492EA9/50',
          figureurl_2: 'http://qzapp.qlogo.cn/qzapp/1106004972/517847405C7A5AEFE0B6EF439A492EA9/100',
          figureurl_qq_1: 'http://q.qlogo.cn/qqapp/1106004972/517847405C7A5AEFE0B6EF439A492EA9/40',
          figureurl_qq_2: 'http://q.qlogo.cn/qqapp/1106004972/517847405C7A5AEFE0B6EF439A492EA9/100',
          is_yellow_vip: '0',
          vip: '0',
          yellow_vip_level: '0',
          level: '0',
          is_yellow_year_vip: '0'
        }*/
    });
  }).catch(function (err) {
    console.log('getQQAvatarAndNickname', err);
  });
}

export function naviGoBack(navigator) {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop();
    return true;
  }
  return false;
}

// 根据当前IP获取所在城市
export async function getCurrentCity() {
  try {
    let city = await DeviceStorage.get(SK_CURR_CITY);
    if(city){
      console.log('getCurrentCity from cache', city);
      return city;
    } else {
      let response = await fetch(BD_MAP_IP_URL);
      let json = await response.json();
      let city = json.content.address_detail.city;

      city = city.replace('市','');

      // 存储
      DeviceStorage.save(SK_CURR_CITY, city);
      console.log('getCurrentCity from baidu', city);
      return city;
    }
  } catch (error) {
    return '未知';
  }
}

// 获取城市列表,包含了当前用户所在城市
export function getCityList() {
  return new Promise(function (resolve, reject) {
    getCurrentCity().then((city)=>{
      CITIES.当前[0]=city;
      resolve(CITIES);
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * 获取可读的用户名，查不到昵称就用账号
 * @param userInfo
 */
export function getUserNickName(userInfo) {
  if(!userInfo) {
    return '未登录';
  }

  if(userInfo.nickname) return userInfo.nickname;

  if(userInfo.username) return userInfo.username;

  return '未设置';
}

/**
 * 给服务器上传文件
 * @param file {uri: image.path, type: 'multipart/form-data', name: 'avatar.png'};
 * @param callback
 */
export function uploadFile2Server(file, callback) {
  fetch('http://192.168.0.183:8080/whale/test/upload_files', {
    method:'POST',
    headers:{
      'Content-Type':'multipart/form-data',
    },
    body:file,
  }).then((response) => {
    response.text();
  }).then((responseData)=>{
    console.log('responseData',responseData);
    callback(responseData);
  }).catch((error)=>{
    console.error('error',error);
    callback();
  });
}

export function getProductInfo(number) {
  let info;
  if(number == 1) {
    info = '量子VIP(1个月)';
  } else if(number == 3) {
    info = '量子VIP(3个月)';
  } else if(number == 6) {
    info = '量子VIP(6个月)';
  } else if(number == 12) {
    info = '量子VIP(12个月)';
  } else {
    info = '量子VIP(1个月)';
  }
  return info;
}

export function getPrice(number) {
  let price;
  if(number == 1) {
    price = 300;
  } else if(number == 3) {
    price = 810;
  } else if(number == 6) {
    price = 1530;
  } else if(number == 12) {
    price = 2880;
  } else {
    price = 300;
  }
  return price;
}