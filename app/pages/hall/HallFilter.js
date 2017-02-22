/**
 * Created by free on 12/27/16.
 */

import React from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  gstyles,
  NavigationBar,
  naviGoBack,
} from '../../header';

import Ionicons from 'react-native-vector-icons/Ionicons';


/**
 * 过滤条件
 * 性别：0女 1男 2不限
 */

let filterObj;
export default class HallFilter extends React.Component {

  constructor(props){
    super(props);

    const {route} = this.props;
    filterObj = route.filterObj;
  }

  onBackHandle= ()=>{
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onPressSexRadio= (index)=>{
    filterObj.sex = index;
    this.forceUpdate();
  };

  onPressHotRadio= (index)=>{
    filterObj.hot = index;
    this.forceUpdate();
  };

  onPressTimeRadio= (index)=>{
    filterObj.time = index;
    this.forceUpdate();
  };

  onPressComplete= ()=>{
    const {route} = this.props;
    route.cbFilterChange(filterObj);
    this.onBackHandle();
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'过滤'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
          />

          <ScrollView style={gstyles.content}>

            <Text style={styles.radioTitle}>性别:</Text>
            <TouchableOpacity onPress={()=>this.onPressSexRadio(0)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>只看女</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.sex == 0 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>
            <TouchableOpacity onPress={()=>this.onPressSexRadio(1)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>只看男</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.sex == 1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <Text style={styles.radioTitle}>热度:</Text>
            <TouchableOpacity onPress={()=>this.onPressHotRadio(0)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>最热排前面</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.hot == 0 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>
            <TouchableOpacity onPress={()=>this.onPressHotRadio(1)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>最冷排前面</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.hot == 1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <Text style={styles.radioTitle}>注册时间:</Text>
            <TouchableOpacity onPress={()=>this.onPressTimeRadio(0)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>最新排前面</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.time == 0 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>
            <TouchableOpacity onPress={()=>this.onPressTimeRadio(1)}>
              <View style={[gstyles.listItem, styles.radioContainer]}>
                <Text style={styles.radioText}>最老排前面</Text>
                <View style={{flex:1,flexDirection:'row-reverse'}}>
                  <Ionicons name={filterObj.time == 1 ? "ios-radio-button-on" : "ios-radio-button-off"} size={24} color="dimgray"/>
                </View>
              </View>
            </TouchableOpacity>
            <View style={gstyles.line}/>

            <TouchableOpacity onPress={this.onPressComplete} style={[gstyles.button, {marginVertical:30}]}>
              <Text style={{color:'white'}}>确定</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  radioTitle:{
    marginLeft:15,
    marginTop:15,
    marginBottom:5,
    fontSize:16,
  },

  radioContainer:{
    height:50,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:15,
  },

  radioText:{
    marginLeft:10,
    fontSize:15,
  },

});