import { firebaseApp } from '../Home';
import styles from './style/styles.js';
import RenderVideoTest from '../FeatureTests/RenderVideoTest'
import Faker from 'Faker';
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


export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            modalVisible: false,
            target: '',
            forgotPassword: false
        };
    }

    onClickLogin = () => {
        const { email, password } = this.state;
        let userEmail = email;
        let userPassword = password;
        firebaseApp.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then(loggedin => console.log("got here"))
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                AlertIOS.alert('Uh Oh', errorMessage);
            });
    };

    onClickSignup = () => {
        //to add username http://stackoverflow.com/questions/37798560/how-do-i-add-username-to-user-when-using-firebase-android
        const { email, password, username } = this.state;
        let userEmail = email;
        let userPassword = password;
        firebaseApp.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                user = firebaseApp.auth().currentUser;
                user.sendEmailVerification();
                console.log("USER!!!", user);
            })
            .then(() => {
                let places = [];
                user.updateProfile({
                    displayName: username,
                    photoURL: Faker.Image.avatar(),
                });
                firebaseApp.database().ref('users/'+ user.uid).set({
                    displayName: username,
                    places: places
                });
            })
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                AlertIOS.alert('Uh Oh', errorMessage);
            });
    };


    onClickForgotPassword = () => {
        console.log('i clicked forgot password');
        this.setState({
            forgotPassword: true
        });
    };

    onClickResetEmail = () => {
        firebaseApp.auth().sendPasswordResetEmail(this.state.email)
            .then (sent => {
                AlertIOS.alert('Email sent! You can change your password. <3'); })
            .then(() => this.setState({ forgotPassword: false }))
            .catch(err => {
                let errorCode = err.code;
                let errorMessage = err.message;
                AlertIOS.alert('Email doesnt exist', errorMessage);
            });


    };

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
                                <Form>
                                    {target === 'Signup' &&
                                    <Item floatingLabel>
                                        <Icon name='ios-contact-outline' />
                                        <Label>Username</Label>
                                        <Input
                                            autoCorrect={false}
                                            onChangeText={e => this.setState({username: e})}
                                        />
                                        {/*<Icon name='checkmark-circle' />*/}
                                    </Item>}
                                    <Item floatingLabel>
                                        <Icon name='ios-mail-outline' />
                                        <Label>Email</Label>
                                        <Input
                                            autoCorrect={false}
                                            onChangeText={e => this.setState({email: e})}
                                        />
                                        {/*<Icon name='checkmark-circle' />*/}
                                    </Item>
                                    <Item floatingLabel>
                                        <Icon name='ios-key-outline' />
                                        <Label>Password</Label>
                                        <Input
                                            autoCorrect={false}
                                            onChangeText={e => this.setState({password: e})}
                                            secureTextEntry={true}
                                        />
                                        {/*<Icon name='close-circle' />*/}
                                    </Item>
                                </Form>
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
