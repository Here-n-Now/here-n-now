'use strict';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, AlertIOS, Image } from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab, Footer } from 'native-base';

import { firebaseApp } from '../Nav';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob'
const fs = RNFetchBlob.fs

export default class PostPic extends Component {
  static navigationOptions = {
    header: null
  }

  postToFirebaseDB = (imageURL, text = '') => {
    const postId = Math.random().toString().split('.')[1];
    const database = firebaseApp.database();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        firebaseApp.database().ref('posts/' + postId).set({
          id: postId,
          text: text,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          image: imageURL
        })
      }
    )
  }

  uploadNewImageToStorage = () => {
    const Blob = RNFetchBlob.polyfill.Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    const { image } = this.props.navigation.state.params
    const imageName = Math.random().toString();
    this.uploadImage(image, imageName)
  }

  uploadImage(image, imageName, mime = 'image/gif ') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios'
        ? image.replace('file://', '')
        : image
      let uploadBlob = null
      const imageRef = firebaseApp.storage().ref('posts').child(imageName)
      fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`})
      }).then(blob => {
        uploadBlob = blob
        return imageRef.put(blob, {contentType: mime})
      }).then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      }).then(imageURL => {
        resolve(imageURL)
        this.postToFirebaseDB(imageURL)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  render() {
    const { image } = this.props.navigation.state.params
    return (
      <Container>
        <Image source={{uri: image}} style={styles.backgroundImage} />
        <Fab
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            shadowColor: 'black',
            shadowOpacity: 1.0,
          }}
          position="topLeft"
          onPress={this.setModalVisible}>
          <Icon name="ios-close-circle-outline" />
        </Fab>
        <Fab
          position="topRight"
          onPress={this.uploadNewImageToStorage}>
        <Icon name="md-send" />
        </Fab>
      </Container>
    )
  }
}

// <View style={styles.form}>
//   <Item>
//       <Input placeholder='Add a caption' style={styles.form}/>
//   </Item>
// </View>

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  fab: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white',
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
});
