/**
 * Created by free on 8/30/16.
 */

import React from 'react';
import{
    View,
    TextInput,
} from 'react-native';

import {
    gstyles,
    NavigationBar,
    naviGoBack,
    toastShort,
} from '../../header';

let feedbackContent;

export default class Feedback extends React.Component {

  componentDidMount() {
    feedbackContent = '';
  }

  onBackHandle= ()=> {
    const {navigator} = this.props;
    return naviGoBack(navigator);
  };

  onFeedback= ()=> {
    const feedback = AV.Object.new('Feedback');

    // feedback.set('account', DeviceStorage.get(SK_ACCOUNT_INFO));
    feedback.set('content', feedbackContent);
    // feedback.set('manufacturer', DeviceInfo.getManufacturer());
    // feedback.set('system', DeviceInfo.getSystemName());
    // feedback.set('deviceVersion', DeviceInfo.getSystemVersion());
    // feedback.set('deviceModel', DeviceInfo.getModel());
    // feedback.set('appVersion', DeviceInfo.getVersion());

    const that = this;
    feedback.save().then(function (success) {
      toastShort('您的反馈已成功提交');
      that.onBackHandle();
    }, function (error) {
      toastShort('提交失败');
    });
  };

  render() {
    return (
        <View style={gstyles.container}>
          <NavigationBar
              title={'建议反馈'}
              leftButtonIcon="md-arrow-back"
              onLeftButtonPress={this.onBackHandle}
              rightButtonTitle={'提交'}
              onRightButtonPress={this.onFeedback}
              rightButtonTitleColor={'white'}
          />

          <View style={gstyles.content}>
            <TextInput
                style={{flex:1, fontSize: 18, padding: 15, textAlignVertical: 'top' }}
                placeholder="请写下您宝贵的意见或建议"
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                numberOfLines={200}
                multiline={true}
                autoFocus={true}
                onChangeText={(text) => feedbackContent=text}
            />
          </View>
        </View>
    );
  }
}