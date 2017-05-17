import React, { Component } from 'react';
import { firebaseApp } from '../../Home';
import { Text, Icon } from 'native-base'

const { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');

// const fullStack = {description: 'FullStack', geometry: { location: { lat: 40.704980, lng: -74.009133 } }};
import {
    TextInput,
    View,
    AppRegistry,
    ListView,
    TouchableHighlight,
    AlertIOS,
    Modal
} from 'react-native';


class GoogleSearch extends Component {

    constructor(props) {

        super(props);

        this.state = {
            user: {},
            places: [],

        };
    }

    componentWillMount() {

        firebaseApp.auth().onAuthStateChanged(user => {

            if (user) {
                let placesArr = [];
                let placeData =  firebaseApp.database().ref('users/' + user.uid + '/places');

                placeData.on("value", (snapshot) => {
                    snapshot.forEach(child => {
                        let cval = child.val();
                        placesArr.push(cval);
                        this.setState({ places: placesArr });
                    });
                });

                this.setState({ user: user });
                // console.log("place set?? ", this.state.places);
                var placeList = this.state.places;
            } else {
                console.log('why did this happen... :0');
            }

        });
    }

    onClickStorePlace = (place, loc) => {
        let geo = loc.geometry.location;

        let user = firebaseApp.auth().currentUser;

        firebaseApp.database().ref('users/'+ user.uid + '/places/' + place.id).set({
            description: place.description,
            geometry: {
                location: geo
            }
        });

        let placesArray = this.state.places;
        let placeData =  firebaseApp.database().ref('users/' + user.uid + '/places');

        placeData.on("value", (snapshot) => {
            snapshot.forEach(child => {
                let cval = child.val();
                placesArray.push(cval);
                this.setState({ places: placesArray });
            });
        });

    };

    render() {
        if (this.state.places.length > 0) {
            console.log("places", this.state.places)
        }
        if (this.refs.child) {
            this.refs.child._disableRowLoaders();
        }
        return (
            <GooglePlacesAutocomplete
                ref="child"
                placeholder="Search by location"
                minLength={2}
                autoFocus={true}
                listViewDisplayed={true}
                fetchDetails={true}
                renderDescription={row => row.description}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    this.props.onSearch(details.geometry.location);
                    this.props.setModalVisible();
                    this.onClickStorePlace(data, details);


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

                predefinedPlacesAlwaysVisible={true}
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
                predefinedPlaces={ this.state.places.length > 0 && this.state.places }
                // renderLeftButton={() => <Icon name="ios-search-outline" />}
                // renderRightButton={() => <Text>Cancel</Text>}
            />
        );
    }
}

export default GoogleSearch;
