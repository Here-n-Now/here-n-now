import React, { Component } from 'react';
import { firebaseApp } from '../Home';
import { Text, Icon } from 'native-base'

const { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');

const fullStack = {description: 'FullStack', geometry: { location: { lat: 40.704980, lng: -74.009133 } }};

class GoogleSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                const userPlaces = firebaseApp.database().ref('users/'+ user.uid + '/places');
                this.setState({ user: user });
            } else {
                console.log('why did this happen... :0');
            }
        });
    }

    onClickStorePlace = (place) => {

        let user = firebaseApp.auth().currentUser;

        firebaseApp.database().ref('users/'+ user.uid + '/places/' + place.description).set({
                id: place.id,
                pId: place.place_id
        });
        let placeData =  firebaseApp.database().ref('users/' + user.uid).orderByChild('places');
        console.log('all  the name here??: ', placeData);

    };

  render() {
    return (

      <GooglePlacesAutocomplete
        placeholder="Search by location"
        minLength={2}
        autoFocus={true}
        listViewDisplayed="auto"
        fetchDetails={true}
        renderDescription={row => row.description}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          this.props.onSearch(details.geometry.location);
          this.props.setModalVisible();
          this.onClickStorePlace(data);
          console.log("data: ", data.description);
          console.log("user: ", this.state.user);
          // console.log("places????????: ", firebaseApp);
        }}

        getDefaultValue={() => {
          // text input default value
          return '';
        }}

        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyA1-0UvhC1C4ErCbeu01RriQSNrWPX3Wyw', //probably should hide this...
          language: 'en', // language of the results
          types: 'geocode', // default: 'geocode'
        }}

        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
        }}

        currentLocation={true} // Not currently working... Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}

        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        // predefinedPlaces={ [}
        // renderLeftButton={() => <Icon name="ios-search-outline" />}
        // renderRightButton={() => <Text>Cancel</Text>}
      />
    );
  }
}

export default GoogleSearch;
