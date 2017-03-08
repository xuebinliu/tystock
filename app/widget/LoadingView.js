import React from 'react';
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View
} from 'react-native';

export default class LoadingView extends React.Component{
  render(){
    return(
      <View style={styles.loading}>
        <ActivityIndicator
            size="large"
            color="#3e9ce9"/>
        <Text style={styles.loadingText}>{this.props.text ? this.props.text : '数据加载中...'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center'
  }
});
