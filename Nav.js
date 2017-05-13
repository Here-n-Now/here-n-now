import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import * as firebase from 'firebase';

import SubmitContainer from './components/SubmitContainer.js';
import ViewContainer from './components/ViewContainer.js';
import Map from './components/Map';
import Login from './components/Login.js';
import Account from './components/Account.js';
import CameraApp from './components/CameraApp';
import RenderVideoTest from './FeatureTests/RenderVideoTest';
import LiveStreamer from './components/LiveStreamer';
import LiveViewer from './components/LiveViewer';
import PostFeed from './components/PostFeed.js';
import geofiretest from './geofireTest.js'

const firebaseConfig = {
    apiKey: 'AIzaSyB8MNYp0Y5U6FztmjVWzILaPnYdKqntPN0',
    authDomain: 'we-ward-872a3.firebaseapp.com',
    databaseURL: 'https://we-ward-872a3.firebaseio.com',
    projectId: 'we-ward-872a3',
    storageBucket: 'we-ward-872a3.appspot.com',
    messagingSenderId: '745916231980'
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const fireStorage = firebaseApp.storage();

export default class Nav extends Component {
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

        geofiretest();
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user,
                    tab: TabNavigator({
                        View: {
                            screen: Map
                        },
                        Share: {
                            screen: CameraApp
                        },
                        Account: {
                            screen: Account
                        },
                        // LiveViewer: {
                        //    screen: LiveViewer
                        // },
                        // LiveStreamer: {
                        //     screen: LiveStreamer
                        // },
                        // Feed: {
                        //     screen: PostFeed
                        // },
                    })
                });
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
                    },
                    SubmitContainer: {
                      screen: SubmitContainer
                    },
                    ViewContainer: {
                      screen: ViewContainer
                    },
                    LiveViewer: {
                        screen: LiveViewer
                    },
                    LiveStreamer: {
                        screen: LiveStreamer
                    },
                }))
            )
        );
    }
}
