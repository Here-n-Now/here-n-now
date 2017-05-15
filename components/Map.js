import React, { Component } from 'react';
import {View, StyleSheet, Linking, Modal} from 'react-native'
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab } from 'native-base';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';
import GoogleSearch from './GoogleSearch'
import GeoFire from 'geofire'
import geofire from '../geofireTest'
//import geofire from '../geofireTest'
import supercluster from 'supercluster'
import {geoJSON} from '../database/GeoJSONPoints'


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
      markersArr: [],
      modalVisible: false,
      region: {
        latitude: 40,
        longitude: -74,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
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

  componentDidMount() {
    ////we may not need this??
    ////we probably only need the delta info from here
  var markerRef = firebase.database().ref('posts')
    markerRef.on('value', (snapshot) => {
    this.setState({markers: snapshot.val()})
  });
  }

  render(){
    const markersArr = []
    const geofireRef = firebase.database().ref('geolocation');
    const geoFire = new GeoFire(geofireRef);
    const geoQuery = geoFire.query({
      center: [this.state.region.latitude, this.state.region.longitude],
      radius: .25
    });
    if (this.state.markers){
      geoQuery.on("key_entered", (key, location, distance)=>{
          if (this.state.markers[key]){ markersArr.push(this.state.markers[key]) }
    })}



  // const cl = supercluster([
  //   { lat: 10, lng: 10 },
  //   { lat: 10.1, lng: 10.1 },
  //   { lat: 12, lng: 12 },
  //   { lat: 84, lng: 179 },
  // ]);

  // const r = cl({ bounds: { nw: { lat: 85, lng: -180 }, se: { lat: -85, lng: 180 } }, zoom: 2 });

  var index = supercluster({radius: 40, maxZoom: 16}).load(geoJSON);

  // get GeoJSON clusters given a bounding box and zoom
  var clusters = index.getClusters([-180, -85, 180, 85], 2);

  // get a JSON vector tile in the same format as GeoJSON-VT
  var tile = index.getTile(7, 523, 125);

    return (
      <Container style={styles.container}>
            <MapView
              style={styles.map}
              region={this.state.region}
              onRegionChange={this.onRegionChange}
              showsUserLocation={true}
              >
              {
                markersArr.map(marker => {
              return (
                <MapView.Marker
                  key={marker.id}
                  coordinate={marker.coords}
                  onSelect={() => {
                    if (marker.image || marker.video){
                      this.props.navigation.navigate('ViewContainer', {text: marker.text, image: marker.image, video: marker.video})
                    } else this.props.navigation.navigate('LiveViewer', {liveVideoURL: marker.stream})
                  }}
                  >
                </MapView.Marker>
              )
            })}
            </MapView>
            <View>
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

                  {/*<MapView.Callout>
                    <Image source={marker.photo} />
                    <Text>{marker.title}</Text>
                    <Text>{marker.description}</Text>
                  </MapView.Callout>*/}


