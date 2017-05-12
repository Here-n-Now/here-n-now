import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import * as firebase from 'firebase';
import PostCardImage from './PostCardImage'
import PostCardVideo from './PostCardVideo'

export default class PostFeed extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: {},
      pageNum: 1
    }
  }
  componentWillMount(){
    var postRef = firebase.database().ref('posts').limitToLast(5);
      postRef.on('value', (snapshot) => {
      this.setState({posts: snapshot.val()})
    });
  }
  setCurrentReadOffset(event){
    // Log the current scroll position in the list in pixels
    let itemHeight = 328;
    let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
    let currentItemIndex = Math.ceil((currentOffset / itemHeight)+1);
    console.log(currentItemIndex)
    console.log(event.nativeEvent.contentOffset.y);
    if (currentItemIndex % 5 === 0) {this.loadNextPage()}
  }
  loadNextPage(){
    var postRef = firebase.database().ref('posts').limitToLast(5 * (this.state.pageNum + 1))
      postRef.on('value', (snapshot) => {
      this.setState({posts: snapshot.val(), pageNum: this.state.pageNum+1})
    });
  }
  render(){
    return (
        <Container>
            <Content onScroll={(e) => this.setCurrentReadOffset(e)}>
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
