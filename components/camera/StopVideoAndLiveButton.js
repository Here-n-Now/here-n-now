import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import styles from '../style/app';

export default StopVideoAndLiveButton = (props) => {
  return (
    <TouchableOpacity
        style={styles.captureButton}
        onPress={props.isLive ? props.stopLive : props.stopRecording}
    >
      <Image
          source={require('../../public/assets/ic_stop_36pt.png')}
      />
    </TouchableOpacity>
  );
};
