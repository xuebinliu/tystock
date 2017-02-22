/**
 * Created by free on 11/8/16.
 *
 * 相册容器
 */
import React from 'react';
import{
  View,
  ListView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AV from 'leancloud-storage';
import AlbumSetting from './AlbumSetting';
import Album from './Album';


// 相册大小（正方形）,根据屏幕宽度计算
const IMAGE_SIZE = (Dimensions.get('screen').width - 20*4)/2;

// 用户对象
let currentUser;
// 当前相册对象       {id, content{id,index,coverage_url,name,power,image_urls[...]}}
let currentAlbumObj;

// 数据源
const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

/**
 * 可以查看自己的相册和他人的相册，只有查看自己的相册时，可以添加新相册
 *
 * 传入：route.currentUser
 */
export default class AlbumContainer extends React.Component {
  constructor(props){
    super(props);

    const {route} = this.props;
    currentUser = route.currentUser;

    this.state = {
      content:this.getListItemData([]),
    };
  }

  componentDidMount() {
    setTimeout(()=>this.loadAlbums(), 200);
  }

  // 重新加载相册数据
  loadAlbums() {
    const that = this;
    let album_id = currentUser.get('album_id');

    console.log('loadAlbums album_id', album_id);

    if(album_id) {
      // 相册存在，获取相册
      let query = new AV.Query('Albums');
      query.get(album_id).then(function (albumObj) {
        currentAlbumObj = albumObj;
        let content = currentAlbumObj.get('content');
        console.log('loadAlbums get albumObj content', content);
        if(content) {
          that.setState({
            content:that.getListItemData(content)
          });
        }
      }, function (error) {
        console.log('loadAlbums: get album error', album_id, error);
      });
    } else {
      // 相册不存在，相册对象Albums，并创建一个空相册放入content中
      let Albums = AV.Object.extend('Albums');
      let albumObj = new Albums();
      albumObj.set('content', []);
      albumObj.save().then(function (albumObj) {
        currentAlbumObj = albumObj;
        // 保存相册id到user中
        AV.User.current().set('album_id', currentAlbumObj.id);
        AV.User.current().save();
      }, function (error) {
        console.log('save album errro', error);
      });
    }
  }

  /**
   * 生成listview数据源
   * @param content
   * @return {ListViewDataSource}
   */
  getListItemData(content) {
    // 复制相册数据
    let tempContent = content.slice(0);

    if(AV.User.current()) {
      if(AV.User.current().getUsername() == currentUser.getUsername()) {
        // 查看自己 增加添加相册按钮
        tempContent.unshift({addBtn:true});
      }
    }

    return dataSource.cloneWithRows(tempContent);
  }

  onBackHandle=()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  /**
   * 点击添加相册
   */
  onAddAlbum= ()=>{
    const {navigator} = this.props;
    navigator.push({
      component:AlbumSetting,
      settingData:null,
      albumSettingChange:this.albumSettingChange,
    });
  };

  /**
   * 点击打开相册
   * @param itemData
   */
  openAlbum= (itemData)=>{
    console.log('openAlbum itemData=', itemData);

    const {navigator} = this.props;
    navigator.push({
      component:Album,
      settingData:itemData,
      currentUser:currentUser,
      albumSettingChange:this.albumSettingChange,
    });

  };

  /**
   * 获取相册权限提示文字
   * @param power
   * @returns {*}
   */
  getAlbumPower= (power)=> {
    if(power == 0) {
      return '不限制访问';
    } else if(power == 1) {
      return '付费访问';
    } else if(power == 2) {
      return '禁止其他人访问';
    } else {
      return '未知';
    }
  };

  renderRow= (itemData, sectionId, rowId)=>{
    console.log('renderRow', itemData, sectionId, rowId);
    if(itemData.addBtn == true) {
      // 渲染加号按钮
      return (
          <TouchableOpacity onPress={this.onAddAlbum} style={styles.addBtn}>
            <Ionicons name={"ios-add-outline"} size={60} color="blue" />
            <Text style={{color:'blue'}}>添加相册</Text>
          </TouchableOpacity>
      );
    } else {
      // itemPower(照片个数+权限)
      let power = '';
      if(itemData.image_urls){
        power = itemData.image_urls.length + '张 ' + this.getAlbumPower(itemData.power);
      } else {
        power = '0张 ' + this.getAlbumPower(itemData.power);
      }

      return(
          <TouchableOpacity onPress={()=>{this.openAlbum(itemData)}} style={styles.itemView}>
            {this.renderItemImage(itemData)}
            <Text style={styles.itemName}>{itemData.name}</Text>
            <Text style={styles.itemPower}>{power}</Text>
          </TouchableOpacity>
      );
    }
  };

  /**
   * 渲染相册封面
   * @param itemData
   * @returns {XML}
   */
  renderItemImage= (itemData)=>{
    if(itemData.coverage_url){
      return (<Image resizeMode='stretch' style={styles.itemImage} source={{uri:itemData.coverage_url}}/>);
    } else {
      return (<Image resizeMode='stretch' style={styles.itemImage} source={require('../../img/default_image.png')}/>);
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'相册'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <View style={gstyles.content}>
            <ListView
                dataSource={this.state.content}
                renderRow={this.renderRow}
                enableEmptySections={true}
                contentContainerStyle={{flexDirection:'row', flexWrap:'wrap'}}
            />
          </View>
        </View>
    );
  }

  /**
   * 修改相册
   * @param albumSetting
   * @param isDel 是否删除
   */
  albumSettingChange= (albumSetting, isDel)=>{
    console.log('AlbumContainer albumSettingChange albumSetting', albumSetting);

    // 相册已存在则覆盖修改的值，不存在则添加
    let content = currentAlbumObj.get('content');
    let index = -1;
    for(let i=0; i<content.length; i++) {
      if(content[i].id == albumSetting.id) {
        index = i;
        break;
      }
    }

    if(isDel){
      // 需要删除
      content.splice(index, 1);
    } else {
      if(index == -1) {
        // 没找到则插入
        content.push(albumSetting);
      } else {
        // 找到了，则修改其值
        content[index].name = albumSetting.name;
        content[index].power = albumSetting.power;
        content[index].image_urls = albumSetting.image_urls;
        content[index].coverage_url = albumSetting.coverage_url;
      }
    }

    // save to server
    const that = this;
    currentAlbumObj.set('content', content);
    currentAlbumObj.save().then(function (albumObj) {
      currentAlbumObj = albumObj;
      console.log('albumSettingChange save currentAlbumObj success', albumObj);
      // update ui
      that.loadAlbums();
    }, function (error) {
      console.log('albumSettingChange save currentAlbumObj error', error);
    });
  };
}

const styles = StyleSheet.create({
  addBtn:{
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
    backgroundColor:"#ffffff",
    borderWidth:1,
    borderColor:'#dddddd',
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:20,
    marginVertical:5,
  },

  itemView:{
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    width:IMAGE_SIZE,
    height:IMAGE_SIZE + 40,
    backgroundColor:"#ececec",
    marginHorizontal:20,
    marginVertical:5,
  },

  itemImage:{
    alignSelf:'center',
    width:IMAGE_SIZE,
    height:IMAGE_SIZE,
  },

  itemName:{
    fontSize:15,
    color:'black',
  },

  itemPower:{
    fontSize:12,
  }

});