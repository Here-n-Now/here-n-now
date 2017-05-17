import { StackNavigator, TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Container, Content, H2 } from 'native-base';
import { Image, Dimensions } from 'react-native';

import SubmitContainer from './components/SubmitAndViewMedia/SubmitContainer.js';
import ViewContainer from './components/SubmitAndViewMedia/ViewContainer.js';
import MapContainer from './components/map/MapContainer';
import Login from './components/Login.js';
import Account from './components/Account.js';
import RenderVideoTest from './FeatureTests/RenderVideoTest';
import PostFeed from './components/FeedView/PostFeed.js';
import MyFeed from './components/FeedView/MyFeed.js';
import CameraContainer from './components/camera/CameraContainer.js';


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
              screen: MapContainer
          },
          Share: {
              screen: CameraContainer
          },
          Account: {
              screen: Account
          }
          // LiveViewer: {
          //    screen: LiveViewer
          // }
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
          MyFeed: {
            screen: MyFeed
          },
          Feed: {
             screen: PostFeed
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
