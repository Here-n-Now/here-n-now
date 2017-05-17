'use strict';
import React, { Component } from 'react';
import { Modal, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Fab, Header, Title, Left, Right, Body, Text, ListItem, Footer, Grid, Col } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { firebaseApp } from '../../Home';
import * as firebase from 'firebase';

import { postCommentToFirebaseDB } from '../../database/Utils'
import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import LiveViewer from './LiveViewer'
import ViewCommentsFab from './ViewCommentsFab';
import ViewCommentsModal from './ViewCommentsModal';
import CloseFab from './CloseFab';
import styles from '../style/app';

export default class ViewContainer extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      comment: '',
      userName: '',
      comments: [],
      postArr: []
    };
    this.setState = this.setState.bind(this);
  }

  postComment = () => {
    const { comment } = this.state;
    if (!comment.length) return;
    const { _id } = this.props.navigation.state.params.post;
    postCommentToFirebaseDB(_id, comment)
    .then(() => this.setState({comment: ''}))
  }

  getFromFirebaseDB = () => {
    const { _id } = this.props.navigation.state.params.post;
    window.query = firebase.database().ref('CurrentPosts/' + _id + '/comments');
    query.on('value', (snapshot) => {
      let comments = snapshot.val();
      //if not null, comments will get reversed array of comments
      comments = comments && Object.entries(comments).reverse();
      this.setState({ comments });
    });
  }

  componentWillUnmount = () => {
    window.query && window.query.off();
  }

  render() {
    const navProps = this.props.navigation;
    const { video, image, text, stream } = navProps.state.params.post;
    const backAction = navProps.dispatch;
    const { modalVisible, comments, comment } = this.state;
    return  (
      <View style={{flex: 1}}>
        {
          stream ?
          <LiveViewer stream={stream} />
          :
          video ?
          <ViewVideo video={video} />
          :
          <ViewImage image={image} />
        }
        <CloseFab
          backAction={backAction}
        />
        <ViewCommentsFab
          getFromFirebaseDB={this.getFromFirebaseDB}
          setState={this.setState}
        />
        <ViewCommentsModal
          setState={this.setState}
          comments={comments}
          comment={comment}
          modalVisible={modalVisible}
          postComment={this.postComment}
          text={text}
        />
      </View>)
  }
}

// <Fab
//   style={{
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     shadowColor: 'black',
//     shadowOpacity: 1.0,
//   }}
//   position="topRight"
//   onPress={this.setModalVisible}>
// <Icon name="ios-happy-outline" />
// </Fab>
