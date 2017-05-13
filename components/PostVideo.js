'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, AlertIOS } from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab, Footer } from 'native-base';

import Video from 'react-native-video';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import { NavigationActions } from 'react-navigation'
import GeoFire from 'geofire';

const fs = RNFetchBlob.fs;


export default class PostVideo extends Component {
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
      skin: 'custom',
      ignoreSilentSwitch: null,
      isBuffering: false,
    };
  }

  postToFirebaseDB = (videoURL, text = '') => {
    //Points to geolocation folder
    const geofireRef = firebase.database().ref('geolocation');
    // //Points to firebase root
    const firebaseRef = firebase.database().ref(); //was a '.push()'?
    // //Points to posts folder
    const postsRef = firebase.database().ref('posts')
    // //Creates new geofire instance
    const geoFire = new GeoFire(geofireRef);
    const myId = `Video:${firebaseRef.push().key}`
    const database = firebaseApp.database();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //post to geofire folder
        geoFire.set(myId, [position.coords.latitude, position.coords.longitude])
        //post to posts folder
        firebaseApp.database().ref('posts/' + myId).set({
          id: myId,
          text: text,
          video: videoURL,
          coords: {
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
          }
        })
      }
    )

    this.props.navigation.navigate('View');

    Toast.show({
      text: 'Yay! Your picture is up!',
      position: 'bottom',
      type: 'success',
      duration: 5000
    })
  }

  uploadNewVideoToStorage = () => {
    const Blob = RNFetchBlob.polyfill.Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    const { video } = this.props.navigation.state.params
    const videoName = Math.random().toString();
    this.uploadVideo(video, videoName)
  }

  uploadVideo(video, videoName, mime = 'video/mp4') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios'
        ? video.replace('file://', '')
        : video
      let uploadBlob = null
      const videoRef = firebaseApp.storage().ref('posts').child(videoName)
      fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`})
      }).then(blob => {
        uploadBlob = blob
        return videoRef.put(blob, {contentType: mime})
      }).then(() => {
        uploadBlob.close()
        return videoRef.getDownloadURL()
      }).then(videoURL => {
        resolve(videoURL)
        this.postToFirebaseDB(videoURL)
      }).catch((error) => {
        reject(error)
      })
    })
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
            source={navState ? {uri: navState.video} : require('../introVid.mp4')}
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
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              shadowColor: 'black',
              shadowOpacity: 1.0,
            }}
            position="topLeft"
            onPress={
              () => this.props.navigation.dispatch(NavigationActions.back({}))
            }>
            <Icon name="ios-close-circle-outline" />
          </Fab>
          <Fab
            position="topRight"
            onPress={this.uploadNewVideoToStorage}>
          <Icon name="md-send" />
          </Fab>
    </Container>
    )
  }
}
// <View style={styles.form}>
//   <Item>
//       <Input placeholder='Add a caption' style={styles.form}/>
//   </Item>
// </View>
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
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white',
    shadowColor: 'black',
    shadowOpacity: 1.0,
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
