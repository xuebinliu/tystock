/**
 * Created by free on 8/20/16.
 *
 * 全局样式定义
 */

import {StyleSheet, Platform} from 'react-native';


export default gstyles = StyleSheet.create({

  // all page container
  container:{
    flex:1,
    backgroundColor:'white',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },

  // page content
  content:{
    flex:1,
    marginTop:44,
    backgroundColor:'#ececec',
  },

  // list item
  listItem:{
    backgroundColor:'#f6f6f6',
  },

  input: {
    height: 60,
    marginHorizontal:15,
    color:'#777',
  },

  // divider line with margin
  line:{
    height:1,
    backgroundColor:'#dddddd',
    marginLeft:8,
    marginRight:8,
  },

  // no margin divider line
  noMarginline:{
    height:1,
    backgroundColor:'#dddddd',
  },

  // 长按钮
  button:{
    marginHorizontal:30,
    height:40,
    borderRadius:3,
    backgroundColor:'forestgreen',
    justifyContent:'center',
    alignItems:'center',
  },

  // 文字颜色
  text:{
    color:'#595959',
  },

});
