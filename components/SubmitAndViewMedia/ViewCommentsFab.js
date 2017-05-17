import React from 'react';
import { Icon, Fab } from 'native-base';

export default ViewCommentsFab = (props) => {
  return (
    <Fab
      position="bottomLeft"
      onPress={
        () => {
          props.getFromFirebaseDB();
          props.setState({modalVisible: true});
        }
      }>
      <Icon name="md-chatboxes" />
    </Fab>
  );
};
