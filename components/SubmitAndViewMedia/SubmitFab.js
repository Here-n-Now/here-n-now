import React from 'react';
import { Icon, Fab } from 'native-base';

export default SubmitFab = (props) => {
  return (
    <Fab
      position="topRight"
      onPress={props.uploadToStorage}>
      <Icon name="md-send" />
    </Fab>
  );
};
