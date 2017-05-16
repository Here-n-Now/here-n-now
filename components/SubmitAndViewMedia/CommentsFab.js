import React from 'react';
import { Icon, Fab } from 'native-base';

export default CommentsFab = (props) => {
  return (
    <Fab
      position="bottomLeft"
      style={props.finalText ? {backgroundColor:'green'} : {backgroundColor:'black'}}
      onPress={
        () => {props.setState({modalVisible: true})}
      }>
      <Icon name="md-chatboxes" />
    </Fab>
  );
};
