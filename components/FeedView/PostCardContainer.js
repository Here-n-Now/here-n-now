'use strict'
import React, { Component } from 'react';
import { Modal, StyleSheet, Platform, Image, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import { Icon, Button, Container, Content, Input, Item, Fab, Header, Title, Left, Right, Body, Text, ListItem, Footer, Grid, Col,Toast, Card, CardItem } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { firebaseApp } from '../../Home';
import * as firebase from 'firebase';

import { postCommentToFirebaseDB } from '../../database/Utils';
import { addLikeToPost } from '../../database/Utils';
import ViewCommentsModal from '../SubmitAndViewMedia/ViewCommentsModal';
import PostCard from './PostCard'
import styles from '../style/app';

export default class PostCardContainer extends Component {
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
        likes: []
      };
    this.setState = this.setState.bind(this);
  }
  componentDidMount(){

    let likes;
    if(!this.props.post.likes || !Array.isArray(this.props.post.likes)) likes = [];
    else likes = this.props.post.likes;
    let comments;
    if(!this.props.post.comments ) comments = [];
    else comments = Object.entries(this.props.post.comments).reverse();
    this.setState({likes:likes
                  ,comments: comments
  });

  }

  postComment = () => {
    const { comment } = this.state;
    if (!comment.length) return;
    const { _id } = this.props.post;
    postCommentToFirebaseDB(_id, comment)
    .then(() => this.setState({comment: ''}))
  }

  getFromFirebaseDB = () => {
    const { _id } = this.props.post;
    window.query = firebase.database().ref('CurrentPosts/' + _id + '/properties/comments');
    query.on('value', (snapshot) => {
      let comments = snapshot.val();
      //if not null, comments will get reversed array of comments
      comments = comments && Object.entries(comments).reverse();
      this.setState({ comments });
    });
  }

  addLike = (post) => {
    addLikeToPost(post)
     .then( () => {
        this.setState({likes: post.likes})
    })
     }

     componentWillUnmount = () => {
    window.query && window.query.off();
  }

  render() {

    const post  = this.props.post;
    const navProps = this.props.navigation;
    const backAction = navProps.dispatch;
    const { modalVisible, comments, comment, likes } = this.state;

    let postType;
    const {image, video, stream,text} = this.props.post
    if (image){
        post.uri = image
        postType = 'image'
    } else if (video) {
        post.uri = video
        postType = 'video'
    } else {
        post.uri = require('../../live-stream.jpg')
    }
    let commentsNum = 0;
    if(post.comments)  commentsNum = Object.keys(post.comments).length;
    let time =  new Date(this.props.post.postedAt);
    if(!post.likes || !Array.isArray(post.likes)) post.likes = [];
    time = time.toString().slice(0,-14);
    return  (
       <Card style={{ flex: 0 }}>
        <CardItem>
            <Left>
                <Body>
                    <Text>{post.text}</Text>
                    <Text note>{'Posted on ' +  time}</Text>
                </Body>
            </Left>
        </CardItem>
        <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('ViewContainer', {post})}}
        >
            <CardItem>
                <Body>
            {
                postType === 'image' ?
                    <Image
                      style={{width: 300, height: 200}}
                      source={{uri: post.uri}}
                    />
                :
                    <Video
                    source={{uri: post.uri}}
                    style={{width: 300, height: 200}}
                    paused={true}
                    />
            }
                </Body>
            </CardItem>
            <CardItem>
                <Button transparent onPress={() => this.addLike(post)} >
                    <Icon active name="thumbs-up" />
                    <Text>{likes ? likes.length > 1 ? `${likes.length} likes` : `${likes.length} like` : 'No likes'}</Text>
                </Button>
                <Button transparent
                    onPress={() => {
                      this.getFromFirebaseDB();
                      this.setState({modalVisible: true});
                      this.props.navigation.navigate('ViewCommentsModal', {post})}} >
                    <Icon active name="chatbubbles" />
                     <Text>{comments ? comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment` : 'No comments'}</Text>
                </Button>
            </CardItem>
            <ViewCommentsModal
          setState={this.setState}
          comments={comments}
          comment={comment}
          modalVisible={modalVisible}
          postComment={this.postComment}
          text={text}
        />
        </TouchableOpacity>
    </Card>
    )
    }
  }
