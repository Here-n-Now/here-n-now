import React, {Component} from 'react';
import * as firebase from 'firebase';
import Map from './Map'
import {Icon} from 'native-base'

export default class MapContainer extends Component {
    static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-map-outline' android="ios-map-outline" style={{color: tintColor}} />
      )
    }
    constructor(props) {
        super(props);
        this.state = {
          markers: []
        }
    }
    componentWillMount(){
    var markerRef = firebase.database().ref('CurrentPosts')
      markerRef.on('value', (snapshot) => {
      this.setState({markers: snapshot.val()})
    });
    }
    render(){
      return(
        <Map mapPoints={Object.values(this.state.markers)} navigation={this.props.navigation.navigate} />
      )
    }
}
