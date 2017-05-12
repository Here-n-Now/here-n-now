import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import {Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardVideo = props => {

  return (
    <Card style={{ flex: 0 }}>
        <CardItem>
            <Left>
                <Body>
                    <Text>NativeBase</Text>
                    <Text note>April 15, 2016</Text>
                </Body>
            </Left>
        </CardItem>
        <TouchableOpacity
            onPress={() => {props.navigation.navigate('ViewPost', {videoURL: props.post.video})}}
        >
            <CardItem>
                <Body>
                <Video
                source={{uri: props.post.video}}
                style={{width: 300, height: 200}}
                paused={true}
                />
                    <Button transparent textStyle={{color: '#87838B'}}>
                        <Icon name="logo-github" />
                        <Text>1,926 stars</Text>
                    </Button>
                </Body>
            </CardItem>
        </TouchableOpacity>
    </Card>
  );
}

export default PostCardVideo
