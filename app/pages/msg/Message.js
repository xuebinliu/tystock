/**
 * Created by free on 8/16/16.
 *
 * 私信页面
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

import {
  BaseListViewComponent,
} from '../../header';

import AV from 'leancloud-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

let talkCacheMap = new Map();

export default class Message extends BaseListViewComponent {

  componentDidMount(){
    this.loadData();
  }

  onPullRefresh= ()=>{
    this.loadData();
  };

  /**
   * 从服务器获取列表数据
   * @param index 其实位置
   */
  loadData= ()=>{
    console.log('Message loadData start');

    const that = this;
    AV.User.currentAsync().then(function (currentUser) {
      console.log('Message get currentUser id', currentUser.id);
      NativeModules.ReactProxy.getChatLocalList(currentUser.id, function (dataList) {
        if(dataList) {
          for(let i=0; i<dataList.length; i++) {
            let conversation = dataList[i];
            console.log('Message getChatLocalList conversationId=', conversation.conversationId);
            if(!talkCacheMap.has(conversation.conversationId)) {
              talkCacheMap.set(conversation.conversationId, conversation);
            } else {
              let tmp = talkCacheMap.get(conversation.conversationId);
              tmp.lastMessage = conversation.lastMessage;
              tmp.lastMessageTime = conversation.lastMessageTime;
              tmp.unreadCount = conversation.unreadCount;
            }
          }
        }

        // update list
        let listData = [];
        for(let v of talkCacheMap.values()) {
          listData.push(v);

          // fetch name and avatar
          that.getChatName(v.conversationId);
          that.getChatAvatar(v.conversationId);
        }

        that.updateData(listData);
      });
    });
  };

  getChatName= (conversationId)=>{
    const that = this;
    NativeModules.ReactProxy.getConversationName(conversationId, function (conversationId, name) {
      console.log('Message getChatName', name);
      if(talkCacheMap.has(conversationId)) {
        let conversation = talkCacheMap.get(conversationId);
        if(conversation.name != name) {
          conversation.name = name;
          talkCacheMap.set(conversationId, conversation);

          // update list
          let listData = [];
          for(let v of talkCacheMap.values()) {
            listData.push(v);
          }
          that.updateData(listData);
        }
      }
    });
  };

  getChatAvatar= (conversationId)=>{
    const that = this;
    NativeModules.ReactProxy.getConversationAvatarUrl(conversationId, function (conversationId, avatar_url) {
      console.log('Message getChatAvatar', avatar_url);
      if(talkCacheMap.has(conversationId)) {
        let conversation = talkCacheMap.get(conversationId);
        if(conversation.avatar_url != avatar_url) {
          conversation.avatar_url = avatar_url;
          talkCacheMap.set(conversationId, conversation);

          // update list
          let listData = [];
          for(let v of talkCacheMap.values()) {
            listData.push(v);
          }
          that.updateData(listData);
        }
      }
    });
  };

  onPressRow= (rowData)=>{
    NativeModules.ReactProxy.openHistoryChat(rowData.conversationId);
  };

  renderAvatar= (rowData)=>{
    if(rowData.avatar_url) {
      return (
        <Image style={styles.avatar}
               resizeMode="stretch"
               source={{uri:rowData.avatar_url}}/>
      );
    } else {
      return (
          <Ionicons name={"md-contact"} size={60} color="coral" style={styles.avatar}/>
      );
    }
  };

  renderRow= (rowData, sectionID, rowID)=>{
    return (
        <TouchableOpacity onPress={()=>this.onPressRow(rowData)}>
          <View style={{flex:1, flexDirection:'row', height:80, alignItems:'center'}}>
            {this.renderAvatar(rowData)}
            <View style={{flex:1}}>
              <Text>{rowData.name ? rowData.name : ''}</Text>
              <Text>{rowData.lastMessage ? rowData.lastMessage : ''}</Text>
            </View>
            <Ionicons name="ios-arrow-forward" size={20} color="gray" style={{marginHorizontal:10}}/>
          </View>
        </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  avatar:{
    width:60,
    height:60,
    margin:10,
    borderRadius:30,
    alignSelf:'center'
  }
});