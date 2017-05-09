console.disableYellowBox = true;

import React from 'react';
import { AppRegistry } from 'react-native';
import Nav from './Nav';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB8MNYp0Y5U6FztmjVWzILaPnYdKqntPN0",
    authDomain: "we-ward-872a3.firebaseapp.com",
    databaseURL: "https://we-ward-872a3.firebaseio.com",
    projectId: "we-ward-872a3",
    storageBucket: "we-ward-872a3.appspot.com",
    messagingSenderId: "745916231980"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);



export default class maptest extends React.Component {
    render() {
        return (
            <Nav />
        );
    }
}

AppRegistry.registerComponent('maptest', () => maptest);
