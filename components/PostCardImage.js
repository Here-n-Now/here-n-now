import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardImage = props => {
    let post = props.post;
    console.log('Post in postcardImage: ',post)
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
            onPress={() => {
                console.log('image URL: ',post.image)
                props.navigation.navigate('ViewContainer', {image: post.image,
                                                            text: post.text})}}
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
            <Button transparent onPress={() => {console.log('Go increment likes in DB!')}}>
                <Icon active name="thumbs-up" />
                <Text>{post.likes +' Likes'}</Text>
            </Button>
            <Button transparent>
                <Icon active name="chatbubbles" />
                 <Text>4 Comments</Text>
            </Button>
        </CardItem>
        </TouchableOpacity>
    </Card>
  );
}

export default PostCardImage


