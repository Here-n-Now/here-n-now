'use strict';
import React from 'react';
import { View, Image } from 'react-native';
import { Container } from 'native-base';
import styles from '../style/app';

const ViewImage = (props) => {
  return (
    <View>
      <Image source={{uri: props.image}} style={styles.backgroundImage} />
    </View>
  );
};

export default ViewImage;
