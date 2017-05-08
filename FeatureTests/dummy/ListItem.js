import React, {Component} from 'react';
import ReactNative from 'react-native';
const styles = require('../dummy/styles.js')
const { View, TouchableHighlight, Text } = ReactNative;

class ListItem extends Component {
  render() {
    console.log(this.props)
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
          <Text style={styles.liText}>{this.props.item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

module.exports = ListItem;
