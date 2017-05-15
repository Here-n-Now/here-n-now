import React, {Component} from 'react';
import * as firebase from 'firebase';
import MapCluster from './MapCluster'

export default class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          markers: []
        }
    }
    componentWillMount(){
    var markerRef = firebase.database().ref('geoJSON')
      markerRef.on('value', (snapshot) => {
      this.setState({markers: snapshot.val()})
    });
    }
    render(){
      return(
        <MapCluster mapOther={this.state.markers} mapPoints={Object.values(this.state.markers)} />
      )
    }
}
