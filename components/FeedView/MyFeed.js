import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import * as firebase from 'firebase';
import PostCardContainer from './PostCardContainer'
import { firebaseApp } from '../../Home';

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
    let userId = firebaseApp.auth().currentUser.uid;
      //Query to fetch posts by current User
      userPostsRef.orderByChild('properties/user_id').equalTo(userId)
      .on('value', (snapshot) => {

        let selected = [];
        let selectedObj = snapshot.val();

        for(post in selectedObj) {
          selected.push(selectedObj[post])
        }
        this.setState({selected: selected});
      });
  }

  render(){
    return (
        <Container>
          <Content>
            {this.state.selected && this.state.selected.map((post, i) => {
              if (post) {
                return <PostCardContainer navigation={this.props.navigation} key={i} post={post.properties} />
              }
            })}
          </Content>
        </Container>
    );
  }
}

