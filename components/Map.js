import React, { Component } from 'react';
import {View, StyleSheet, Linking, Modal} from 'react-native'
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab } from 'native-base';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';
import GoogleSearch from './GoogleSearch'

export default class MapComp extends Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-map-outline' android="ios-map-outline" style={{color: tintColor}} />
      )
    }
  constructor(props) {
    super(props)
    this.state = {
      markers: [
        {id: 1, photo: require('../public/images/thdancingman.gif'), coords: {latitude: 40.7128, longitude: -74.0041}, title: "Marker 1", description: 'Marker 1 script'},
        {id: 2, photo: require('../public/images/thdancingman.gif'), coords: {latitude: 40.7138, longitude: -74.0077}, title: "Marker 2", description: 'Marker 2 script'},
        {id: 3, photo: require('../public/images/giphy.gif'), coords: {latitude: 40.7218, longitude: -73.9791}, title: "Marker 3", description: 'Marker 3 script'},
        {id: 4, photo: require('../public/images/giphy.gif'), coords: {latitude: 40.7048, longitude: -74.0131}, title: "Marker 4", description: 'Marker 4 script'},
        {id: 5, photo: require('../public/images/thdancingman.gif'), coords: {latitude: 37.3130, longitude: -122.0423}, title: "Marker 5", description: 'Marker 5 script'},
        {id: 6, photo: require('../public/images/giphy.gif'), coords: {latitude: 37.3530, longitude: -122.0323}, title: "Marker 6", description: 'Marker 6 script'},
      ],
      modalVisible: false,
    }
  }

    onRegionChange = (region) => {
      this.setState({region})
    }

    setModalVisible = () => {
      this.setState({modalVisible: !this.state.modalVisible})
    }

    onSearch = (coords) => {
      this.setState({region: {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }})
    }
  componentWillMount(){
    var markerRef = firebase.database().ref('posts');
      markerRef.on('value', (snapshot) => {
      console.log('snapshot', snapshot.val())
      this.setState({markers: snapshot.val()})
    });
  }

  componentDidMount() {
    ////we may not need this??
    ////we probably only need the delta info from here
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
            }
          })
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  render(){
    // console.log('after mount state', this.state)
    return (
      <Container style={styles.container}>
            <MapView
              style={styles.map}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
              showsUserLocation={true}
              >
              {Object.keys(this.state.markers).map(markerId => {
                let marker = this.state.markers[markerId]
                return (
                <MapView.Marker
                  key={marker.id}
                  coordinate={marker.coords}
                  identifier={'https://www.youtube.com/watch?v=kaWkfpk3rbg'}
                  onSelect={() => {
                    this.props.navigation.navigate('viewPost', {imageURL: marker.image, videoURL: marker.video})
                  }}
                  // onSelect={evt => console.log('Select', evt.nativeEvent)}
                  // onSelect={() => console.log('Nav', this.props)}
                  // onCalloutPress={evt => Linking.openURL(evt.nativeEvent.id)}
                  >
                  {/*<MapView.Callout>
                    <Image source={marker.photo} />
                    <Text>{marker.title}</Text>
                    <Text>{marker.description}</Text>
                  </MapView.Callout>*/}
                </MapView.Marker>
              )
              })}
            </MapView>
            <View style={{pointerEvents: 'none'}}>
                <Fab
                  style={{ backgroundColor: '#5067FF' }}
                  position="topRight"
                  onPress={this.setModalVisible}>
                  <Icon name="ios-search-outline" />
              </Fab>
          </View>
            <Modal
              animationType={"fade"}
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}
              >
              <GoogleSearch onSearch={this.onSearch} setModalVisible={this.setModalVisible} />
              <Button
                full
                danger
                onPress={this.setModalVisible}
                >
                  <Text>Cancel Search</Text>
              </Button>
            </Modal>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  marker: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    overflow: 'hidden'
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  }
})
