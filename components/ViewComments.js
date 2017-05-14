'use strict';
import React, { Component } from 'react';
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Left, Right } from 'native-base';

const ViewComments = (props) => {
  console.log('comment list', props)
  return (
      <ListItem avatar>
          <Left>
              <Thumbnail source={{uri: props.comment[1].photoURL || 'https://unsplash.it/200'}} />
          </Left>
          <Body>
              <Text>{props.comment[1].displayName || 'Anonomous'}</Text>
              <Text note>{props.comment[1].comment}</Text>
          </Body>
          <Right>
              <Text note>3:43 pm</Text>
          </Right>
      </ListItem>
  );
};

// uid: user.uid,
// photoURL: user.photoURL,
// userName: user.displayName,
// comment: this.state.comment
export default ViewComments;
