import React from 'react';
import { Container, Spinner, H2 } from 'native-base';

export default Spin = (props) => {
  return (
    <Container>
      <Spinner style={{marginTop: 100}} />
      <H2 style={{textAlign: 'center'}}>Uploading</H2>
    </Container>
  );
};
