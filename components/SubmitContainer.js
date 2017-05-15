'use strict';
import React, { Component } from 'react';
import { Platform, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Title, Text, Fab, Header, Left, Right, Body, Spinner, Toast, H2 } from 'native-base';

import Video from 'react-native-video';
import { NavigationActions } from 'react-navigation';

import { firebaseApp } from '../Home';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import GeoFire from 'geofire';

import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import styles from './style/app';

const fs = RNFetchBlob.fs;

export default class PostVideo extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      modalVisible: false,
      text: '',
      finalText: ''
    };
  }

  uploadToStorage = () => {
    this.setState({uploading: true});
    const { video, image } = this.props.navigation.state.params;
    let mediaLocalUrl = video || image;
    const Blob = RNFetchBlob.polyfill.Blob;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    const mediaId = Math.random().toString();
    this.uploadMedia(mediaLocalUrl, mediaId);
  }

  uploadMedia(mediaLocalUrl, mediaId) {
    const { video, image } = this.props.navigation.state.params;
    let mime = video ? 'video/mp4' : 'image/gif';
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios'
        ? mediaLocalUrl.replace('file://', '')
        : mediaLocalUrl;
      let uploadBlob = null;
      const mediaLocalUrlRef = firebaseApp.storage().ref('posts').child(mediaId);
      fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
      }).then(blob => {
        uploadBlob = blob;
        return mediaLocalUrlRef.put(blob, {contentType: mime});
      }).then(() => {
        uploadBlob.close();
        return mediaLocalUrlRef.getDownloadURL();
      }).then(mediaUrl => {
        resolve(mediaUrl);
        this.postToFirebaseDB(mediaUrl);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  postToFirebaseDB = (mediaUrl, text = '') => {
    const { video, image } = this.props.navigation.state.params;
    let mediaType = video ? 'video' : 'image';
    const geofireRef = firebase.database().ref('geolocation');
    // //Points to firebase root
    const firebaseRef = firebase.database().ref(); //was a '.push()'?
    // //Points to posts folder
    const postsRef = firebase.database().ref('posts')
    // //Creates new geofire instance
    const geoFire = new GeoFire(geofireRef);
    const myId = `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}:${firebaseRef.push().key}`
    const database = firebaseApp.database();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        geoFire.set(myId, [position.coords.latitude, position.coords.longitude]);
        firebaseApp.database().ref('geoJSON/' + myId).set({
            "type": "Feature",
            "properties": {
              "_id": myId,
              "featureclass": "A",
              "text": this.state.finalText,
              [mediaType]: mediaUrl,
              "user_id": firebaseApp.auth().currentUser.uid,
              "postedAt": firebase.database.ServerValue.TIMESTAMP
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                position.coords.longitude,
                position.coords.latitude
              ]
            }
          // id: myId,
          // coords: {
          //   latitude: position.coords.latitude,
          //   longitude: position.coords.longitude
          // },
          // [mediaType]: mediaUrl
        })
      }
    )
    this.forceUpdate()
    this.props.navigation.navigate('View');
    Toast.show({
      text: `Yay! Your ${mediaType} is up!`,
      position: 'bottom',
      type: 'success',
      duration: 3000
    })
  }

  content = () => {
    const { video, image } = this.props.navigation.state.params
    return(
      <Container>
        {
          //this fixes the video playing in the background issue
          !this.state.uploading &&
          (video ? <ViewVideo video={video} /> : <ViewImage image={image} />)
        }
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
          <Icon name="ios-close-circle-outline" />
        </Fab>
        <Fab
          position="topRight"
          onPress={this.uploadToStorage}>
          <Icon name="md-send" />
        </Fab>
        <Fab
          position="bottomLeft"
          style={this.state.finalText ? {backgroundColor:'green'} : {backgroundColor:'black'}}
          onPress={
            () => {this.setState({modalVisible: true})}
          }>
          <Icon name="md-chatboxes" />
        </Fab>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <Header>
              <Left>
                  <Button transparent onPress={() => this.setState({modalVisible: false})}>
                      <Icon name='close' />
                  </Button>
              </Left>
              <Body>
                  <Title>Caption</Title>
              </Body>
              <Right>
                <Button transparent onPress={() => this.setState({
                    modalVisible: false,
                    finalText: this.state.text
                  })}>
                    {!!this.state.text && <Icon name='ios-checkbox' />}
                </Button>
              </Right>
          </Header>
            <Content>
                <TextInput
                  placeholder='Say something about this post'
                  style={{height:350}}
                  multiline={true}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                />
            </Content>
        </Modal>
      </Container>
    )
  }

  render() {
    console.log('id',firebase.database.ServerValue.TIMESTAMP)
    const content =
      this.state.uploading ?
        <View>
          <Spinner style={{marginTop:100}}/>
          <H2 style={{textAlign: 'center'}}>Uploading</H2>
        </View>
      :
        this.content()
    return content;
  }
}
// <View style={styles.formVid}>
//   <Item>
//       <Input placeholder='Add a caption' style={styles.form}/>
//   </Item>
// </View>
