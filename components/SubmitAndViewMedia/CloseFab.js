import React from 'react';
import { Icon, Fab } from 'native-base';
import { NavigationActions } from 'react-navigation';

export default CloseFab = (props) => {
  return (
    <Fab
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        shadowColor: 'black',
        shadowOpacity: 1.0,
      }}
      position="topLeft"
      onPress={() => props.backAction(NavigationActions.back({}))
      }>
      <Icon name="ios-close-circle-outline" />
    </Fab>
  );
};
