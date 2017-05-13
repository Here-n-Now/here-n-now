'use strict';
import React, { Component } from 'react';
import { Modal, StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import { Icon, Button, Container, Content, Input, Item, Fab, Header, Title, Left, Right, Body, Text, ListItem, Footer, Grid, Col } from 'native-base';
import { NavigationActions } from 'react-navigation';

import ViewVideo from './ViewVideo';
import ViewImage from './ViewImage';
import ViewComments from './ViewComments';
import styles from './style/app';

export default class ViewContainer extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  render() {
    const { video, image } = this.props.navigation.state.params;
    return  (
      <View style={{flex: 1}}>
        {video ? <ViewVideo video={video} /> : <ViewImage image={image} />}
        <Fab
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            shadowColor: 'black',
            shadowOpacity: 1.0,
          }}
          position="topLeft"
          onPress={
            () => this.props.navigation.dispatch(NavigationActions.back({}))
          }>
          <Icon name="md-close-circle" />
        </Fab>
        <Fab
          position="bottomLeft"
          onPress={
            () => {this.setState({modalVisible: true})}
          }>
          <Icon name="md-chatboxes" />
        </Fab>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <Header>
              <Left>
                  <Button transparent onPress={() => this.setState({modalVisible: false})}>
                      <Icon name='close' />
                  </Button>
              </Left>
              <Body>
                  <Title>Comments</Title>
              </Body>
              <Right />
          </Header>
            <Content>
              <Text>Hey Guys, what do you think of my awesome caption?</Text>
            <ListItem itemDivider>
              <Text>42 comments</Text>
            </ListItem>
              {'1111111111111111111111111111'.split('').map(() => <ViewComments />)}
            </Content>
          <Footer>
          <Content>
          <Grid>
              <Col size={75}>
                <Item>
                    <Input placeholder='Leave a comment...'/>
                </Item>
              </Col>
              <Col size={25}>
                <Button block>
                  <Text>Share</Text>
                </Button>
              </Col>
          </Grid>
          </Content>
          </Footer>
        </Modal>
      </View>)
  }
}

// <View style={[styles.form, {pointerEvents: 'none'}]}>
//   <Text>What up?</Text>
// </View>

// <Fab
//   style={{
//     backgroundColor: 'rgba(0, 0, 0, 0)',
//     shadowColor: 'black',
//     shadowOpacity: 1.0,
//   }}
//   position="topRight"
//   onPress={this.setModalVisible}>
// <Icon name="ios-happy-outline" />
// </Fab>
