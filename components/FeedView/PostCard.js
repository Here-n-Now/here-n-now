import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import Video from 'react-native-video';

const PostCard = props => {
    let post = props.post
    let postType;
    const {image, video, stream} = props.post
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
    let time =  new Date(props.post.postedAt);
    if (!post.likes){post.likes = 0}
    time = time.toString().slice(0,-14);
  return (
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
            onPress={() => {props.navigation.navigate('ViewContainer', {post})}}
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
                <Button transparent onPress={() => {
                    const thisPostsRef = firebase.database().ref('CurrentPosts/' + post._id + '/properties');
                    if (!post.likes) {
                        thisPostsRef.update({likes: 1});
                    } else {
                        thisPostsRef.update({likes: post.likes + 1})
                    }
                    }} >
                    <Icon active name="thumbs-up" />
                    <Text>{post.likes +' Likes'}</Text>
                </Button>
                <Button transparent>
                    <Icon active name="chatbubbles" />
                     <Text>{commentsNum + 'Comments'}</Text>
                </Button>
            </CardItem>
        </TouchableOpacity>
    </Card>
  );
}

export default PostCard


