'use strict';
import React, { Component } from 'react';
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Left, Right } from 'native-base';

const ViewComments = () => {
  return (
      <ListItem avatar>
          <Left>
              <Thumbnail source={{uri: 'https://unsplash.it/200'}} />
          </Left>
          <Body>
              <Text>Kumar Pratik</Text>
              <Text note>Doing what you like will always keep you happy . .</Text>
          </Body>
          <Right>
              <Text note>3:43 pm</Text>
          </Right>
      </ListItem>
  );
};

export default ViewComments;
