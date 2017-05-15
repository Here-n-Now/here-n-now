import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ListView, Image} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import config from "./config/app.js";
import styles from "./style/fullScreenVideo.js";

export default class FullScreenVideo extends Component{

  constructor(props) {
    super(props);
    this.state = {
      stream: undefined
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({stream: this.props.stream}), 1000)
  }

  render() {
    console.log('fullscreen', this.state.stream)
    return <View style={styles.container}>
      {
        config.useRCTView ?
        <RTCView streamURL={this.state.stream} style={styles.video} />
        :
        <Image source={this.state.stream} style={styles.video} resizeMode={"contain"} />
      }
    </View>
  }
}
