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
    // console.log('Selected Posts in PostFeed WillMount: ',this.props.navigation.state.params)
    // if(this.props.navigation.state.params) {
    //   console.log('Posts by Current User: ', this.props.navigation.state.params)
    // }
    this.postRef = firebase.database().ref('CurrentPosts').limitToLast(5);
    this.postRef.on('value', (snapshot) => {
      this.setState({posts: snapshot.val()})
    });
  }
  setCurrentReadOffset(event){
    // Log the current scroll position in the list in pixels
    let itemHeight = 328;
    let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
    let currentItemIndex = Math.ceil((currentOffset / itemHeight) + 1);
    if (currentItemIndex % (this.state.pageNum * 5) === 0) {this.loadNextPage()}
  }
  loadNextPage(){
    this.postRef.off('value');
    this.postRef = firebase.database().ref('posts').limitToLast(5 * (this.state.pageNum + 1))
    this.postRef.on('value', (snapshot) => {
      this.setState({posts: snapshot.val(), pageNum: this.state.pageNum + 1})
    });
  }
  render(){
    console.log('Post Cluster', this.props.navigation.state.params)
    const posts = this.props.navigation.state.params.postCluster
    return (
        <Container>
            <Content onScroll={(e) => this.setCurrentReadOffset(e)}>
            {posts.map((post, i) => {
                if (post) {
                  let postId = Object.keys(post)[0]
                  console.log('more', post[postId].properties.image)
                  console.log('mypostid', postId)
                  return post[postId].properties.image ?
                  <PostCardImage navigation={this.props.navigation} key={i} post={post[postId].properties} />
                  : <PostCardVideo  navigation={this.props.navigation} key={i} post={post[postId].properties} />
                }
            })}
            </Content>
        </Container>
    );
  }
}
