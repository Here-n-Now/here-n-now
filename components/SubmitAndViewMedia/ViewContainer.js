'use strict';
import React, { Component } from 'react';
import { Modal, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Fab, Header, Title, Left, Right, Body, Text, ListItem, Footer, Grid, Col } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { firebaseApp } from '../../Home';
import * as firebase from 'firebase';

import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import ViewComments from '../ViewComments';
import styles from '../style/app';

export default class ViewContainer extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      comment: '',
      userName: '',
      comments: [],
      postArr: []
    };
  }

  // componentDidMount() {
  //   let postArr = []
  //   console.log(this.props.navigation.state.params)
  //   this.props.navigation.state.params.finalClusterArr.forEach(post => postArr.push(Object.values(post)[0].properties))
  //   this.setState({postArr})
  // }

  postToFirebaseDB = () => {
    if (!this.state.comment.length) return;
    const { id } = this.props.navigation.state.params;
    const user = firebase.auth().currentUser;
    const database = firebaseApp.database();
    const firebaseRef = firebase.database().ref()
    const commentId = firebaseRef.push().key
    navigator.geolocation.getCurrentPosition(
      (position) => {
        firebaseApp.database().ref('posts/' + id + '/comments').update({
            [commentId]: {
              uid: user.uid,
              photoURL: user.photoURL,
              displayName: user.displayName,
              comment: this.state.comment,
              postedAt: firebase.database.ServerValue.TIMESTAMP
          }
        })
        .then(() => this.setState({comment: ''}))
      }
    )
  }

  getFromFirebaseDB = () => {
    const { id } = this.props.navigation.state.params;
    const user = firebase.auth().currentUser;
    this.query = firebase.database().ref('posts/' + id + '/comments');
    this.query.on('value', (snapshot) => {
      let comments = snapshot.val();
      //if not null, comments will get reversed array of comments
      comments = comments && Object.entries(comments).reverse();
      this.setState({ comments });
    });
  }

  ComponentWillUnmount(){
    this.query.off('value')
  }

  render() {
    const { video, image, text } = this.props.navigation.state.params.post;
    const { modalVisible, comments, comment } = this.state;
    return  (
      <View style={{flex: 1}}>
        {video ? <ViewVideo video={video} /> : <ViewImage image={image} />}
        <Fab
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            shadowColor: 'black',
            shadowOpacity: 1.0,
          }}
          position="topLeft"
          onPress={
            () => this.props.navigation.dispatch(NavigationActions.back({}))
          }>
          <Icon name="md-close-circle" />
        </Fab>
        <Fab
          position="bottomLeft"
          onPress={
            () => {
              this.getFromFirebaseDB();
              this.setState({modalVisible: true});
            }
          }>
          <Icon name="md-chatboxes" />
        </Fab>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <Header>
              <Left>
                  <Button transparent onPress={() => this.setState({modalVisible: false})}>
                      <Icon name='close' />
                  </Button>
              </Left>
              <Body>
                  <Title>Comments</Title>
              </Body>
              <Right />
          </Header>
            <Content>
              {!!text && <Text style={{margin:15}}>{text}</Text>}
            <ListItem itemDivider>
              <Text>{comments ? comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment` : 'No comments'}</Text>
            </ListItem>
              {comments && comments.map((comment) => <ViewComments comment={comment}/>)}
            </Content>
          <Footer>
          <Content>
          <Grid>
              <Col size={75}>
                <Item>
                    <Input
                      onChangeText={(comment) => this.setState({comment})}
                      value={comment}
                      placeholder='Leave a comment...'
                    />
                </Item>
              </Col>
              <Col size={25}>
                <Button block onPress={ this.postToFirebaseDB } >
                  <Text>Share</Text>
                </Button>
              </Col>
          </Grid>
          </Content>
          </Footer>
        </Modal>
      </View>)
  }
}

// <View style={[styles.form, {pointerEvents: 'none'}]}>
//   <Text>What up?</Text>
// </View>

// <Fab
//   style={{
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     shadowColor: 'black',
//     shadowOpacity: 1.0,
//   }}
//   position="topRight"
//   onPress={this.setModalVisible}>
// <Icon name="ios-happy-outline" />
// </Fab>
