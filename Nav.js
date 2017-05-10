import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import PictureTest from './FeatureTests/PictureTest';
import PostDetail from './FeatureTests/StyleTest';
import VideoTest from './FeatureTests/VideoTest';
import Location from './FeatureTests/Location';
import App from './FeatureTests/src/App.js';
import Login from './auth/Login.js';
import User from './auth/SingleUser.js';
import RenderVideoTest from './FeatureTests/RenderVideoTest';
import Post from './database/Post';
// import SinglePost from './database/SinglePost';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
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
export const storage = firebase.storage();




export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            tab: StackNavigator({
                Login: {
                    screen: Login
                }
            })
        };
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user : user,
                    tab: TabNavigator({
                        View: {
                            screen: Location
                        },
                        // PictureTest: {
                        //     screen: PictureTest
                        // },
                        Share: {
                            screen: VideoTest
                        },
                        Account: {
                            title: 'Account',
                            screen: User
                        },
                        NewPost: {
                            screen: RenderVideoTest
                        }
                        // Post: {
                        //     screen: Post
                        //},
                        // SinglePost: {
                        //     screen: SinglePost
                        // }
                    })
                })
            }
        });
    }



    render () {
        return (
            this.state.tab !== undefined && (
                React.createElement(StackNavigator({
                    Tabs: {
                        screen: this.state.tab
                    },
                    RenderVideoTest: {
                        screen: RenderVideoTest
                    },
                    Login: {
                        screen: Login
                    }
                }))
            )


        )
    }

}
