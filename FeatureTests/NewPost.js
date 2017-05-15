'use strict';

import React, { Component } from 'react';
import {View, StyleSheet, Button, Linking, Text, TouchableOpacity} from 'react-native';
const styles = {captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  }
}

export default class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log('Position in NewPost: ',position)
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
        })
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render(){
    console.log('props in New Post', this.props)
    return (
      <View  style={{padding: 10}}>
        <Text>NewPost Location</Text>
        <Text>latitude: {this.state.latitude}</Text>
        <Text>longitude: {this.state.longitude}</Text>

        <TouchableOpacity
                  style={styles.captureButton}1q
                  onPress={console.log('On press in NewPost')}
              >

              </TouchableOpacity>
      </View>
    )
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
