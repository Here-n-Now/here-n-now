import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ListView, Image, TextInput} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import FullScreenVideo from './FullScreenVideo.js';
import Commons from '../lib/commons.js';
import styles from '../style/app.js';
import config from '../config/app.js';
import { postToFirebaseDB } from '../../database/Utils';

const FRONT_CAMERA = true; //dead code right now
const webRTCServices = require('../lib/services.js');
const VIDEO_CONFERENCE_ROOM = 'video_conference';

const SELF_STREAM_ID = 'self_stream_id';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeStreamId: SELF_STREAM_ID,
      stream: {},
    }
  }

  componentDidMount() {
    webRTCServices.getLocalStream(false, true, (stream) => {
      this.setState({
        //sets your own id  and your url that you are streaming
        stream: {
          id: SELF_STREAM_ID,
          url: stream.toURL()
        }
      })
    });
  }

  handleStartClick = () => {
    const {stream} = this.state;
    let callbacks = {
      joined: this.handleStarted,
      dataChannelMessage: this.handleDataChannelMessage
    }
    webRTCServices.join(VIDEO_CONFERENCE_ROOM, null, callbacks);
    postToFirebaseDB(stream.url, 'stream')
  }
// MediaStreamTrack.prototype._switchCameras()
  render() {
    const {stream} = this.state;
    console.log(this.props)
    const ready = !!Object.keys(stream).length
    return ready && (
      <View>
        <FullScreenVideo stream={stream.url} />
        {this.handleStartClick()}
      </View>
    )
  }

}

//Create our own server?
//Have muliple rooms?

// I am a broadcaster
//// I can close the connection
//// this should remove the pin
//// I can chose camera front or back
//// (I can see count of people connected)

// I am a viewer
//// I can leave and it closes my connection
//// If I am in a room and the broadcast ends, it get a message
//// (I can commment or like)
