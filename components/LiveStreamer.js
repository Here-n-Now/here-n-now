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

import { firebaseApp } from '../Home';
import * as firebase from 'firebase';
import GeoFire from 'geofire';

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
    webRTCServices.getLocalStream(true, true, (stream) => {
      this.setState({
        //sets your own id  and your url that you are streaming
        stream: {
          id: SELF_STREAM_ID,
          url: stream.toURL()
        }
      })
    });
  }

  postToFirebaseDB = (mediaUrl, text = '') => {
    const geofireRef = firebase.database().ref('geolocation');
    const firebaseRef = firebase.database().ref(); //was a '.push()'?
    const postsRef = firebase.database().ref('posts')
    const geoFire = new GeoFire(geofireRef);
    const myId = `Live:${firebaseRef.push().key}`
    const database = firebaseApp.database();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        geoFire.set(myId, [position.coords.latitude, position.coords.longitude]);
        firebaseApp.database().ref('geoJSON/' + myId).set({
            "type": "Feature",
            "properties": {
              "_id": myId,
              "featureclass": "A",
              "stream": this.state.stream.url,
              "user_id": firebaseApp.auth().currentUser.uid,
              "postedAt": firebase.database.ServerValue.TIMESTAMP
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                position.coords.longitude,
                position.coords.latitude
              ]
            }
        })
      }
    )
  }

  render() {
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

//Create our own server?
//Have muliple rooms?

// I am a broadcaster
//// I can close the connection
///// this should remove the pin
//// I can chose camera front or back
//// (I can see count of people connected)

// I am a viewer
//// I can leave and it closes my connection
//// If I am in a room and the broadcast ends, it get a message
//// (I can commment or like)
