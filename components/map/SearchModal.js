import React, { Component } from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {Text, Button, Fab, Icon} from 'native-base';
import GoogleSearch from './GoogleSearch'

const SearchModal = props => {
  return (
    <View>
      <View>
        <Fab
          style={{ backgroundColor: '#5067FF' }}
          position="topRight"
          onPress={props.setModalVisible}>
          <Icon name="ios-search-outline" />
        </Fab>
      </View>
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={props.modalVisible}
        onRequestClose={() => {alert('Modal has been closed.')}}
      >
        <GoogleSearch
          onSearch={props.onChangeRegionComplete}
          setModalVisible={props.setModalVisible} />
        <Button
          full
          danger
          onPress={props.setModalVisible}
        >
          <Text>Cancel Search</Text>
        </Button>
      </Modal>
    </View>
  )
  }

export default SearchModal
        // this.onSearch
        // this.onChangeRegion
