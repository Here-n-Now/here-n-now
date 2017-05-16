'use strict';
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { Container, Toast } from 'native-base';

import CloseFab from './CloseFab';
import SubmitFab from './SubmitFab';
import CommentsFab from './CommentsFab';
import CommentsModal from './CommentsModal';
import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import Spin from '../Spin';
import styles from '../style/app';
import {uploadMedia, postToFirebaseDB} from '../../database/Utils';


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
    const { finalText } = this.state
    let mediaLocalUrl = video || image;
    let mime = video ? 'video/mp4' : 'image/gif';
    let mediaType = video ? 'video' : 'image';
    const mediaId = Math.random().toString();
    Promise.resolve(uploadMedia(mediaLocalUrl, mediaId, mime, mediaType, finalText))
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
