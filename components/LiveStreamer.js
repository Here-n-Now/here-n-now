import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ListView, Image, TextInput} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import FullScreenVideo from './FullScreenVideo.js';
import Commons from './lib/commons.js';
import styles from './style/app.js';
import config from './config/app.js';

const FRONT_CAMERA = true; //dead code right now
const webRTCServices = require('./lib/services.js');
const VIDEO_CONFERENCE_ROOM = 'video_conference';

const SELF_STREAM_ID = 'self_stream_id';

import { firebaseApp } from '../Nav';
import * as firebase from 'firebase';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeStreamId: SELF_STREAM_ID,
      stream: {},
      //streamURLs: sampleStreamURLs,
      broadcast: 'Ready', //Starting, Started
    }
  }

  componentDidMount() {
    webRTCServices.getLocalStream(true, (stream) => {
      this.setState({
        //sets your own id  and your url that you are streaming
        stream: {
          id: SELF_STREAM_ID,
          url: stream.toURL()
        }
      })
    });
  }

  postToFirebaseDB = (videoURL, text = '') => {
    const postId = Math.random().toString().split('.')[1];
    const database = firebaseApp.database();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        firebaseApp.database().ref('live/' + postId).set({
          id: postId,
          text: null,
          coords: {
            latitude: 40.704611,
            longitude: -74.008738,
          },
          stream: this.state.stream.url
        })
      }
    )
  }

  render() {
    console.log('livestream', this.state.stream.url)
    return <View style={styles.container}>
        <FullScreenVideo streamURL={this.state.stream.url} />
      {this.renderStartContainer()}
    </View>
  }

  renderStartContainer = () => {
    if(this.state.broadcast != 'Started') {
      return <View style={styles.joinContainer}>
        <TouchableHighlight style={styles.joinButton}
            onPress={this.handleStartClick}>
          <Text style={styles.joinButtonText}>{this.state.broadcast == 'Ready' ? 'Start' : 'Starting...'}</Text>
        </TouchableHighlight>
      </View>
    }
    return null;
  }

  handleStartClick = () => {
    if(this.state.broadcast != 'Ready') {
      return;
    }
    //ELSE:
    this.setState({
      broadcast: 'Starting'
    });
    let callbacks = {
      joined: this.handleStarted,
      dataChannelMessage: this.handleDataChannelMessage
    }
    webRTCServices.join(VIDEO_CONFERENCE_ROOM, null, callbacks);
    this.postToFirebaseDB()
  }

  //----------------------------------------------------------------------------
  //  WebRTC service callbacks
  handleStarted = () => {
    this.setState({
      broadcast: 'Started'
    });
  }

}

// I am a broadcaster
// I create a room
// I only see myself
// I can chose camera front or back
// (I can see count of people connected)
// I can close the connection
// Auto generates id
// That gets pushed to the db
// That gets rendred on map

// I am a viewer
// I can click on an id to enter a room
// I can only view
// I can leave
// I get a message when broadcast ends
// (I can commment or like)
