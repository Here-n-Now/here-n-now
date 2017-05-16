import React, { Component } from 'react';
import { View, StyleSheet, Modal} from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab } from 'native-base';
import Promise from 'bluebird';
import MapView from 'react-native-maps';
import supercluster from 'supercluster';
import * as firebase from 'firebase';
//import {geoJSON} from '../database/GeoJSONPoints'
import Marker from './Marker';
import GeoFire from 'geofire'
import GoogleSearch from './GoogleSearch'

// const Points = geoJSON
const Fullstack = {
  latitude: 40.704980,
  longitude: -74.009,
  latitudeDelta: 0.0922, /// 1.2,
  longitudeDelta: 0.0421 /// 1.2,
}


export default class MapCluster extends Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-map-outline' android="ios-map-outline" style={{color: tintColor}} />
      )
    }

  constructor(props){
    super(props)
    this.state = {
      mapLock: false,
      region: Fullstack,
      // markers: {},
      // markersArr: [],
      modalVisible: false,
    }
    // this.onChangeRegion = this.onChangeRegion.bind(this)
    // this.onChangeRegionComplete = this.onChangeRegionComplete.bind(this)
  }

  onRegionChange = (region) => {
   this.setState({region})
  }

  setModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  // onSearch = (coords) => {
  //   this.setState({region: {
  //     latitude: coords.lat,
  //     longitude: coords.lng,
  //     latitudeDelta: 0.001,
  //     longitudeDelta: 0.001
  //   }})
  // }
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
  // componentDidMount() {
  //   var markerRef = firebase.database().ref('posts')
  //     markerRef.on('value', (snapshot) => {
  //     this.setState({markers: snapshot.val()})
  //   });
  // }
  setRegion(region) {
    if(Array.isArray(region)) {
      region.map(function(element) {
        if (element.hasOwnProperty("latitudeDelta") && element.hasOwnProperty("longitudeDelta")) {
          region = element;
          return;
        }
      })
    }
    if (!Array.isArray(region)) {
      this.setState({
        region: region
      });
    } else {
      console.log("We can't set the region as an array");
    }
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
    console.log('after mount')
  }

  createMarkersForLocations(props) {
    console.log('props',props)
    return {
      places: props.mapPoints
    };
  }
  componentWillReceiveProps(nextProps) {
    const markers = this.createMarkersForLocations(nextProps);
    if (markers && Object.keys(markers)) {
      const clusters = {};
      this.setState({
        mapLock: true
      });
      Object.keys(markers).forEach(categoryKey => {
        // Recalculate cluster trees
        const cluster = supercluster({
          radius: 60,
          maxZoom: 16,
        });

        cluster.load(markers[categoryKey]);

        clusters[categoryKey] = cluster;
      });

      this.setState({
        clusters,
        mapLock: false
      });
    }
  }
  onChangeRegionComplete(coords) {
    this.setRegion({latitude: coords.lat,
      longitude: coords.lng,
      latitudeDelta: 0.0922 / 1.2,
      longitudeDelta: 0.0421 / 1.2
    })
    this.setState({
      moving: false,
    });
  }

  onChangeRegion(region) {
    this.setState({
      moving: true,
    });
  }

  getZoomLevel(region = this.state.region) {
    const angle = region.longitudeDelta;
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }

  createMarkersForRegionPlaces() {
    const padding = 0.25;
    if (this.state.clusters && this.state.clusters["places"]) {
      console.log('state', this.state)
      const markers = this.state.clusters["places"].getClusters([
        this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
        this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
      ], this.getZoomLevel());
      const returnArray = [];
      const { clusters, region } = this.state;
      const onPressMaker = this.onPressMaker.bind(this);
      markers.map(function(element) {
        console.log('element', element)
        returnArray.push(
            <Marker
              key={element.properties._id || element.properties.cluster_id}
              onPress={onPressMaker}
              feature={element}
              clusters={clusters}
              region={region}
            />
        );
      });
      return returnArray;
    }
    return [];
  }

  onPressMaker(data) {
    console.log('data', data)
    const geofirePoints = {}
    const postIds = []
    const finalClusterArr = []
    const limit = data.feature.properties.point_count
    const clusterCoords = data.feature.geometry.coordinates

    const clusterRef = firebase.database().ref('geolocation');
    const geoJSONRef = firebase.database().ref('CurrentPosts');
    const geoFire = new GeoFire(clusterRef)
    const geoQuery = geoFire.query({
      center: [clusterCoords[1], clusterCoords[0]],
      radius: 100
    })
    geoQuery.on('key_entered', (key, location, distance) => {
      if (!geofirePoints[distance]){
        geofirePoints[distance] = [key]
      } else {
        geofirePoints[distance] = [...geofirePoints[distance], key]
      }
    })
    const distanceKeys = Object.keys(geofirePoints)
    for (let i = 0; i < distanceKeys.length; i++) {
      postIds.push(...geofirePoints[distanceKeys[i]])
      if (postIds.length >= limit) {
        break
      }
    }
    for (let j = 0; j < postIds.length; j++){
      geoJSONRef.orderByChild('properties/_id').equalTo(`${postIds[j]}`).on('value', (snapshot) => {
        finalClusterArr.push(snapshot.val())
      })
    }
    console.log('postIds', postIds, 'distance keys', distanceKeys)
    console.log('final Array', finalClusterArr)
    //this.props.navigation.navigate('ViewContainer', {finalClusterArr})
  }


  goToRegion(region, padding) {
    this.map.fitToCoordinates(region, {
      edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
      animated: true,
    });
  }

  render() {
    // const markersArr = []
    // const geofireRef = firebase.database().ref('geolocation');
    // const geoFire = new GeoFire(geofireRef);
    // const geoQuery = geoFire.query({
    //   center: [this.state.region.latitude, this.state.region.longitude],
    //   radius: 5
    // });
    // if (this.state.markers){
    //   geoQuery.on("key_entered", (key, location, distance)=>{
    //       if (this.state.markers[key]){ markersArr.push(this.state.markers[key]) }
    // })}
    return (
      <Container style={styles.container}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={Fullstack}
          // region={this.state.region}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          // onRegionChange={this.onChangeRegion.bind(this)}
          // onRegionChangeComplete={this.onChangeRegionComplete.bind(this)}
         >
          {
            this.createMarkersForRegionPlaces()
          }
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
          <GoogleSearch onSearch={
            // this.onSearch
            // this.onChangeRegion
            this.onChangeRegionComplete
          } setModalVisible={this.setModalVisible} />
          <Button
            full
            danger
            onPress={this.setModalVisible}
          >
            <Text>Cancel Search</Text>
          </Button>
        </Modal>
      </Container>
    );
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
