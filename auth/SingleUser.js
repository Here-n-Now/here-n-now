import { firebaseApp } from '../index.ios';
import * as firebase from 'firebase';
const StatusBar = require('../FeatureTests/dummy/StatusBar');
const ActionButton = require('../FeatureTests/dummy/ActionButton');
const styles = require('../FeatureTests/dummy/styles.js');
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Button,
    AppRegistry,
    ListView,
    TouchableHighlight,
    AlertIOS
} = ReactNative;
exports.framework = 'React';



// var user = firebaseApp.auth().currentUser;
export default class User extends React.Component {
    constructor(props) {
        super(props);
        console.log("props: ", this.props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickLogout = this.onClickLogout.bind(this);
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            let email, uid;
            if (user) {
                // email = user.email;
                // uid = user.uid;
                let user = user;
                return user;
            }

            else {
                return (
                    <Text title="User not exist!"/>
                )
            }
        })
    }

    onClickEdit(event) {

        // user.updatePassword(event.target.value());

    }

    onClickLogout() {
        // firebaseApp.auth().signOut();
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar title="User's page"/>
                {/*<ListView*/}
                    {/*title = {user && user.email}*/}
                    {/*style={styles.listview} />*/}
                <ActionButton onPress={ this.onClickEdit } title="Edit Profile!!"/>
                <ActionButton onPress={ this.onClickLogout} title="Log out!!"/>
            </View>
        )
    }
}
                    // dataSource={user}
