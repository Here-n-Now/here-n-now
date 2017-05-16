import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import styles from '../style/app';

export default LiveButton = (props) => {
  return (
    <TouchableOpacity
        style={styles.liveCaptureButton}
        onPress={props.startLive}
    >
      <Icon name='ios-radio-outline' />
    </TouchableOpacity>
  );
};
