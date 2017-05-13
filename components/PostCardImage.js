import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

const PostCardImage = props => {

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
            onPress={() => {props.navigation.navigate('ViewPost', {imageURL: props.post.image})}}
        >
        <CardItem>
            <Body>
                <Image
                  style={{width: 300, height: 200}}
                  source={{uri: props.post.image}}
                />
                <Button transparent textStyle={{color: '#87838B'}}
                  onPress={() => {
                    props.navigation.navigate('ViewPost', {imageURL: props.post.image})}
                  }
                >
                    <Icon name="logo-github" />
                    <Text>1,926 stars</Text>
                </Button>
            </Body>
        </CardItem>
        </TouchableOpacity>
    </Card>
  );
}

export default PostCardImage
