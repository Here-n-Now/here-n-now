// import { firebaseApp } from '../Nav';
// import * as firebase from 'firebase';
// const StatusBar = require('../FeatureTests/dummy/StatusBar');
// const ActionButton = require('../FeatureTests/dummy/ActionButton');
// const styles = require('../FeatureTests/dummy/styles.js');
// const React = require('react');
// const ReactNative = require('react-native');
// const {
//     StyleSheet,
//     Text,
//     View,
//     Button,
//     AppRegistry,
//     ListView,
//     TouchableHighlight,
//     AlertIOS
// } = ReactNative;
// exports.framework = 'React';
//
//
// export default class Post extends React.Component {
//     constructor(props) {
//         super(props);
//         // console.log("props: ", this.props);
//         this.state = {
//             dataSource: new ListView.DataSource({
//                 rowHasChanged: (row1, row2) => row1 !== row2,
//             }),
//             post: undefined,
//             postRef: undefined
//         };
//
//         this.onClickEdit = this.onClickEdit.bind(this);
//         this.onClickComment = this.onClickComment.bind(this);
//     }
//
//     componentDidMount() {
//
//         let query = firebase.database().ref("posts").orderByKey();
//         query.once("value")
//             .then(snapshot => {
//                 snapshot.forEach(function(childSnapshot) {
//                     let key = childSnapshot.key;
//                     this.setState({
//                         post: childSnapshot,
//                         postRef: firebaseApp.database().child('posts/' + key)});
//                     return true;
//                 });
//             });
//
//     }
//
//     onClickEdit(event) {
//
//         this.state.user.updatePassword(event.target.value());
//
//     }
//
//
//     onClickComment(){
//         let commentRef = firebase.database().ref('posts/' + postId + '/comments/');
//         commentRef.on('value', function(snapshot) {
//             updatecommentRef(postElement, snapshot.val());
//         });
//
//
//     }
//
//
//
//     render() {
//         return (
//             <View style={styles.container}>
//                 <StatusBar title="User's page"/>
//                 <View
//                     title={this.state.post.title}
//                     style={styles.listview}/>
//                 <ActionButton onPress={ this.onClickEdit } title="Edit Profile!!"/>
//
//                 <ActionButton onPress={this.onClickComment } title="Leave Comment!"/>
//             </View>
//         )
//     }
// }
//
// // var ref = firebase.database().ref("users/ada");
// // ref.once("value")
// //     .then(function(snapshot) {
// //         var name = snapshot.child("name").val(); // {first:"Ada",last:"Lovelace"}
// //         var firstName = snapshot.child("name/first").val(); // "Ada"
// //         var lastName = snapshot.child("name").child("last").val(); // "Lovelace"
// //         var age = snapshot.child("age").val(); // null
// //     });
