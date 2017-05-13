import { StackNavigator, TabNavigator } from 'react-navigation';
import React from 'react';
import * as firebase from 'firebase';


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

import PostPic from './components/PostPic';
import PostVideo from './components/PostVideo.js';
import Map from './components/Map';
import Login from './components/Login.js';
import Account from './components/Account.js';
import ViewVideo from './components/ViewVideo.js';
import CameraApp from './components/CameraApp';
import RenderVideoTest from './FeatureTests/RenderVideoTest';
import LiveStreamer from './components/LiveStreamer';
import LiveViewer from './components/LiveViewer';
import PostFeed from './components/PostFeed.js';
import geofiretest from './geofireTest.js'

export default class Home extends React.Component {
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
                    user,
                    tab: TabNavigator({
                        // PostVideo: {
                        //     screen: PostVideo
                        // },
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
                    PostPic: {
                      screen: PostPic
                    },
                    PostVideo: {
                      screen: PostVideo
                    },
                    ViewPost: {
                      screen: ViewVideo
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
