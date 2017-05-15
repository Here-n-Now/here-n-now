'use strict';
import React, { Component } from 'react';
import { ListItem, Thumbnail, Text, Body, Left, Right } from 'native-base';
import TimeAgo from 'react-native-timeago';

const ViewComments = (props) => {
  const {photoURL, displayName, comment, postedAt } = props.comment[1];
  return (
      <ListItem avatar>
          <Left>
              <Thumbnail source={{uri: photoURL}} />
          </Left>
          <Body>
              <Text>{displayName}</Text>
              <Text note>{comment}</Text>
              <Text note style={{fontSize: 10}}><TimeAgo time={postedAt} interval={20000}/></Text>
          </Body>
      </ListItem>
  );
};

export default ViewComments;
