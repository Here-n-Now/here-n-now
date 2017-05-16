import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Container, Content, H2 } from 'native-base';
import { Image, Dimensions } from 'react-native';

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
import MyFeed from './components/MyFeed.js';
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

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            nav: undefined,
        };
    }

    componentDidMount() {
      const loggedOut = StackNavigator({
          Login: {
              screen: Login
          }
      });
      const tabNav = TabNavigator({
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
      const loggedIn = StackNavigator({
          Tabs: {
              screen: tabNav
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
          MyFeed: {
            screen: MyFeed
          }
      });
      firebaseApp.auth().onAuthStateChanged(user => {
          if (user) {this.setState({
            user,
            nav: loggedIn
          });
        }
          else {
            this.setState({nav: loggedOut});
          }
      });
    }

    render () {
        const { width } = Dimensions.get('window');
        return (
          (this.state.nav && React.createElement(this.state.nav))
          ||
          <Container style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Content>
                  <Image source={require('./public/images/world.gif')} style={{width: width, height: width}} />
                  <H2></H2>
                  <H2 style={{textAlign: 'center'}}>Loading the world</H2>
              </Content>
          </Container>
        );
    }
}
