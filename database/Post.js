import { firebaseApp } from '../Nav';
import * as firebase from 'firebase';

const StatusBar = require('../FeatureTests/dummy/StatusBar');
const ActionButton = require('../FeatureTests/dummy/ActionButton');
const styles = require('../FeatureTests/dummy/styles.js');
const React = require('react');
const ReactNative = require('react-native');
import Location from '../FeatureTests/Location';

const {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    AppRegistry,
    ListView,
    TouchableHighlight,
    AlertIOS
} = ReactNative;

const database = firebaseApp.database();

export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            postRef: undefined,
            post: undefined
        };
        this.postRef = this.getRef().child('posts');
    }


    getRef = () => (firebaseApp.database().ref());



    listenForPosts(postsRef) {
        postsRef.on('value', (snap) => {

            const posts = [];
            snap.forEach((child) => {
                posts.push({
                    title: child.val().title,
                    _key: child.key
                });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(posts)
            });

        });
    }

    componentDidMount() {

        this.listenForPosts(this.postRef);
    }

    // writePost(postId, video, caption, userId) {
    //     this.postRef.push({
    //         video: video,
    //         caption: caption,
    //         userId: firebaseApp.auth().currentUser.uId
    //     });
    // }

    writeNewPost() {
        AlertIOS.prompt(
            'Write new post!',
            null,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'Add',
                    onPress: (text) => {
                        this.itemsRef.push({ title: text })
                    }
                },
            ],
            'plain-text'
        );
    }

    renderPost(post) {

        const onPress = () => {
            AlertIOS.alert(
                'Complete',
                null,
                null,
                [
                    {text: 'Complete', onPress: (text) => this.postRef.child(post._key).remove()},
                    {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
                ]
            );
        };

        return (
            <ListItem post={post} onPress={onPress} />
        );
    }

    render() {
        return (
            <View style={styles.container}>

                <StatusBar title="Local news!!" />

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderPost.bind(this)}
                    enableEmptySections={true}
                    style={styles.listview}/>

                <ActionButton onPress={this.writeNewPost.bind(this)} title="Add" />

            </View>
        )
    }
}





    //
    // var newPostRef = postListRef.push();
    // newPostRef.set({
    //                    // ...
    //                });
    //
    // writePost(postId, video, timestamp, caption, comment, userId) {
    //     postRef.set({
    //         username: name,
    //         email: email,
    //         profile_picture: imageUrl
    //     });
    // }
    //
    // let postId = firebaseApp.auth().currentPost.uid;
    // return firebaseApp.database().ref('/posts/' + postId).once('value').then(function (snapshot) {
    //     let username = snapshot.val().username;
    //     // ...
    // });
    //
    // let starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
    // starCountRef.on('value', function(snapshot) {
    //     updateStarCount(postElement, snapshot.val());
    // });
    //
    // render() {
    //     return
    // }

// }