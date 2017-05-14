console.disableYellowBox = true;

import React from 'react';
import { AppRegistry } from 'react-native';
import Home from './Home';


export default class maptest extends React.Component {
    render() {
        return (
            <Home />
        );
    }
}

AppRegistry.registerComponent('maptest', () => maptest);
