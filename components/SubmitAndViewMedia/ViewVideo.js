'use strict';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import styles from '../style/app'
import Video from 'react-native-video';

export default class SubmitVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      volume: 1,
      resizeMode: 'cover',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: false,
      skin: 'custom',
      ignoreSilentSwitch: null,
      isBuffering: false,
    };
  }

  onLoad = data => {
    this.setState({duration: data.duration});
  }

  onProgress = data => {
    this.setState({currentTime: data.currentTime});
  }

  onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    this.setState({ isBuffering });
  }

  getCurrentTimePercentage = () => {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  render() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    const {video} = this.props;
    console.log(video)
    return (
      <Container>
        <Spin />
        <TouchableOpacity style={styles.fullScreenVid} onPress={() => {this.setState({paused: !this.state.paused})}}>
          <Video
            source={{uri: video}}
            style={styles.fullScreenVid}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={false}
            ignoreSilentSwitch={this.state.ignoreSilentSwitch}
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onBuffer={this.onBuffer}
            onProgress={this.onProgress}
            repeat={true}
          />
        </TouchableOpacity>
    </Container>
    )
  }
}
