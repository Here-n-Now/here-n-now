import { firebaseApp } from '../Nav';
import styles from '../FeatureTests/dummy/styles.js';
import RenderVideoTest from '../FeatureTests/RenderVideoTest'


import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    AppRegistry,
    ListView,
    TouchableHighlight,
    AlertIOS,
    Modal
} from 'react-native';
import { Button, Container, Content, Text, Form, Item, Label, Input, Header, Left, Right, Title, Icon, Body } from 'native-base';

export default class Login extends React.Component {
    static navigationOptions = {
      header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            modalVisible: false,
            target: ''
        };
    }

    onClickLogin = () => {
        const { email, password } = this.state
        let userEmail = email;
        let userPassword = password;

        firebaseApp.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then(loggedin => console.log("got here"))
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                AlertIOS.alert('Uh Oh', errorMessage);
            });
    }

    onClickSignup = () => {
        //to add username http://stackoverflow.com/questions/37798560/how-do-i-add-username-to-user-when-using-firebase-android
        const { email, password } = this.state
        let userEmail = email;
        let userPassword = password;
        firebaseApp.auth().createUserWithEmailAndPassword(userEmail, userPassword)
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                AlertIOS.alert('Uh Oh', errorMessage);
            });
    }

    setModalVisible(visible, target) {
      this.setState({
        modalVisible: visible,
        target
      });
    }

    render() {
        const { email, password, modalVisible, target, username } = this.state
        return (
          <View style={styles.container}>
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={modalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}
              >
              <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.setState({modalVisible: false})}>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{target}</Title>
                    </Body>
                    <Right>
                        {
                          //if both filled out, show submit button
                          //need to !! so it resolves to truthy or false not a number. number will throw react error
                          (!!email.length && !!password.length) &&
                          <Button transparent onPress={target === 'Login' ? this.onClickLogin : this.onClickSignup}>
                            <Icon name='md-send' />
                        </Button>
                      }
                    </Right>
                </Header>
                     <Content>
                         <Form>
                             <Item floatingLabel>
                                <Icon name='ios-mail-outline' />
                                 <Label>Email</Label>
                                 <Input
                                   onChangeText={e => this.setState({email: e})}
                                   />
                                 {/*<Icon name='checkmark-circle' />*/}
                             </Item>
                             <Item floatingLabel>
                                <Icon name='ios-key-outline' />
                                 <Label>Password</Label>
                                 <Input
                                   onChangeText={e => this.setState({password: e})}
                                   secureTextEntry={true}
                                   />
                                 {/*<Icon name='close-circle' />*/}
                             </Item>
                         </Form>
                     </Content>
                 </Container>
            </Modal>
            <RenderVideoTest />
              <View style={{flexDirection: 'row'}}>
                <Button
                  full
                  danger
                  style={{flex: 1}}
                  onPress={() => this.setModalVisible(true, 'Login')}
                  >
                    <Text>Login</Text>
                </Button>
                <Button
                  full
                  warning
                  style={{flex: 1}}
                  onPress={() => this.setModalVisible(true, 'Signup')}
                  >
                    <Text>Signup</Text>
                </Button>
              </View>
          </View>
        );
    }
}
