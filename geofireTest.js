import GeoFire from 'geofire';
import * as firebase from 'firebase';

 export default  () =>
 {var location = [40.70488123341785, -74.00933010052847];
  var locations = [
  [40.7048059016459, -74.00926952260089],
  [40.70488123341785, -74.00933010052847],
   [30, 130]
  ]

var geoFireRef = firebase.database().ref('geolocation');
var firebaseRef = firebase.database().ref().push();

var geoFire = new GeoFire(geoFireRef);


  var promises = locations.map(function(location, index) {
    return geoFire.set("testPost" + index, location).then(function() {

    });
  });

  geoFire.set('testGeoPost', location).then(() =>
    {console.log('writing to geofire')}
      )
   //?? to get the new post key we do geoFire.get(key)??                                         )

var geoQuery = geoFire.query({
      center: location,
      radius: 2000
    });

      geoQuery.on('key_entered',(key, location, distance) => {
      console.log('Key: ', key, 'location ', location, 'distance ',distance)
    });
}


