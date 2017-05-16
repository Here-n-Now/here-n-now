import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import styles from '../style/app';

export default PictureButton = (props) => {
  return (
    <TouchableOpacity
        style={styles.captureButton}
        onPress={props.takePicture}
    >
      <Image
          source={require('../../public/assets/ic_photo_camera_36pt.png')}
      />
    </TouchableOpacity>
  );
};
