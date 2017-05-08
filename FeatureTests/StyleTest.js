import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Image
} from 'react-native';

import { Container, Icon, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
const cards = [
    {
        text: 'Card One',
        name: 'One',
    }
];

export default class StyleTest extends Component {
  render() {
    return (
      <Container>
        <View>
        <DeckSwiper dataSource={cards} renderItem={item => <Card style={{
          elevation: 3
        }}>
          <CardItem>
            <Left>
              <Body>
                <Text>{item.text}</Text>
                <Text note>NativeBase</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody></CardItem>
          <CardItem>
            <Icon name="heart" style={{
              color: '#ED4A6A'
            }}/>
            <Text>{item.name}</Text>
          </CardItem>
        </Card>
      }/>
      </View>
    </Container>
    );
  }
}
