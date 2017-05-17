'use strict';
import React from 'react';
import { View, Image } from 'react-native';
import Spin from './../Spin';
import styles from '../style/app';

const ViewImage = (props) => {
  console.log('image container', props.image)
  return (
    <View>
      <Image source={{uri: props.image}} style={styles.backgroundImage} />
    </View>
  );
};

export default ViewImage;
