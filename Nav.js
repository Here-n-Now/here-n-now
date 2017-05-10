import { StackNavigator, TabNavigator } from 'react-navigation';
import React from 'react';
import * as firebase from 'firebase';

import VideoTest from './FeatureTests/VideoTest';
import Map from './components/Map';
import Login from './components/Login.js';
import Account from './components/Account.js';
import RenderVideoTest from './FeatureTests/RenderVideoTest';
import App from './FeatureTests/src/App';

const firebaseConfig = {
    apiKey: 'AIzaSyB8MNYp0Y5U6FztmjVWzILaPnYdKqntPN0',
    authDomain: 'we-ward-872a3.firebaseapp.com',
    databaseURL: 'https://we-ward-872a3.firebaseio.com',
    projectId: 'we-ward-872a3',
    storageBucket: 'we-ward-872a3.appspot.com',
    messagingSenderId: '745916231980'
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);


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
                    user,
                    tab: TabNavigator({
                        View: {
                            screen: Map
                        },
                        // App: {
                        //     screen: App
                        // },
                        Share: {
                            screen: VideoTest
                        },
                        Account: {
                            screen: Account
                        },
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
                    }
                }))
            )
        );
    }
}
