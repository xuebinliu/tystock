import { DeviceEventEmitter } from 'react-native';

export default loaderHandler = {
  hideLoader () {
    DeviceEventEmitter.emit('changeLoadingEffect', {isVisible: false});
  },
  showLoader (title) {
    DeviceEventEmitter.emit('changeLoadingEffect', {title:title, isVisible: true});
  }
};