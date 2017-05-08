console.disableYellowBox = true;

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./dummy/StatusBar');
const ActionButton = require('./dummy/ActionButton');
const ListItem = require('./dummy/ListItem');
const styles = require('./dummy/styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

//config for firebase
const firebaseConfig = {
  apiKey: "AIzaSyDs-MTj9PX6NOFWT9-Cy09F-Tx9UyBHMag",
  authDomain: "dummy-e994e.firebaseapp.com",
  databaseURL: "https://dummy-e994e.firebaseio.com",
  projectId: "dummy-e994e",
  storageBucket: "dummy-e994e.appspot.com",
  messagingSenderId: "426835810504"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class FirebaseTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    //'items' is the parent of what we are putting into the database
    //this line is also serving the double purpose of listening for changes from the server for 'items'
    //if I change this to another word, it will create a new parent for whatever word that is
    //No validation if that parent already exists or not. Just adds it...
    //when you are trying to go to deeper nodes, you would write something like 'posts/' + postId + '/title'
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    //'value' looks for changes in that entire node (including children) and then sends back all data from that node
    //suposed to try to listen for data as deep as possible to limit the snapshot size sent to the client
    itemsRef.on('value', (snap) => {

      // get children as an array. snap variable is the data coming from the database
      var items = [];
      snap.forEach((child) => {
        items.push({
          //the .title is the value we are pulling off the object
          title: child.val().title,
          //the key is automatically generated I think
          _key: child.key
        });
      });

      this.setState({
        //this is just adding the items array to the state (page display)
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

////You would use .once instead of .on for data you wanted only once and did not want to listen for it
  // var userId = firebase.auth().currentUser.uid;
  // return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  //   var username = snapshot.val().username;
  //   // ...
  // });

////Eager posting to database https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data

  componentDidMount() {
    //listens for changes from the database. if this is commented out,
    //it doesn't pull anything from the database. you can still post though
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Grocery List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add" />

      </View>
    )
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Add',
          onPress: (text) => {
            //this is we're we send data into the database
            //we can push any values and keys we want into the database
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {

    const onPress = () => {
      AlertIOS.alert(
        'Complete',
        null,
        [
          //I assume this sends a remove request to the database with the key identifier
          //When it is removed from the database, it is removed locally as well
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}
