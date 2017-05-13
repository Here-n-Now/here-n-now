import GeoFire from 'geofire';
import * as firebase from 'firebase';

const geofire = (coordsArr) => {

  const geofireRef = firebase.database().ref('geolocation');
  const geoFire = new GeoFire(geofireRef);

  var geoQuery = geoFire.query({
    center: [40.7048059016459, -74.00926952260089],
    radius: 5
  });
  var markersArr = []
  geoQuery.on('key_entered', (key, place, distance) => {
    markersArr.push({key: key, coords: place})
    console.log('Key: ', key, 'location ', place, 'distance ', distance)
  });
  console.log('inside', markersArr)
  return markersArr
}

export default geofire
