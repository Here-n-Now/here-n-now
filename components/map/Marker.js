import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// import Expo from 'expo';
const offset_map_small = 0.0001;
import ImageMarker from '../../marker.png'
import MapView from 'react-native-maps';

export default class Marker extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      colorByCategory: {
        A: "green",
        I: "orange",
        S: "blue",
        V: "violet",
        "Cluster": "red"
      }
    }
  }

  onPress() {
    if (!this.props.feature.properties.featureclass) {
      const { region } = this.props;
      const category = this.props.feature.properties.featureclass || "Cluster";
      const angle = region.longitudeDelta || 0.0421 / 1.2;
      const result =  Math.round(Math.log(360 / angle) / Math.LN2);
      const markers = this.props.clusters["places"].getChildren(this.props.feature.properties.cluster_id, result);
      const newRegion = [];
      const smallZoom = 0.05;
      markers.map(function (element) {
        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] - region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] - region.longitudeDelta * smallZoom,
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1],
          longitude: offset_map_small + element.geometry.coordinates[0],
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] + region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] + region.longitudeDelta * smallZoom,
        });
      });
      const options = {
        isCluster: true,
        region: newRegion,
      };
      if (this.props.onPress) {
        this.props.onPress({
          type: category,
          feature: this.props.feature,
          options: options,
        });
      }
    }
    else {
      const post = this.props.feature.properties
      console.log('post', post)
      !!post && this.props.navigation('ViewContainer', {post})
    }
  }


  render() {
    const latitude = this.props.feature.geometry.coordinates[1];
    const longitude = this.props.feature.geometry.coordinates[0];
    const category = this.props.feature.properties.featureclass || "Cluster";
    const text = (category  == "Cluster" ? this.props.feature.properties.point_count : category);
    const size = 37;
    return (
      <MapView.Marker
        coordinate={{
          latitude,
          longitude,
        }}
        onPress={this.onPress.bind(this)}
        // onPress={()=> console.log('clicked')}
      >
        <Image
         style={{
            height: 30,
            width: 30,
            tintColor: this.state.colorByCategory[category],
          }}
          source={ImageMarker}
        />
        <View style={styles.view}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </MapView.Marker>
    );
  }
}


const styles = StyleSheet.create({
  image: {},
  view: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
  }
})
