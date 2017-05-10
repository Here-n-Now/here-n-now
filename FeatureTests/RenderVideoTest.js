'use strict';
import React, {
  Component
} from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AlertIOS
} from 'react-native';

import Video from 'react-native-video';
import {firebaseApp} from '../Nav';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob'
//export const fireStorage = firebase.storage();
const fs = RNFetchBlob.fs
export default class RenderVideoTest extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
  }
    state = {
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'cover',
    duration: 0.0,
    currentTime: 0.0,
    controls: false,
    paused: false,
    skin: 'custom',
    ignoreSilentSwitch: null,
    isBuffering: false,
  };

  handleButton(postId,text) {
    const video = this.props.navigation.navigate.state
    console.log('Video in handleButton: ', video)

    const database = firebaseApp.database();



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

uploadNewImageToStorage() {
  console.log('Inside uploadNewImageToStorage')
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
let uri = '/Users/lada/Desktop/here-n-now/public/images/thdancingman.gif'
let name = 'dancing man';
this.uploadImage(uri,name)

}

uploadImage(uri, imageName, mime = 'image/gif ')  {
  console.log('Inside uploadImage')
 return new Promise((resolve, reject) => {

   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
     let uploadBlob = null
     const imageRef = firebaseApp.storage().ref('posts').child(imageName)
     fs.readFile(uploadUri, 'base64')
     .then((data) => {

       return Blob.build(data, { type: `${mime};BASE64` })
     })
     .then((blob) => {

       uploadBlob = blob
       return imageRef.put(blob, { contentType: mime })
     })
     .then(() => {
       uploadBlob.close()
       return imageRef.getDownloadURL()
     })
     .then((url) => {
       console.log('Url Inside Promise',url)
       resolve(url)
     })
     .catch((error) => {
       reject(error)
     })
  })
 }
  addCaption() {

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




  onLoad(data) {
    this.setState({duration: data.duration});
  }

  onProgress(data) {
    this.setState({currentTime: data.currentTime});
  }

  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  renderSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    const navState = this.props.navigation && this.props.navigation.state.params
    return (
      <View style={styles.container}>

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
          <Button
          title="Post this video"
          onPress={() => this.uploadNewImageToStorage()}
          style={{justifyContent: 'center'}}
        />
      </View>
    );
  }

  render() {
    return this.renderSkin();
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
