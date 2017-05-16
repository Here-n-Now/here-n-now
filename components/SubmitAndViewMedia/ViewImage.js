'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, AlertIOS, Image } from 'react-native';
import { Icon, Header, Left, Toast, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab, Footer } from 'native-base';
import styles from '../style/app';

export default class PostPic extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { image } = this.props
    return (
      <Container>
        <Image source={{uri: image}} style={styles.backgroundImage} />
      </Container>
    )
  }
}
