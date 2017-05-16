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
    let userId = firebaseApp.auth().currentUser.uid;
    console.log('USER: ', userId)
      //Query to fetch posts by current User
      userPostsRef.orderByChild('properties/user_id').equalTo('hNJJCINySdZCFYXSv5VeIKTGLPT2')
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

    console.log('State.selected Inside MyFeed in Render: ', this.state.selected)
    return (
        <Container>
            {this.state.selected && this.state.selected.map((post, i) => {
            console.log('typeof image: ',typeof post.properties.image)
              return typeof post.properties.image === 'string'
               ? <PostCardImage navigation={this.props.navigation} key={i} post={post} />
               : <PostCardVideo  navigation={this.props.navigation} key={i} post={post} />
            })}
        </Container>
    );
    // return (
    //    <Text>Empty MyFeed</Text>
    //         )
  }
}

