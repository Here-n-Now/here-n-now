import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import styles from '../style/app';

export default VideoButton = (props) => {
  return (
    <TouchableOpacity
        style={styles.captureButton}
        onPress={props.startRecording}
    >
      <Image
          source={require('../../public/assets/ic_videocam_36pt.png')}
      />
    </TouchableOpacity>
  );
};
