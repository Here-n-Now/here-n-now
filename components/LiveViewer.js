import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ListView, Image, TextInput} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import FullScreenVideo from './FullScreenVideo.js';
import Commons from './lib/commons.js';
import styles from './style/app.js';
import config from './config/app.js';

const FRONT_CAMERA = true;
const webRTCServices = require('./lib/services.js');
const VIDEO_CONFERENCE_ROOM = 'video_conference';

const SELF_STREAM_ID = 'self_stream_id';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stream: {},
      joinState: 'ready', //joining, joined
    }
  }

  componentDidMount() {
    webRTCServices.getLocalStream(true, (stream) => {})
  }

  dummyStream = (socketId, stream) => {
    this.setState({
      stream: {
          id: socketId,
          url: stream.toURL()
        }
    })
  }

  render() {
    return <View style={styles.container}>
      {
        this.state.joinState == 'joined' ?
        <FullScreenVideo stream={this.state.stream.url} />
        :
        null
      }
      {this.renderJoinContainer()}
    </View>
  }

  renderJoinContainer = () => {
    if(this.state.joinState != 'joined') {
      return <View style={styles.joinContainer}>
        <TouchableHighlight style={styles.joinButton}
            onPress={this.handleJoinClick}>
          <Text style={styles.joinButtonText}>{this.state.joinState == 'ready' ? 'Join' : 'Joining...'}</Text>
        </TouchableHighlight>
      </View>
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
      friendConnected: this.dummyStream,
    }
    webRTCServices.join(VIDEO_CONFERENCE_ROOM, this.state.name, callbacks);
  }

  //----------------------------------------------------------------------------
  //  WebRTC service callbacks
  handleJoined = () => {
    console.log('Joined');
    this.setState({
      joinState: 'joined'
    });
  }
}

// I am a broadcaster
// I create a room
// I only see myself
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

// const webRTCServices = require('./lib/services.js');
// const VIDEO_CONFERENCE_ROOM = 'video_conference';
//
// const SELF_STREAM_ID = 'self_stream_id';

// export default class App extends Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       activeStreamId: null,
//       //streamURLs: sampleStreamURLs,
//       streams: [], //list of (id, url: friend Stream URL). Id = socketId
//       joinState: 'ready', //joining, joined
//       name: 'Tho Q Luong'
//     }
//   }
//
//   componentDidMount() {
//     webRTCServices.getLocalStream(true, (stream) => {
//       this.setState({
//         activeStreamId: SELF_STREAM_ID,
//         streams: [{
//           id: SELF_STREAM_ID,
//           url: stream.toURL()
//         }]
//       })
//     });
//   }
//
//   render() {
//     let activeStreamResult = this.state.streams.filter(stream => stream.id == this.state.activeStreamId);
//     return <View style={styles.container}>
//       {
//         this.state.joinState == 'joined' ?
//         <FullScreenVideo streamURL={activeStreamResult.length > 0 ? activeStreamResult[0].url : null} />
//         :
//         null
//       }
//       {this.renderJoinContainer()}
//     </View>
//   }
//
//   renderJoinContainer = () => {
//     if(this.state.joinState != 'joined') {
//       return <View style={styles.joinContainer}>
//         <Text style={styles.joinLabel}>Be the first to join this conversation</Text>
//         <TextInput style={styles.joinName}
//           placeholder={'Enter your name'} placeholderTextColor={'#888'}
//           onChangeText={(name) => this.setState({name})}
//           value={this.state.name} />
//         <TouchableHighlight style={styles.joinButton}
//             onPress={this.handleJoinClick}>
//           <Text style={styles.joinButtonText}>{this.state.joinState == 'ready' ? 'Join' : 'Joining...'}</Text>
//         </TouchableHighlight>
//       </View>
//     }
//     return null;
//   }
//
//   handleSetActive = (streamId) => {
//     this.setState({
//       activeStreamId: streamId
//     });
//   }
//
//   handleJoinClick = () => {
//     if(this.state.name.length == 0 || this.state.joinState != 'ready') {
//       return;
//     }
//     //ELSE:
//     this.setState({
//       joinState: 'joining'
//     });
//     let callbacks = {
//       joined: this.handleJoined,
//       friendConnected: this.handleFriendConnected,
//       friendLeft: this.handleFriendLeft,
//       dataChannelMessage: this.handleDataChannelMessage
//     }
//     webRTCServices.join(VIDEO_CONFERENCE_ROOM, this.state.name, callbacks);
//   }
//
//   //----------------------------------------------------------------------------
//   //  WebRTC service callbacks
//   handleJoined = () => {
//     console.log('Joined');
//     this.setState({
//       joinState: 'joined'
//     });
//   }
//
//   handleFriendLeft(socketId) {
//     let newState = {
//       streams: this.state.streams.filter(stream => stream.id != socketId)
//     }
//     if(this.state.activeStreamId == socketId) {
//       newState.activeStreamId = newState.streams[0].id;
//     }
//     this.setState(newState);
//   }
//
//   handleFriendConnected = (socketId, stream) => {
//     this.setState({
//       streams: [
//         ...this.state.streams,
//         {
//           id: socketId,
//           url: stream.toURL()
//         }
//       ]
//     })
//   }
//
//   handleDataChannelMessage = (message) => {
//
//   }
// }
