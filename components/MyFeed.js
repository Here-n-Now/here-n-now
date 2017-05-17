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
      selected: []
    }
  }
  componentDidMount(){

    const firebaseRef = firebase.database().ref();
    const userPostsRef = firebase.database().ref('CurrentPosts');
   // const database = firebaseApp.database();
   let userId = 'Myrp4CNCtqeDXxc5keJBJSN5Lc03'
   //****commented out line 22 just for testing
    //let userId = firebaseApp.auth().currentUser.uid;
    console.log('USER: ', userId)
      //Query to fetch posts by current User
      userPostsRef.orderByChild('properties/user_id').equalTo(userId)
      .on('value', (snapshot) => {

        let selected = [];
        let selectedObj = snapshot.val();
        console.log('selectedObj: ', selectedObj)
        for(post in selectedObj) {
          selected.push(selectedObj[post])
        }

        this.setState({selected: selected });
      });
  }

  render(){

    return (
        <Container>
            {this.state.selected && this.state.selected.map((post, i) => {
              if (post) {
                console.log('Post in Myfeed: ',post)
                //let postId = Object.keys(post)[0];
                return  post.properties.image
               ? <PostCardImage navigation={this.props.navigation} key={i} post={post.properties} />
               : <PostCardVideo  navigation={this.props.navigation} key={i} post={post.properties} />
              }
            })}
        </Container>
    );
  }
}

