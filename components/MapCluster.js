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

const Points = geoJSON
const Marseille = {
  latitude: 43.2931047,
  longitude: 5.38509780000004,
  latitudeDelta: 0.0922 / 1.2,
  longitudeDelta: 0.0421 / 1.2,
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
      console.log('data', data)
    if (data.options.isCluster) {
      if (data.options.region.length > 0) {
        console.log('region', data.options.region)
        this.goToRegion(data.options.region, 100)
      } else {
        console.log("We can't move to an empty region");
      }
    } else {

    }
    return;
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
