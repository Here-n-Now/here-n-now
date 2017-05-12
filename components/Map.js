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
      markers: {},
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
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }})
    }
  componentWillMount(){
    var markerRef = firebase.database().ref('posts')
      markerRef.on('value', (snapshot) => {
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
            latitudeDelta: 0.001,
            longitudeDelta: 0.001
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
                    if (marker.image || marker.video){
                      this.props.navigation.navigate('ViewPost', {imageURL: marker.image, videoURL: marker.video})
                    } else this.props.navigation.navigate('LiveViewer', {liveVideoURL: marker.stream})
                  }}
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
