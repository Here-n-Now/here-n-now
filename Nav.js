import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { firebaseApp } from './index.ios';
import PictureTest from './FeatureTests/PictureTest';
import PostDetail from './FeatureTests/StyleTest';
import VideoTest from './FeatureTests/VideoTest';
import Location from './FeatureTests/Location';
import App from './FeatureTests/src/App.js';
import Login from './auth/Login.js';
import User from './auth/SingleUser.js';
// import * as firebase from 'firebase';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
console.log("Firebase App!",firebaseApp);
console.log('user?: ', firebaseApp.auth().currentUser);
// firebaseApp.auth().onAuthStateChanged(function (user){
//     if (user) {
//         let Tabs = TabNavigator({
//             LocationTest: {
//                 screen: Location
//             },
//             // FirebaseTest: {
//             //     screen: FirebaseTest
//             // },
//             PictureTest: {
//                 screen: PictureTest
//             },
//             VideoTest: {
//                 screen: VideoTest
//             },
//             LiveTest: {
//                 screen: App
//             },
//             StyleTest: {
//                 screen: PostDetail
//             },
//             User: {
//                 screen: User
//             }
//         });
//     } else {
//         let Tabs = TabNavigator({
//             LoginTest: {
//                 screen: Login
//             }
//         });
//     }
// });


const Tabs =  TabNavigator({
    LocationTest: {
        screen: Location
    },
    // FirebaseTest: {
    //     screen: FirebaseTest
    // },
    PictureTest: {
        screen: PictureTest
    },
    VideoTest: {
        screen: VideoTest
    },
    LiveTest: {
        screen: App
    },
    StyleTest: {
        screen: PostDetail
    },
    LoginTest: {
        screen: Login
    },
    User: {
        screen: User
    }
});

export default Nav = StackNavigator({
    Tabs: {
        screen: Tabs
    },
    Details: {
        screen: PostDetail,
        navigationOptions: {
            title: 'Details',
        },
    }
});
