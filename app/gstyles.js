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
    backgroundColor:'#ececec',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },

  // page content
  content:{
    flex:1,
    marginTop:44,
    backgroundColor:'#f0f0f0',
  },

  // page content
  contentMargin:{
    flex:1,
    marginTop:52,
    backgroundColor:'#f0f0f0',
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
    backgroundColor:'#e4e4e4',
    marginLeft:8,
    marginRight:8,
  },

  // no margin divider line
  noMarginline:{
    height:1,
    backgroundColor:'#e4e4e4',
  },

  // 长按钮
  button:{
    marginHorizontal:30,
    height:40,
    borderRadius:3,
    backgroundColor:'#fd7736',
    justifyContent:'center',
    alignItems:'center',
  },

  // 文字颜色
  text:{
    color:'#595959',
  },

});
