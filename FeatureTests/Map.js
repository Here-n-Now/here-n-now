import React, { Component } from 'react';
import {View, StyleSheet, Button, Linking, Text, Image} from 'react-native'
import MapView from 'react-native-maps';

export default class MapComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // region: {
      //   latitude: 40.7128,
      //   longitude: -74.0093,
      //   latitudeDelta: 0.0522,
      //   longitudeDelta: 0.0321
      // },
      markers: [
        {id: 1, photo: require('../public/images/thdancingman.gif'), latlng: {latitude: 40.7128, longitude: -74.0041}, title: "Marker 1", description: 'Marker 1 script'},
        {id: 2, photo: require('../public/images/thdancingman.gif'), latlng: {latitude: 40.7138, longitude: -74.0077}, title: "Marker 2", description: 'Marker 2 script'},
        {id: 3, photo: require('../public/images/giphy.gif'), latlng: {latitude: 40.7218, longitude: -73.9791}, title: "Marker 3", description: 'Marker 3 script'},
        {id: 4, photo: require('../public/images/giphy.gif'), latlng: {latitude: 40.7048, longitude: -74.0131}, title: "Marker 4", description: 'Marker 4 script'},
        {id: 5, photo: require('../public/images/thdancingman.gif'), latlng: {latitude: 37.3130, longitude: -122.0423}, title: "Marker 5", description: 'Marker 5 script'},
        {id: 6, photo: require('../public/images/giphy.gif'), latlng: {latitude: 37.3530, longitude: -122.0323}, title: "Marker 6", description: 'Marker 6 script'},
      ]
    }
    // // instead of binding
    // switchFlash = () => {
    //   let newFlashMode;
    //   const { auto, on, off } = Camera.constants.FlashMode;
    // }
    this.onRegionChange = this.onRegionChange.bind(this)
  }
  onRegionChange(region){
    this.setState({region})
  }
  componentDidMount() {
    ////we may not need this??
    ////we probably only need the delta info from here

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log('position', position)
            this.setState({region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }})
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }
  render(){
    return (
      <View style={styles.container} >
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          showsUserLocation={true}
          >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.id}
              coordinate={marker.latlng}
              identifier={'https://www.youtube.com/watch?v=kaWkfpk3rbg'}
              onSelect={() => {
                this.props.navigation.navigate('RenderVideoTest')
              }}
              // onSelect={evt => console.log('Select', evt.nativeEvent)}
              // onSelect={() => console.log('Nav', this.props)}
              // onCalloutPress={evt => Linking.openURL(evt.nativeEvent.id)}
              >
              <MapView.Callout>
                <Image source={marker.photo} />
                <Text>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        <Button
          title= "Post"
          onPress={() => {console.log('clicked')}}
        />
        </MapView>
      </View>
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
