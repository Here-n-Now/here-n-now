import React from 'react';
import {View, Modal} from 'react-native';
import {Text, Button, Fab, Icon, Header, Right, Body, Left, Title } from 'native-base';
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
        <Header>
           <Left>
               <Button transparent>
                   <Icon name='ios-close-outline' onPress={props.setModalVisible} />
               </Button>
           </Left>
           <Body>
               <Title>Search</Title>
           </Body>
           <Right />
        </Header>
        <GoogleSearch
          onSearch={props.onChangeRegionComplete}
          setModalVisible={props.setModalVisible} />
      </Modal>
    </View>
  )
  }

export default SearchModal
        // this.onSearch
        // this.onChangeRegion
