import React from 'react';
import { Modal } from 'react-native';
import { Text, ListItem, Grid, Col, Item, Input, Footer, Icon, Button, Content, Title, Header, Left, Right, Body } from 'native-base';
import ViewComments from './ViewComments';

export default ViewCommentsModal = (props) => {
  const { modalVisible, comments, comment, text } = props;
  console.log('props Inside ViewCommentsModal: ',props)
  return (
    <Modal
      animationType={'slide'}
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {alert('Modal has been closed.')}}
      >

      <Header>
          <Left>
              <Button transparent onPress={() => props.setState({modalVisible: false})}>
                  <Icon name="close" />
              </Button>
          </Left>
          <Body>
              <Title>Comments</Title>
          </Body>
          <Right />
      </Header>
      <Content>
        {!!text && <Text style={{margin:15}}>{text}</Text>}
      <ListItem itemDivider>
        <Text>{comments ? comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment` : 'No comments'}</Text>
      </ListItem>
      <Grid>
          <Col size={75}>
            <Item>
                <Input
                  onChangeText={commentText => props.setState({comment: commentText})}
                  value={comment}
                  placeholder="Leave a comment..."
                />
            </Item>
          </Col>
          <Col size={25}>
            <Button block onPress={ props.postComment } >
              <Text>Share</Text>
            </Button>
          </Col>
        </Grid>
        {comments && comments.map(singleComment => <ViewComments comment={singleComment} /> )}
      </Content>
    </Modal>
  );
};
