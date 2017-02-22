/**
 * Created by free on 14/02/2017.
 * 没有数据的空界面
 */
import React from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class EmptyView extends React.Component {
  render() {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:16}}>
            {this.props.message}
          </Text>
        </View>
    );
  }
}