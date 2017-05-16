import { firebaseApp } from '../Home';
import styles from './style/styles.js';
import RenderVideoTest from '../FeatureTests/RenderVideoTest'
import Faker from 'Faker';
import Login from './Login';
import Signup from './Signup';
import React, { Component } from 'react';
import { Button, Container, Content, Text, Form, Item, Label, Input, Header, Left, Right, Title, Icon, Body } from 'native-base';
import {
    TextInput,
    View,
    AppRegistry,
    ListView,
    TouchableHighlight,
    AlertIOS,
    Modal
} from 'react-native';

export default class UserGate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            target: '',
            isPasswardReset: false

        };
    }





    render() {

        const { email, password, modalVisible, target, isPasswardReset, username } = this.state;
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    {
                        (this.state.forgotPassword == false) &&
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
                                {
                                    target == 'login' ?
                                        <Login /> : <Signup/>
                                }
                            </Content>
                        </Container>
                    }
                    {
                        (target === 'Login' && this.state.forgotPassword === false) && (
                            <Button onPress={ this.onClickForgotPassword }>
                                <Text>Forgot password?</Text>
                            </Button>
                        )
                    }
                    {
                        this.state.forgotPassword == true &&

                        <Container>
                            <Header>
                                <Left>
                                    <Button transparent onPress={() => this.setState({modalVisible: false})}>
                                        <Icon name='close'/>
                                    </Button>
                                </Left>
                                <Body>
                                <Title>Reset Pw!</Title>
                                </Body>
                                <Right></Right>

                            </Header>
                            <Content>
                                <Form>
                                    <Item floatingLabel>
                                        <Icon name='ios-mail-outline'/>
                                        <Label>Email to reset password</Label>
                                        <Input
                                            onChangeText={e => this.setState({email: e})}
                                        />
                                        {/*<Icon name='checkmark-circle' />*/}
                                    </Item>
                                </Form>
                                {
                                    (!!email.length) &&
                                    <Button onPress={this.onClickResetEmail}>
                                        <Text>Send password reset email!</Text>
                                    </Button>
                                }
                            </Content>
                        </Container>
                    }
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