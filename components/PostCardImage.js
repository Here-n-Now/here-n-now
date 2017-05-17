import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardImage = props => {
    let post = props.post;
    console.log('PCI post', post)
    let time =  new Date(props.post.postedAt);
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
                    <Image
                      style={{width: 300, height: 200}}
                      source={{uri: post.image}}
                    />
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
                     <Text>Comments</Text>
                </Button>
            </CardItem>

        </TouchableOpacity>
    </Card>
  );
}

export default PostCardImage


