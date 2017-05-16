import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '../style/app';

export default FlashButton = (props) => {
  return (
    <View style={[styles.overlayCam, styles.topOverlayCam]}>
      <TouchableOpacity
        style={styles.typeButtonCam}
        onPress={props.switchType}
      >
        <Image
          source={props.typeIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.flashButtonCam}
        onPress={props.switchFlash}
      >
        <Image
          source={props.flashIcon}
        />
      </TouchableOpacity>
    </View>
  );
};
