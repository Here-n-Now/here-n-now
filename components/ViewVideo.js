'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, AlertIOS, Image } from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab, Footer } from 'native-base';

import Video from 'react-native-video';
import { firebaseApp } from '../Home';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation'

export default class ViewVideo extends Component {
  static navigationOptions = {
    header: null
  }
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
    const { videoURL, imageURL } = this.props.navigation.state.params
    return imageURL ?
      (
        <Container>
          <Image source={{uri: imageURL}} style={styles.backgroundImage} />
          <Fab
            style={styles.fab}
            position="topLeft"
            onPress={() => this.props.navigation.dispatch(NavigationActions.back({}))}
          >
            <Icon name="md-close-circle" />
          </Fab>
        </Container>
      )
        :
        (<Container style={styles.container}>
          <TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
          <Video
            source={{uri: videoURL}}
            style={styles.fullScreen}
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
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
              <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
            </View>
          </View>
          <Fab
            style={styles.fab}
            position="topLeft"
            onPress={
              () => this.props.navigation.dispatch(NavigationActions.back({}))
            }>
            <Icon name="md-close-circle" />
          </Fab>
    </Container>
    )
  }
}

// <View style={[styles.form, {pointerEvents: 'none'}]}>
//   <Text>What up?</Text>
// </View>

// <Fab
//   style={{
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     shadowColor: 'black',
//     shadowOpacity: 1.0,
//   }}
//   position="topRight"
//   onPress={this.setModalVisible}>
// <Icon name="ios-happy-outline" />
// </Fab>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  fab: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    //shadowOffset: {
    //  width: 10,
    //  height: 10,
    //},
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
});
