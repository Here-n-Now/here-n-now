import Faker from 'Faker';
import { firebaseApp } from '../Home';
import * as firebase from 'firebase';
import GeoFire from 'geofire'
export default seedToFirebaseDB = (mediaUrl, mediaType) => {
  function getlat(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min) + 0.1103;
  }
  function getlng(min, max) {
    return ((Math.floor(Math.random() * (max - min)) + min) * -1) + 0.1103;
  }
  const geofireRef = firebase.database().ref('geolocation');
  const firebaseRef = firebase.database().ref();
  const geoFire = new GeoFire(geofireRef);
  const myId = `${mediaType}:${firebaseRef.push().key}`
  const latlng = {lat: getlat(30, 45), lng: getlng(75, 120)}
  geoFire.set(myId, [latlng.lat, latlng.lng]);
  return firebaseApp.database().ref('CurrentPosts/' + myId).set({
      "type": "Feature",
      "properties": {
        "_id": myId,
        "featureclass": mediaType.slice(0,1).toUpperCase(),
        "text": Faker.Lorem.sentence(),
        [mediaType]: mediaUrl,
        "user_id": '5YIheE0JlWhVZrsa3BoiNFopJPc2',
        "postedAt": firebase.database.ServerValue.TIMESTAMP,
        "comments": [],
        "likes": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          latlng.lng,
          latlng.lat
        ]
      }
  });
};

