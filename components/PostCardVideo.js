import React, { Component } from 'react';
import { Image } from 'react-native';
import Video from 'react-native-video';
import {Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardVideo = props => {
  console.log('PC props', props)
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
        <CardItem>
            <Body>
            <Video
              source={{uri: props.post.video}}
              style={{width: 300, height: 200}}
              paused={true}
            />
                <Button transparent textStyle={{color: '#87838B'}}
                  onPress={() => {
                    props.navigation.navigate('viewPost', {videoURL: props.post.video})}
                  }
                >
                    <Icon name="logo-github" />
                    <Text>1,926 stars</Text>
                </Button>
            </Body>
        </CardItem>
    </Card>
  );
}

export default PostCardVideo
