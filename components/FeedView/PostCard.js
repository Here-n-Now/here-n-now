import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
import Video from 'react-native-video';
import ViewContainer from '../SubmitAndViewMedia/ViewContainer';
import { addLikeToPost } from '../../database/Utils';


const PostCard = props => {
    console.log('props inside Postcard',props)
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
    if(!post.likes || !Array.isArray(post.likes)) post.likes = [];
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
                <Button transparent onPress={() => addLikeToPost(post)} >
                    <Icon active name="thumbs-up" />
                    <Text>{post.likes.length +' Likes'}</Text>
                </Button>
                <Button transparent
                    onPress={() => {props.navigation.navigate('ViewCommentsModal', {post})}} >
                    <Icon active name="chatbubbles" />
                     <Text>{commentsNum + 'Comments'}</Text>
                </Button>
            </CardItem>
        </TouchableOpacity>
    </Card>
  );
}

export default PostCard


