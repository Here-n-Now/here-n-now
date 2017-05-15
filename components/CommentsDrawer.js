'use strict'
import React, { Component } from 'react';
import { Container, Content, Text, ListItem, Button } from 'native-base';

const Comments = props => {
    return (
        <Container>
            <Content>
              <ListItem itemDivider>
                  <Text>Comments</Text>
              </ListItem>
              {/*props.comments.map(comment =>{
                return <Comment comment={comment}/>
              })*/}
              <ListItem>
                <Text>HERRO</Text>
              </ListItem>
                <Button
                  primary
                  onPress={() => props.close()}
                  style={{margin:20}}
                >
                  <Text>Close</Text>
                </Button>
            </Content>
        </Container>
    );
  }

export default Comments

