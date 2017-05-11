import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import * as firebase from 'firebase';
import PostCardImage from './PostCardImage'
import PostCardVideo from './PostCardVideo'

export default class PostFeed extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: {}
    }
  }
  componentWillMount(){
    var postRef = firebase.database().ref('posts');
      postRef.on('value', (snapshot) => {
      console.log('snapshot', snapshot.val())
      this.setState({posts: snapshot.val()})
    });
  }
  render(){
    return (
        <Container>
            <Content>
            {Object.keys(this.state.posts).map((postId, i) => {
                let post = this.state.posts[postId]
                return typeof post.image === 'string' ?
                <PostCardImage navigation={this.props.navigation} key={i} post={post} />
                : <PostCardVideo  navigation={this.props.navigation} key={i} post={post} />
            })}
            </Content>
        </Container>
    );
  }
}
