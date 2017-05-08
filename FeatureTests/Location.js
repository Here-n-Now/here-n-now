'use strict';
var React = require('react');
var ReactNative = require('react-native');
var { StyleSheet, Text, View, Button } = ReactNative;
exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Examples of using the Geolocation API.';
exports.examples = [
    {
        title: 'navigator.geolocation',
        render: function(): React.Element<any> {
            return <GeolocationExample />;
        },
    }
];

import MapComp from './Map'
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  marker: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    overflow: 'hidden'
  },
    title: {
        fontWeight: '500',
    },
})
export default class Location extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }
        }
    }
    render(){
        console.log('props', this.props)
        return (
            <MapComp navigation={this.props.navigation}/>
        )
    }
}

