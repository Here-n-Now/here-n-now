console.disableYellowBox = true;

import React from 'react';
import { AppRegistry } from 'react-native';
import Nav from './Nav';


export default class maptest extends React.Component {
    render() {
        return (
            <Nav />
        );
    }
}

AppRegistry.registerComponent('maptest', () => maptest);
