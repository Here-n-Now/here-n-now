import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import {Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardVideo = props => {
    let post = props.post;
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
            onPress={() => {props.navigation.navigate('ViewContainer', {videoURL: post.video})}}
        >
            <CardItem>
                <Body>
                    <Video
                    source={{uri: post.video}}
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
