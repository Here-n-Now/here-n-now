'use strict';
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Fab } from 'native-base';

import Video from 'react-native-video';
import { NavigationActions } from 'react-navigation';

import { firebaseApp } from '../Nav';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import styles from './style/app';

const fs = RNFetchBlob.fs;

export default class PostVideo extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  uploadToStorage = () => {
    const { video, image } = this.props.navigation.state.params;
    let mediaLocalUrl = video || image;
    const Blob = RNFetchBlob.polyfill.Blob;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    const mediaId = Math.random().toString();
    this.uploadMedia(mediaLocalUrl, mediaId);
  }

  uploadMedia(mediaLocalUrl, mediaId) {
    const { video, image } = this.props.navigation.state.params;
    let mime = video ? 'video/mp4' : 'image/gif';
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios'
        ? mediaLocalUrl.replace('file://', '')
        : mediaLocalUrl;
      let uploadBlob = null;
      const mediaLocalUrlRef = firebaseApp.storage().ref('posts').child(mediaId);
      fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
      }).then(blob => {
        uploadBlob = blob;
        return mediaLocalUrlRef.put(blob, {contentType: mime});
      }).then(() => {
        uploadBlob.close();
        return mediaLocalUrlRef.getDownloadURL();
      }).then(mediaUrl => {
        resolve(mediaUrl);
        this.postToFirebaseDB(mediaUrl);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  postToFirebaseDB = (mediaUrl, text = '') => {
    const { video, image } = this.props.navigation.state.params;
    let mediaType = video ? 'video' : 'image';
    const postId = Math.random().toString().split('.')[1];
    const database = firebaseApp.database();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        firebaseApp.database().ref('posts/' + postId).set({
          id: postId,
          text: text,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          [mediaType]: mediaUrl
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

  render() {
    const { video, image } = this.props.navigation.state.params
    return (
      <Container style={styles.containerVid}>
        {video ? <ViewVideo video={video} /> : <ViewImage image={image} />}
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
            onPress={this.uploadToStorage}>
          <Icon name="md-send" />
          </Fab>
    </Container>
    )
  }
}
// <View style={styles.formVid}>
//   <Item>
//       <Input placeholder='Add a caption' style={styles.form}/>
//   </Item>
// </View>
