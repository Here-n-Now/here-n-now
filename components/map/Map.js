import React, { Component } from 'react';
import { View, StyleSheet, Modal} from 'react-native';
import { Icon, Header, Left, Text, Button, Right, Body, Title, Container, Content, Input, Item, Fab } from 'native-base';
import * as firebase from 'firebase';
import GeoFire from 'geofire'
import MapView from 'react-native-maps';
import supercluster from 'supercluster';
import Marker from './Marker';
import SearchModal from './SearchModal'

const defaultRegion = {
  latitude: 40.704980,
  longitude: -74.009133,
  latitudeDelta: 0.001,//0.0922,
  longitudeDelta: 0.001 //0.042
}

export default class Map extends Component {

  constructor(props){
    super(props)
    this.state = {
      region: defaultRegion,
      mapLock: false,
      modalVisible: false,
    }
    // this.props.navigation = this.props.navigation.bind(this)
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

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  setModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  onRegionChange = (region) => {
   this.setState({region})
  }

  onChangeRegion = (region) => {
    this.setState({
      moving: true,
    });
  }

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
    }
  }

  onChangeRegionComplete = (coords) => {
    this.setRegion({latitude: coords.lat,
      longitude: coords.lng,
      latitudeDelta: 0.0922 / 1.2,
      longitudeDelta: 0.0421 / 1.2
    })
    this.setState({
      moving: false,
    });
  }

  getZoomLevel(region = this.state.region) {
    const angle = region.longitudeDelta;
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }

  createMarkersForLocations(props) {
    return {
      places: props.mapPoints
    };
  }

  createMarkersForRegionPlaces() {
    const padding = 0.25;
    if (this.state.clusters && this.state.clusters["places"]) {
      const markers = this.state.clusters["places"].getClusters([
        this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
        this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
      ], this.getZoomLevel());
      const returnArray = [];
      const { clusters, region } = this.state;
      const onPressMaker = this.onPressMaker.bind(this);
      const navigation = this.props.navigation
      markers.map(function(element) {
        returnArray.push(
            <Marker
              key={element.properties._id || element.properties.cluster_id}
              onPress={onPressMaker}
              feature={element}
              clusters={clusters}
              region={region}
              navigation={navigation}
            />
        );
      });
      return returnArray;
    }
    return [];
  }

  onPressMaker(data) {
    // 1. create query to geofire from cluster coordinate
    const geofireRef = firebase.database().ref('geolocation');
    const geoFire = new GeoFire(geofireRef)
    const clusterCoords = data.feature.geometry.coordinates
    const geoQuery = geoFire.query({
      center: [clusterCoords[1], clusterCoords[0]],
      radius: 100
    })
    // 2. put returned values on object by "distance" key and "postID" value
    const geofirePoints = {}
    geoQuery.on('key_entered', (key, location, distance) => {
      if (!geofirePoints[distance]){
        geofirePoints[distance] = [key]
      } else {
        geofirePoints[distance] = [...geofirePoints[distance], key]
      }
    })
    // 3. Push values from distance object onto new array limited to original cluster point value
    const postIds = []
    const postLimit = data.feature.properties.point_count
    const distanceKeys = Object.keys(geofirePoints)
    for (let i = 0; i < distanceKeys.length; i++) {
      postIds.push(...geofirePoints[distanceKeys[i]])
      if (postIds.length >= postLimit) {
        break
      }
    }
    // 4. send firebase query iterated with array with post IDs pushing each returned post onto final array
    const geoJSONRef = firebase.database().ref('CurrentPosts');
    const postCluster = []
    postIds.forEach(id => {
      geoJSONRef.orderByChild('properties/_id').equalTo(`${id}`).on('value', (snapshot) => {
        if (snapshot.val()) postCluster.push(snapshot.val())
      })
    })
    // 5. Navigate to feed view with final array of posts as props
    !!postCluster.length && this.props.navigation('Feed', {postCluster})
  }
  componentWillUnmount(){
    geoQuery.cancel();
  }
  render() {
    return (
      <Container style={styles.container}>
        <MapView
          style={styles.map}
          //showsUserLocation={true}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
         >
          {
            this.createMarkersForRegionPlaces()
          }
         </MapView>
          <SearchModal
           modalVisible={this.state.modalVisible}
           onChangeRegionComplete={this.onChangeRegionComplete}
           setModalVisible={this.setModalVisible}
         />
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




  // goToRegion(region, padding) {
  //   this.map.fitToCoordinates(region, {
  //     edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
  //     animated: true,
  //   });
  // }
          //ref={ref => { this.map = ref; }}

          // initialRegion={Fullstack}
          // region={this.state.region}
          // onRegionChange={this.onChangeRegion.bind(this)}
          // onRegionChangeComplete={this.onChangeRegionComplete.bind(this)}
