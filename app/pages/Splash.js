/**
 * Created by free on 8/16/16.
 * 闪屏
 */
import React from 'react';
import {
    Dimensions,
    Image,
    View,
} from 'react-native';

import Main from './Main';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {navigator} = this.props;
    this.timer = setTimeout(()=> {
      navigator.resetTo({
        component: Main,
      });
    }, 1000);
  }

  componentWillUnmount() {
    if(this.timer){
      clearTimeout(this.timer);
    }
  }

  render() {
    let {height, width} = Dimensions.get('window');
    return (
        <View style={{flex:1}}>
          <Image
              style={{width:width,height:height}}
              resizeMode={'stretch'}
              source={require('../img/ic_welcome.jpg')}
          />
        </View>
    );
  }
}
