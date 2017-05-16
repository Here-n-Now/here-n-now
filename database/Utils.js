import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import GeoFire from 'geofire';
import * as firebase from 'firebase';
import { firebaseApp } from '../Home';
const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const postToFirebaseDB = (mediaUrl, mediaType, text = '') => {
  console.log('asdfsfdsfdsfsd', mediaUrl, mediaType)
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
            "featureclass": mediaType.slice(0,1).toUpperCase(),
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

export const uploadMedia = (mediaLocalUrl, mediaId, mime, mediaType, finalText) => {
  console.log("mediaLocalUrl", mediaLocalUrl, 'mediaId', mediaId, 'mime', mime, 'mediaType', mediaType, 'finalText', finalText)
      const uploadUri = Platform.OS === 'ios'
        ? mediaLocalUrl.replace('file://', '')
        : mediaLocalUrl;
      let uploadBlob = null;
      const mediaLocalUrlRef = firebaseApp.storage().ref('posts').child(mediaId);
      fs.readFile(uploadUri, 'base64').then((data) => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then(blob => {
        uploadBlob = blob;
        return mediaLocalUrlRef.put(blob, {contentType: mime});
      })
      .then(() => {
        uploadBlob.close();
        return mediaLocalUrlRef.getDownloadURL();
      })
      .then(mediaUrl => {
        postToFirebaseDB(mediaUrl, mediaType, finalText);
      })
      .catch((error) => {
        console.log(error);
      });
  };
