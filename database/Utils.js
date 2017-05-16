import { firebaseApp } from '../Home';
import * as firebase from 'firebase';
import GeoFire from 'geofire';

export default postToFirebaseDB = (mediaUrl, mediaType, text = '') => {
  const geofireRef = firebase.database().ref('geolocation');
  const firebaseRef = firebase.database().ref();
  const geoFire = new GeoFire(geofireRef);
  const myId = `${mediaType}:${firebaseRef.push().key}`
  navigator.geolocation.getCurrentPosition(
    (position) => {
      geoFire.set(myId, [position.coords.latitude, position.coords.longitude]);
      return firebaseApp.database().ref('CurrentPosts/' + myId).set({
          "type": "Feature",
          "properties": {
            "_id": myId,
            "featureclass": "A",
            "text": text,
            [mediaType]: mediaUrl,
            "user_id": firebaseApp.auth().currentUser.uid,
            "postedAt": firebase.database.ServerValue.TIMESTAMP
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              position.coords.longitude,
              position.coords.latitude
            ]
          }
      });
    }
  );
};
