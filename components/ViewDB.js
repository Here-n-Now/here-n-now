'use strict';
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import * as firebase from 'firebase';

export default class ViewDB extends Component {
  constructor(props){
    super(props)
    this.state = {
      image: 'something',
      video: 'another thing'
    }
  }
  // componentWillMount(){
  //   var imageRef = firebase.storage().ref('posts/dancing man');
  //   var vidRef = firebase.storage().ref('posts/video');
  //   var postsRef = firebase.storage().ref('posts');

  //   postsRef.getDownloadURL().then((imageUrl) => {
  //     this.setState({image: imageUrl})
  //     // console.log('source', this.state.source);
  //   })

    // imageRef.getDownloadURL().then((imageUrl) => {
    //   this.setState({image: imageUrl})
    //   // console.log('source', this.state.source);
    // })

    // vidRef.getDownloadURL().then((vidUrl)=> {
    //   this.setState({video: vidUrl})
    //   // console.log('source', this.state.source);
    // })

  render(){
    console.log('props', this.props.navigation.state.params)
    console.log('typeof', typeof this.props.navigation.state.params.imageURL)
    // var storage = firebase.storage();
//     var pathReference = storage.ref('posts/dancing%20man.jpg');
//     // Create a reference from a Google Cloud Storage URI
//     var gsReference = storage.refFromURL('gs://we-ward-872a3.appspot.com/posts/dancing%20man.jpg')
//     // Create a reference from an HTTPS URL
//     // Note that in the URL, characters are URL escaped!
//     storageRef.child('images/stars.jpg').getDownloadURL().then(function(url) {
//  // Or inserted into an <img> element:
//       var img = document.getElementById('myimg');
//       img.src = url;
//     })
  return typeof this.props.navigation.state.params.imageURL === 'string' ?
    ( <View>
        <Image
          style={styles.image}
          source={{uri: this.props.navigation.state.params.imageURL}}
        />
      </View>)
    : (<Video
          source={{uri: this.props.navigation.state.params.videoURL}}
          style={styles.fullScreen}
          rate={this.state.rate}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          ignoreSilentSwitch={this.state.ignoreSilentSwitch}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onBuffer={this.onBuffer}
          onProgress={this.onProgress}
          repeat={true}
        />)
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image:{
    height: 400,
    width: 250
  }
});
