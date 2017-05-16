'use strict';
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { Container, Toast } from 'native-base';

import RNFetchBlob from 'react-native-fetch-blob';
import GeoFire from 'geofire';
import { firebaseApp } from '../../Home';
import postToFirebaseDB from '../../database/Utils';

import CloseFab from './CloseFab';
import SubmitFab from './SubmitFab';
import CommentsFab from './CommentsFab';
import CommentsModal from './CommentsModal';
import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import Spin from '../Spin';
import styles from '../style/app';

const fs = RNFetchBlob.fs;

export default class PostVideo extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      modalVisible: false,
      text: '',
      finalText: ''
    };
    this.setState = this.setState.bind(this);
  }

  uploadToStorage = () => {
    this.setState({uploading: true});
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
        this.postToFirebase(mediaUrl);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  postToFirebase = (mediaUrl) => {
    const { finalText } = this.state
    const { video, image } = this.props.navigation.state.params;
    let mediaType = video ? 'video' : 'image';
    Promise.resolve(postToFirebaseDB(mediaUrl, mediaType, finalText))
    .then(() => {
      this.props.navigation.navigate('View');
      Toast.show({
        text: `Yay! Your ${mediaType} is up!`,
        position: 'bottom',
        type: 'success',
        duration: 3000
      })
    })
  }

  render() {
    const { text, finalText, modalVisible, uploading } = this.state;
    const navProps = this.props.navigation;
    const { video, image } = navProps.state.params;
    const backAction = navProps.dispatch;
    return this.state.uploading ?
      <Spin />
      :
      <Container>
        {
          //this fixes the video playing in the background issue
          !uploading &&
          (video ? <ViewVideo video={video} /> : <ViewImage image={image} />)
        }
        <CloseFab
          backAction={backAction}
        />
        <SubmitFab
          uploadToStorage={this.uploadToStorage}
        />
        <CommentsFab
          finalText={finalText}
          setState={this.setState}
        />
        <CommentsModal
          setState={this.setState}
          text={text}
          modalVisible={modalVisible}
          finalText={finalText}
        />
      </Container>
    }
}
