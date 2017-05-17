import React, { Component } from 'react';
import { firebaseApp } from '../../Home';
import { Text, Icon } from 'native-base'

const { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');



class GoogleSearch extends Component {

    constructor(props) {

        super(props);

        this.state = {
            user: {},
            places: [],
            currentLocation: {}

        };
    }

    componentWillMount() {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                return this.setState({
                    currentLocation: {
                        description: 'Current Location',
                        geometry: {
                            location: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        }
                    }
                }, ()=>{
                    console.log("location yet?", this.state.currentLocation);
                    firebaseApp.auth().onAuthStateChanged(user => {

                        if (user) {
                            let placesArr = [this.state.currentLocation];
                            let placeData = firebaseApp.database().ref('users/' + user.uid + '/places');

                            placeData.on("value", (snapshot) => {
                                snapshot.forEach(child => {
                                    let cval = child.val();
                                    placesArr.push(cval);
                                    this.setState({places: placesArr});
                                });
                            });

                            let cur = this.state.currentLocation;
                            let pla = this.state.places;
                            if (pla.length == 0 || pla[0].description != "Current Location") {
                                pla.unshift(cur);

                            }
                            this.setState({places: pla});
                            this.setState({user: user});

                        } else {
                            console.log('why did this happen... :0');
                        }

                    });
                })
            }
        );
    }


    onClickStorePlace = (place, loc) => {
        let geo = loc.geometry.location;

        let user = firebaseApp.auth().currentUser;

        let placesRef = firebaseApp.database().ref('users/'+ user.uid + '/places/' + place.id);
        placesRef.once("value", function(snapshot) {

                placesRef.set({
                    description: place.description,
                    geometry: {
                        location: geo
                    }
                });

        });


        let placesArray = [];
        placesArray.unshift(this.state.currentLocation);
        let placeData =  firebaseApp.database().ref('users/' + user.uid + '/places');

        placeData.on("value", (snapshot) => {
            snapshot.forEach(child => {
                let cval = child.val();
                for (let place in placesArray) {
                    if (!placesArray.hasOwnProperty(place.description)) {
                        placesArray.push(cval);
                        this.setState({ places: placesArray });

                    }

                }
            });
        });

    };

    render() {
        if (this.state.places.length && this.state.currentLocation) {
            let temArr = [];
            temArr.unshift(this.state.currentLocation);
            let placeArr = this.state.places;
            temArr.concat(placeArr);
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
                currentLocation={false} // Not currently working... Will add a 'Current location' button at the top of the predefined places list
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
