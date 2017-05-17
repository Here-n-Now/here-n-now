import React, { Component } from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import FullScreenVideo from './FullScreenVideo.js';
import Commons from '../lib/commons.js';
import styles from '../style/app.js';
import config from '../config/app.js';

const FRONT_CAMERA = true;
const webRTCServices = require('../lib/services.js');
const VIDEO_CONFERENCE_ROOM = 'video_conference';

const SELF_STREAM_ID = 'self_stream_id';

export default class LiveViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stream: {}, //list of (id, url: friend Stream URL). Id = socketId
      joinState: 'ready', //joining, joined
    }
  }

  componentDidMount() {
    webRTCServices.getLocalStream(false, false, (stream) => {});
  }
// to user speaker https://github.com/zxcpoiu/react-native-incall-manager
  render() {
      const { stream } = this.props
      return (
        <View>
          {
            this.state.joinState == 'joined' ?
            <FullScreenVideo stream={stream} />
            :
            null
          }
          {this.renderJoinContainer()}
      </View>
    )
  }

  renderJoinContainer = () => {
    if(this.state.joinState != 'joined') {
      return (
        <View style={styles.joinContainer}>
          <TouchableHighlight style={styles.joinButton}
              onPress={this.handleJoinClick}>
            <Text style={styles.joinButtonText}>{this.state.joinState == 'ready' ? 'Join' : 'Joining...'}</Text>
          </TouchableHighlight>
        </View>
      )
    }
    return null;
  }

  handleJoinClick = () => {
    if(this.state.joinState != 'ready') {
      return;
    }
    //ELSE:
    this.setState({
      joinState: 'joining'
    });
    let callbacks = {
      joined: this.handleJoined,
      friendConnected: this.handleFriendConnected,
    }
    webRTCServices.join(VIDEO_CONFERENCE_ROOM, null, callbacks);
  }

  //----------------------------------------------------------------------------
  //  WebRTC service callbacks
  handleJoined = () => {
    this.setState({
      joinState: 'joined'
    });
  }

  handleFriendConnected = (socketId, stream) => {
    this.setState({
      stream:
        {
          id: socketId,
          url: stream.toURL()
        }
    })
  }
}
