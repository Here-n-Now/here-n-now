import { firebaseApp } from '../Nav';

import styles from '../FeatureTests/dummy/styles.js';
import RenderVideoTest from '../FeatureTests/RenderVideoTest'

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Icon, Container, Content, Text, Button, Header, Body, Title, List, ListItem, Badge, Left, Right, Switch } from 'native-base';

import {
    StyleSheet,
    View,
    Linking,
    TouchableHighlight,
    AlertIOS
} from 'react-native';

// var user = firebaseApp.auth().currentUser;
export default class User extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-contact-outline' android="ios-contact-outline" style={{color: tintColor}} />
      )
  }
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            let email, uid;
            if (user) this.setState({user});
            else this.props.navigation.navigate('Login');
        })
    }

    onClickEdit = event => {
        // //editing info section, curently throws an error
        // this.state.user.updatePassword(event.target.value());
        AlertIOS.alert('Uh Oh', `Why are you clicking things that aren't fully integrated yet?`);
    }

    onClickLogout = () => {
        //actually logs out user but they can still can pull on the screen and seem logged in. need to disable back or figure out how to re-render nav
        firebaseApp.auth().signOut()
        .then(() => this.props.navigation.navigate('Login'))
    }


    render() {
        const { user } = this.state;
        return (
          <Container style={styles.container}>
            <Header>
                <Body>
                    <Title>Hi, {this.state.user && this.state.user.email}</Title>
                </Body>
            </Header>
            <Content>
              <ListItem itemDivider>
                <Text>SETTINGS</Text>
              </ListItem>
              <ListItem icon onPress={ this.onClickEdit }>
                  <Left>
                      <Icon name="ios-mail-outline" />
                  </Left>
                  <Body>
                    <Text>Email</Text>
                  </Body>
                  <Right>
                      <Text>{user && user.email.slice(0, 20) }</Text>
                      <Icon name="arrow-forward" />
                  </Right>
              </ListItem>
              <ListItem icon onPress={ this.onClickEdit }>
                  <Left>
                      <Icon name="ios-key-outline" />
                  </Left>
                  <Body>
                    <Text>Password</Text>
                  </Body>
                  <Right>
                      <Text>••••••</Text>
                      <Icon name="arrow-forward" />
                  </Right>
              </ListItem>
              <ListItem icon onPress={ () => Linking.openURL('app-settings:') }>
                  <Left>
                      <Icon name="ios-settings-outline" />
                  </Left>
                  <Body>
                    <Text>App Permissions</Text>
                  </Body>
                  <Right>
                      <Icon name="arrow-forward" />
                  </Right>
              </ListItem>
              <ListItem itemDivider />
                <ListItem icon onPress={ this.onClickLogout }>
                    <Left>
                        <Icon name="ios-close-outline" />
                    </Left>
                    <Body>
                      <Text>Logout</Text>
                    </Body>
                    <Right>
                        <Text>••••••</Text>
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
            </Content>
          </Container>
        )
    }
}
