import React from 'react';
import {
  Text,
  View
} from 'react-native';

import Promise from 'bluebird';
import MapView from 'react-native-maps';
import supercluster from 'supercluster';
import * as firebase from 'firebase';
import {geoJSON} from '../database/GeoJSONPoints'
import Marker from './Marker';
import GeoFire from 'geofire'

const Points = geoJSON
const Marseille = {
  latitude: 40.704611,
  longitude: -74.008738,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,
}


export default class MapCluster extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mapLock: false,
      region: Marseille,
    }
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
          maxZoom: 20,
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
    onChangeRegionComplete(region) {
    this.setRegion(region);
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
      const markers = this.state.clusters["places"].getClusters([
        this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
        this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
        this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
      ], this.getZoomLevel());
      const returnArray = [];
      const { clusters, region } = this.state;
      const onPressMaker = this.onPressMaker.bind(this);
      markers.map(function(element ) {
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
    const geofirePoints = {}
    const postIds = []
    const finalClusterArr = []
    const limit = data.feature.properties.point_count

    const clusterRef = firebase.database().ref('geolocation');
    const geoJSONRef = firebase.database().ref('CurrentPosts');
    const geoFire = new GeoFire(clusterRef)
    const geoQuery = geoFire.query({
      center: [40.704980, -74.009],
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
    //this.props.navigation.navigate('ViewContainer', {finalClusterArr})
  }


  goToRegion(region, padding) {
    this.map.fitToCoordinates(region, {
      edgePadding: { top: padding, right: padding, bottom: padding, left: padding },
      animated: true,
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <MapView
          ref={ref => { this.map = ref; }}
          style={{
            flex: 1,
          }}
          initialRegion={Marseille}
          onRegionChange={this.onChangeRegion.bind(this)}
          onRegionChangeComplete={this.onChangeRegionComplete.bind(this)}
         >
          {
            this.createMarkersForRegionPlaces()
          }
         </MapView>
      </View>
    );
  }
}
