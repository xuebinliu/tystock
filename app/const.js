/**
 * Created by free on 8/17/16.
 * 常量定义
 */

// 获取QQ登陆信息
// var url = "https://graph.qq.com/user/get_user_info?access_token=" + accessToken + "&oauth_consumer_key=" + QQ_APP_ID + "&openid=" + userId;
// http.get(url)

// bomb后台地址

export const BMOB_API_URL = 'https://api.bmob.cn/1/';
export const BMOB_APP_ID = '1d805f53912ab96361b2c5447aef4301';
export const BMOB_APP_KEY = '32b3cd7fbb113923039d2c62bedb780c';

/*------------------ 账号相关 key ------------------*/
// 账号信息
export const ACCOUNT_USERINFO_KEY  = 'ACCOUNT_USERINFO_KEY';


/*------------------ 事件订阅 key ------------------*/
// 账号信息发生变化
export const EMMIT_ACCOUNT_CHANGED = 'EMMIT_ACCOUNT_CHANGED';

/*------------------ 颜色 ------------------*/
export const COLOR_MAIN = '#fd7736';        // 橘红色，主色调
export const COLOR_TEXT_LINK = '#106fbc';   // 文字主色 链接
export const COLOR_TEXT = '#252525';        // 文字主色
export const COLOR_TEXT_80 = '#252525cc';   // 文字主色 80% a
export const COLOR_TEXT_60 = '#25252599';   // 文字主色 60% a

// 图标名称
export const IC_NAV_BACK  = 'md-arrow-back';      // 后退
export const IC_NAV_CHECK = 'md-checkmark';       // 确认


// storage key
export const SK_CURR_CITY = "SK_CURR_CITY";       // 用户选择的当前城市


// 百度地图API, IP--》地址
export const BD_MAP_IP_URL = 'http://api.map.baidu.com/location/ip?ak=ES9weBsE8p7y2cstEo2AqBvpa59DQ5qy&coor=bd09ll';

