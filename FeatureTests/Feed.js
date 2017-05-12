'use strict';

import React, { Component } from 'react';
//import {View, StyleSheet, Linking, Text, TouchableOpacity} from 'react-native';
import { Container, Content, Card, CardItem, Text, Body, Left, Image, Button, Icon } from 'native-base'
import * as firebase from 'firebase';
import {firebaseApp} from '../Nav';

export default class Feed extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }


  componentDidMount() {
      const database = firebaseApp.database();
      const postsRef = database.ref('posts');

      postsRef.on('value', (snapshot) => {
        var postsArr = Object.values(snapshot.val());
        console.log('PostsArr: ', postsArr)
        this.setState({posts: postsArr});
      });
  }

  render(){
    console.log('STATE: ',this.state.posts)


    return (

      <Container>
                <Content>
                  <Text>Emty Component</Text>
                </Content>
            </Container>
    );
  }
}


//post1: {
//   id: 1,
  // userID: 1,
//   location: {
//     latitude: 123,
//     longitude: 43
//   },
  // // text: '',
  //    video: '',
  //    picture: '',
     // comments: []
// }

