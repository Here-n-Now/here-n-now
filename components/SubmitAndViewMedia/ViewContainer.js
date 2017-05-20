'use strict';
import React, { Component } from 'react';
import { Modal, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Fab, Header, Title, Left, Right, Body, Text, ListItem, Footer, Grid, Col,Toast } from 'native-base';
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
    window.query = firebase.database().ref('CurrentPosts/' + _id + '/properties/comments');
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
    let post = this.props.navigation.state.params.post;
    let mediaType = video ? 'video' : 'image';
    if (!post.likes){post.likes = 0}
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
        <Fab
          position="bottomRight"
          onPress={
            () => {

              console.log('Post in single view: ', post);
              const thisPostsRef = firebase.database().ref('CurrentPosts/' + post._id + '/properties');
                    if (!post.likes) {
                        thisPostsRef.update({likes: 1});
                    } else {
                        thisPostsRef.update({likes: post.likes + 1})
                    }
                    Toast.show({
        text: `${post.likes} like this ${mediaType}!`,
        position: 'bottom',
        type: 'success',
        duration: 3000
      })
            }
          }>
            <Icon active name="thumbs-up" />

        </Fab>
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


