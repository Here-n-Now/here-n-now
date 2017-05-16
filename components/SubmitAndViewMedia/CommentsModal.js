import React from 'react';
import { Modal, TextInput } from 'react-native';
import { Icon, Button, Content, Title, Header, Left, Right, Body } from 'native-base';

export default CommentsModal = (props) => {
  return (
    <Modal
      animationType={'slide'}
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {alert('Modal has been closed.')}}
      >
      <Header>
          <Left>
              <Button transparent onPress={() => props.setState({modalVisible: false})}>
                  <Icon name="close" />
              </Button>
          </Left>
          <Body>
              <Title>Caption</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => props.setState({
              modalVisible: false,
              finalText: props.text
            })}>
              {!!props.text && <Icon name="ios-checkbox" />}
            </Button>
          </Right>
      </Header>
        <Content>
            <TextInput
              placeholder= "Say something about this post"
              style={{height: 350}}
              multiline={true}
              onChangeText={(text) => props.setState({text})}
              value={props.text}
            />
        </Content>
    </Modal>
  );
};
