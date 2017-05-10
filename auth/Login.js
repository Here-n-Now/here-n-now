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


exports.framework = 'React';
exports.title = 'AlertIOS';
exports.description = 'iOS alerts and action sheets';

export default class Login extends React.Component {
    state: any;
    customButtons: Array<Object>;
    constructor(props) {
        super(props);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickSignup = this.onClickSignup.bind(this);
        this.state = {
            email: '',
            password: ''
        };
    }

    // onClickSignup = (email, pass) => {
    //     let userEmail = this.state.email;
    //     let userPassword = this.state.password;
    //     firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
    //         .catch(err => {
    //             let errorCode = error.code;
    //             let errorMessage = error.message;
    //             if (errorCode == 'auth/weak-password') {
    //                 alert('The password is too weak.');
    //             } else if (errorCode == 'auth/email-already-in-use') {
    //                 alert ('The email already exists.')
    //             } else {
    //                 alert(errorMessage);
    //             }
    //
    //             console.log(error);
    //         });
    //
    // };

    // onClickLogin = (email, pass) => {
    //     let userEmail = this.state.email.toString();
    //     let userPassword = this.state.password.toString();
    //     firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    //         .catch(err => console.error(err));
    //     firebaseApp.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             return user;
    //         } else {
    //             return null;
    //         }
    //     })
    // };

    onClickLogin() {
        console.log('firebaseApp in Login: ', firebaseApp)
        console.log(this.state.email);
        let userEmail = this.state.email.toString();
        let userPassword = this.state.password.toString();
        firebaseApp.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then(loggedin => console.log("got here"))
            .catch(err => console.error(err));
        console.log(firebaseApp.auth().currentUser);

        firebaseApp.auth().onAuthStateChanged(user => {
            console.log("user logged in!!", user);
            if (user) {
                this.props.navigation.navigate('Location');
            } else {
                alert ('Noooo');
            }
        })
    }

    onClickSignup(){
        let userEmail = this.state.email.toString();
        let userPassword = this.state.password.toString();
        firebaseApp.auth().createUserWithEmailAndPassword(userEmail, userPassword)
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                if (errorCode == 'auth/weak-password') {
                    AlertIOS.alert('The password is too weak.', null);
                } else if (errorCode == 'auth/email-already-in-use') {
                    AlertIOS.alert('The email already exists.', null)
                } else {
                    AlertIOS.alert(errorMessage, null);
                }

                console.log(err);
            });
    }


    render() {
        return (
            <View style ={styles.container} >
                <StatusBar title="Hellooooo" />
                <View style={{padding: 10}}>
                    <TextInput
                    style={{height: 40}}
                    placeholder="email!"
                    onChangeText={(e) => this.setState({email: e.toString()})}
                    />
                    <TextInput
                    style={{height: 40}}
                    placeholder="password!"
                    onChangeText={(p) => this.setState({password: p.toString()})}
                    />

                    <Button onPress={this.onClickLogin} title="Log in with email!" />

                    <Button onPress={this.onClickSignup} title="Sign up with email!" />
                </View>
            </View>

        );
    }
}


// let styless = StyleSheet.create({
//     wrapper: {
//         borderRadius: 5,
//         marginBottom: 5,
//     },
//     button: {
//         backgroundColor: '#eeeeee',
//         padding: 10,
//     },
// });



                    {/*<TouchableHighlight*/}
                        {/*style={styless.wrapper}*/}
                        {/*onPress={() => AlertIOS.prompt('Log in!!!', null, this.customButtons, 'login-password', 'cat@meow.com')}>*/}
                        {/*<View style={styless.button}>*/}
                            {/*<Text>*/}
                                {/*Login with email!*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                {/*</View>*/}
                {/*<View style={{padding: 10}}>*/}
                    {/*<TouchableHighlight*/}
                        {/*style={styless.wrapper}*/}
                        {/*onPress={() => AlertIOS.prompt('Sign up!!!', null, this.customButtonss, 'login-password', 'cat@meow.com')}>*/}
                        {/*<View style={styless.button}>*/}
                            {/*<Text>*/}
                                {/*Sign up!!*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
