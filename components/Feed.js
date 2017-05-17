import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import * as firebase from 'firebase';
import PostCardImage from './PostCardImage'
import PostCardVideo from './PostCardVideo'
import { firebaseApp } from '../Home';

export default class MyFeed extends Component {
  constructor(props){
    super(props)
    this.state = {
      posts: []
    }
  }
  componentDidMount(){

    const firebaseRef = firebase.database().ref();
    const postsRef = firebase.database().ref('CurrentPosts');
    //let userId = firebaseApp.auth().currentUser.uid;
    let userId = 'Myrp4CNCtqeDXxc5keJBJSN5Lc03';
      //Query to fetch posts by current User
      postsRef.on('value', (snapshot) => {

        let posts = [];
        let postsObj = snapshot.val();

        for(post in postsObj) {
          posts.push(postsObj[post])
        }
        this.setState({posts: posts});
      });
  }

  render(){
    return (
        <Container>
            {this.state.posts && this.state.posts.map((post, i) => {
              if (post) {
                return  post.properties.image
               ? <PostCardImage navigation={this.props.navigation} key={i} post={post.properties} />
               : <PostCardVideo  navigation={this.props.navigation} key={i} post={post.properties} />
              }
            })}
        </Container>
    );
  }
}

