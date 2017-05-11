'use strict';
import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
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
  componentWillMount(){
    var imageRef = firebase.storage().ref('posts/dancing man');
    var vidRef = firebase.storage().ref('posts/video');

    imageRef.getDownloadURL().then((imageUrl) => {
      this.setState({image: imageUrl})
      // console.log('source', this.state.source);
    })

    vidRef.getDownloadURL().then((vidUrl)=> {
      this.setState({video: vidUrl})
      // console.log('source', this.state.source);
    })
  }
  render(){
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
    return (
      <View>
        <Video
          source={{uri: this.state.video}}
          style={{width: 300, height: 200}}
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
        />
        <Image
          style={{width: 200, height: 200}}
          source={{uri: this.state.image}}
        />
      </View>
    )
  }
}
