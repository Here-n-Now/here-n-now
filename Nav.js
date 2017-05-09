import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import FirebaseTest from './FeatureTests/FirebaseTest';
import PictureTest from './FeatureTests/PictureTest';
import PostDetail from './FeatureTests/StyleTest';
import VideoTest from './FeatureTests/VideoTest';
import Location from './FeatureTests/Location';
import App from './FeatureTests/src/App.js';
import RenderVideoTest from './FeatureTests/RenderVideoTest';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';


const Tabs = TabNavigator({
    View: {
        screen: Location
    },
    // FirebaseTest: {
    //     screen: FirebaseTest
    // },
    // PictureTest: {
    //     screen: PictureTest
    // },
    Share: {
        screen: VideoTest
    },
    // RenderVideoTest: {
    //     screen: RenderVideoTest
    // },
    // LiveTest: {
    //     screen: App
    // },
    // StyleTest: {
    //     screen: PostDetail
    // },
});

export default Nav = StackNavigator({
    Tabs: {
        screen: Tabs
    },
    RenderVideoTest: {
        screen: RenderVideoTest
    },
    // Details: {
    //   screen: PostDetail,
    //   navigationOptions: {
    //     title: 'Details',
    //   }
    // },
});
