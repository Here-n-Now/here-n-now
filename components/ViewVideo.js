'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, AlertIOS } from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab, Footer } from 'native-base';

import Video from 'react-native-video';
import { firebaseApp } from '../Nav';
import * as firebase from 'firebase';

export default class RenderVideoTest extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      volume: 1,
      muted: true,
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

  handleButton = (postId,text) => {
    const video = this.props.navigation.navigate.state
    console.log('Video in handleButton: ', video)

    const database = firebaseApp.database();
    // const storageRef = firebase.storage.ref();
    // const imageRef = storageRef.child('../public/images/thdancingman.gif')
    // var metadata = {
    //   contentType : 'image/jpeg'
    // };
    // imageRef.put(file,metadata)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        firebaseApp.database().ref('posts/'+postId).set({
          id: postId,
          text: text,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          movie: video ? {uri: video.video} : require('../broadchurch.mp4')
        })
      }
    )
  }

  addCaption = () => {
    console.log('props.navigation.navigate.video in addCaption: ',this.props.navigation.navigate.video)
    AlertIOS.prompt(
        'Add Caption',
        null,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {
            text: 'Post',
            onPress: (text) => {
              this.handleButton(6,text)
            }}
        ],
        'plain-text'
      );
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
    const navState = this.props.navigation && this.props.navigation.state.params
    return (
      <Container style={styles.container}>
        <TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
          <Video
            source={navState ? {uri: navState.video} : require('../broadchurch.mp4')}
            style={styles.fullScreen}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
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
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              shadowColor: 'black',
              shadowOpacity: 1.0,
            }}
            position="topLeft"
            onPress={this.setModalVisible}>
            <Icon name="ios-close-circle-outline" />
          </Fab>
          <Fab
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              shadowColor: 'black',
              shadowOpacity: 1.0,
            }}
            position="topRight"
            onPress={this.setModalVisible}>
          <Icon name="ios-happy-outline" />
          </Fab>
        <View style={styles.form}>
          <Text>What up?</Text>
        </View>
    </Container>
    )
  }
}

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
  fab: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
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
