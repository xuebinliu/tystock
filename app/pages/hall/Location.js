/**
 * Created by free on 8/24/16.
 *
 * 位置信息, 选择用户当前的城市
 */
import React from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import {
    toastShort,
    NavigationBar,
    gstyles,
    DeviceStorage,
    LoadingView,
    CommonUtil,
} from '../../header';

import * as Const from '../../const';

export default class Location extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading:true,
    };
  }

  componentDidMount() {
    const that = this;
    // 延迟加载避免卡顿
    setTimeout(function () {
      CommonUtil.getCityList().then(function (cities) {
        let ds = new ListView.DataSource({
          rowHasChanged:(r1, r2)=> r1 !== r2,
          sectionHeaderHasChanged:(s1, s2)=> s1!== s2,
        });

        // 数据加载完成
        that.setState({
          isFirstLoading:false,
          dataSource : ds.cloneWithRowsAndSections(cities)
        });
      }, function (error) {
        console.log('Location getCityList err', error);
      });
    }, 500);
  }

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return CommonUtil.naviGoBack(navigator);
  };

  onPressRow= (rowData)=> {
    // save to storage
    DeviceStorage.save(Const.SK_CURR_CITY, rowData);

    // refresh ui
    const {route} = this.props;
    route.cbRefreshCity();

    toastShort('已切换到 '+rowData);

    this.onBackHandle()
  };

  renderRow= (rowData, sectionId, rowId)=> {
    return (
      <TouchableHighlight
          key={`${sectionId}-${rowId}`}
          style={styles.listItemContainer}
          underlayColor='rgba(24,36,35,0.1)'
          onPress={() => this.onPressRow(rowData)}>

        <Text style={styles.listItemText}>{rowData}</Text>

      </TouchableHighlight>
    );
  };

  renderSeparator= (sectionId, rowId, adjacentRowHighlighted)=> {
    return (
        <View key={`${sectionId}-${rowId}`} style={gstyles.line}></View>
    );
  };

  renderSectionHeader= (sectionData, sectionId)=> {
    return (
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderText}>{sectionId}</Text>
      </View>
    );
  };

  renderListView() {
    if(this.state.isFirstLoading) {
      return (<LoadingView/>);
    } else {
      return (
        <ListView
            initialListSize={20}
            pageSize={30}
            dataSource={this.state.dataSource}
            renderSectionHeader={this.renderSectionHeader}
            renderSeparator={this.renderSeparator}
            renderRow={this.renderRow}/>
      );
    }
  }

  render(){
    return(
        <View style={gstyles.container}>
          <NavigationBar
              title={'选择城市'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <View style={gstyles.content}>
          {this.renderListView()}
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer:{
    marginHorizontal:8,
  },
  listItemText:{
    marginVertical:8,
    fontSize:14
  },
  listHeaderContainer:{
    flex:1,
    height:30,
    backgroundColor:'whitesmoke',
    justifyContent:'center',
    alignItems:'center'
  },
  listHeaderText:{
    fontSize:16,
    fontWeight:'bold'
  },

});
