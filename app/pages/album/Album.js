/**
 * Created by free on 11/8/16.
 *
 * 一个相册
 */

import React from 'react';
import{
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ListView,
  NativeModules,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
  loaderHandler,
} from '../../header';

import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AlbumSetting from './AlbumSetting';
import PreviewImage from './PreviewImage';

// 照片间距
const IMAGE_MARGIN = 5;
// 相册大小（正方形）,根据屏幕宽度计算
let imageSize = (Dimensions.get('screen').width - IMAGE_MARGIN*6)/3;

const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

// 用户对象
let currentUser;
// 相册相关数据
let settingData;

export default class Album extends React.Component {
  constructor(props){
    super(props);

    const {route} = this.props;
    currentUser = route.currentUser;

    settingData = route.settingData;
    if(!settingData.image_urls){
      settingData.image_urls = [];
    }

    this.state = {
      items:this.getListItemData(settingData.image_urls),
    };
  }

  getListItemData(content) {
    let tmpContent = content.slice(0);
    if(AV.User.current() && AV.User.current().getUsername() == currentUser.getUsername()) {
      tmpContent.unshift({addBtn:true});
    }
    return dataSource.cloneWithRows(tmpContent);
  }

  onBackHandle=()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  /**
   * 修改相册参数回调函数
   * @param settingData
   * @param isDel
   */
  albumSettingChange= (settingData, isDel)=>{
    const {route} = this.props;
    route.albumSettingChange(settingData, isDel);

    // 如果删除相册，则直接返回上级页面
    if(isDel) {
      this.onBackHandle();
    }
  };

  /**
   * 打开相册设置
   */
  onAlbumSetting= ()=>{
    const {navigator, route} = this.props;
    navigator.push({
      component:AlbumSetting,
      settingData:route.settingData,
      albumSettingChange:this.albumSettingChange,
    });
  };

  onAddPicture= ()=>{
    const that = this;

    ImagePicker.openPicker({
      multiple:true,
      maxFiles:10
    }).then((images)=>{
      console.log('onAddPicture', images);

      // 上传前，显示加载框
      loaderHandler.showLoader('开始上传...');
      var completeCount = 0;
      for(let image of images) {
        // save to server via native
        console.log('start upload image path=', image.path);
        NativeModules.FileUpload.upload(image.path, function (error, url, thumbUrl) {
          console.log('complete upload image url=', url, image.path, thumbUrl);

          if(url && url.length > 0){
            // 记录上传的照片
            settingData.image_urls.unshift({url:url, thumbUrl:thumbUrl});
            settingData.coverage_url = thumbUrl;
            that.setState({
              items:that.getListItemData(settingData.image_urls)
            });

            that.albumSettingChange(settingData, false);

            console.log('save upload image url', url);
          }

          completeCount++;
          if(completeCount == images.length) {
            // 上传完成
            console.log('end upload images completeCount', completeCount);
            loaderHandler.hideLoader();
          }
        });
      }
    }).catch((e)=>{
    });
  };

  /**
   * 打开大图
   * @param rowData
   */
  onOpenPicture= (rowData)=>{
    console.log('renderRow rowData', rowData);

    let isOwn = false;
    if(AV.User.current() && AV.User.current().getUsername() == currentUser.getUsername()) {
      isOwn = true;
    }
    const {navigator} = this.props;
    navigator.push({
      component:PreviewImage,
      url:rowData.url,
      isOwnPicture:isOwn,
      deletePictureCallback:this.deletePictureCallback,
    });
  };

  // 查看大图时，删除照片回调函数
  deletePictureCallback= (url)=>{
    console.log('deletePictureCallback url', url);
    for(let i=0; i<settingData.image_urls.length; i++) {
      let image = settingData.image_urls[i];
      if(image.url == url) {
        settingData.image_urls.splice(i, 1);

        if(image.thumbUrl == settingData.coverage_url && settingData.image_urls[0].thumbUrl) {
          settingData.coverage_url = settingData.image_urls[0].thumbUrl;
          console.log('deletePictureCallback modify coverage_url', settingData.coverage_url);
        }

        console.log('deletePictureCallback find and delete image', image);

        // save to server
        this.albumSettingChange(settingData, false);

        // update ui
        this.setState({
          items:this.getListItemData(settingData.image_urls)
        });

        break;
      }
    }
    console.log('deletePictureCallback current image_urls', settingData.image_urls);
  };

  renderRow= (rowData, sectionId, rowId)=>{
    console.log('renderRow rowData', rowData, sectionId, rowId);

    if(rowData.addBtn == true) {
      return (
          // render add button
          <TouchableOpacity onPress={this.onAddPicture} style={styles.addBtn}>
            <Ionicons name={"ios-add-outline"} size={60} color="blue" />
          </TouchableOpacity>
      );
    } else {
      return (
          // render picture
          <TouchableOpacity onPress={()=>this.onOpenPicture(rowData)}>
            <Image style={styles.image} source={{uri:rowData.thumbUrl}} />
          </TouchableOpacity>
      );
    }
  };

  /**
   * 渲染导航栏，当前用户查看自己的相册时，导航栏显示'设置'功能
   * @returns {XML}
   */
  renderNavigator= ()=>{
    if(AV.User.current() && AV.User.current().getUsername() == currentUser.getUsername()) {
      return (<NavigationBar
          title={'相册'}
          leftButtonIcon="md-arrow-back"
          onLeftButtonPress={this.onBackHandle}
          rightButtonTitle='设置'
          onRightButtonPress={this.onAlbumSetting}
          rightButtonTitleColor={'white'}
      />);
    } else {
      return (<NavigationBar
          title={'相册'}
          leftButtonIcon="md-arrow-back"
          onLeftButtonPress={this.onBackHandle}
      />);
    }
  };

  render() {
    return (
        <View style={gstyles.container}>
          {this.renderNavigator()}
          <View style={gstyles.content}>
            <ListView
                contentContainerStyle={{flexDirection:'row', flexWrap:'wrap'}}
                dataSource={this.state.items}
                renderRow={this.renderRow}
                enableEmptySections={true}
                pageSize={3}
            />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  addBtn:{
    width:imageSize,
    height:imageSize,
    margin:IMAGE_MARGIN,
    backgroundColor:"#ffffff",
    borderWidth:1,
    borderColor:'#dddddd',
    justifyContent:'center',
    alignItems:'center',
  },

  image:{
    width:imageSize,
    height:imageSize,
    margin:IMAGE_MARGIN,
    justifyContent:'center',
    alignItems:'center',
  },
});