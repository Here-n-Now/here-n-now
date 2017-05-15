import { firebaseApp } from '../Home';
import * as firebase from 'firebase';

import styles from './style/styles.js';
import RenderVideoTest from '../FeatureTests/RenderVideoTest'
import PostFeed from './PostFeed'

import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { Icon, Container, Content, Text, Button, Header, Body, Title, List, ListItem, Badge, Left, Right, Switch,TouchableOpacity } from 'native-base';

import {
    StyleSheet,
    View,
    Linking,
    TouchableHighlight,
    AlertIOS
} from 'react-native';


// var user = firebaseApp.auth().currentUser;
export default class Account extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-contact-outline' android="ios-contact-outline" style={{color: tintColor}} />
      )
  }
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            selected: []
        };
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            let email, uid;
            if (user) this.setState({user});
            else this.props.navigation.navigate('Login');
        })
       // this.fetchMyPosts();

    }

    onClickEdit = event => {
        // //editing info section, curently throws an error
        // this.state.user.updatePassword(event.target.value());
        AlertIOS.alert('Uh Oh', `Why are you clicking things that aren't fully integrated yet?`);
    }

    onClickLogout = () => {
        //actually logs out user but they can still can pull on the screen and seem logged in. need to disable back or figure out how to re-render nav
        firebaseApp.auth().signOut()
    }

    fetchMyPosts = () => {
      const firebaseRef = firebase.database().ref();
      const userPostsRef = firebase.database().ref('user-posts');
      const database = firebaseApp.database();


      //Query to fetch posts by current User
      userPostsRef.orderByChild('userId').equalTo('pFbnScDJd7gx7F1PfuHxgvUkLe23').on('value',
        (snapshot) => {

        var selected = snapshot.val().slice(1);
         console.log('Snapshot.slice: ', selected);

        this.setState({selected:  selected});
      });
      console.log('SELECTED POSTS before navigate: ',this.state.selected);
     this.props.navigation.navigate('PostFeed', {selectedPosts: this.state.selected})
     }


    render() {
      console.log('POSTS by USER on State: ',this.state.selected);

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
                        <Icon name="arrow-forward" />
                    </Right>
                </ListItem>
                <ListItem icon onPress={ this.fetchMyPosts }>
                  <Left>
                      <Icon name="ios-key-outline" />
                  </Left>
                  <Body>
                    <Text>My Posts</Text>
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
