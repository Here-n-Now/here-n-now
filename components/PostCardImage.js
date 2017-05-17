import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

export default class PostCardImage extends Component  {
    constructor(props){
    super(props)
    this.state = {
      likes: this.props.post.likes
    }
  }
componentDidMount(){
    let post = this.props.post;
    let time =  new Date(this.props.post.postedAt);
    if (!post.likes) post.likes = 0;
    time = time.toString().slice(0,-14);
   }
  render(){
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
            onPress={() => {this.props.navigation.navigate('ViewContainer', {post})}}
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
                    <Text>{this.state.likes +' Likes'}</Text>
                </Button>
                <Button transparent onPress={() => {this.props.navigation.navigate('ViewContainer', {post})}}>
                    <Icon active name="chatbubbles" />
                     <Text>Comments</Text>
                </Button>
            </CardItem>

        </TouchableOpacity>
    </Card>
  );
}
}



