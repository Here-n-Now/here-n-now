import Camera from 'react-native-camera';
import React, { Component } from 'react';

export default class Camera extends Component {
  render() {
    const { camera } = this.props;
    return (
      <Camera
        ref={cam => this.camera = cam }
        style={styles.previewCam}
        aspect={camera.aspect}
        captureTarget={camera.captureTarget}
        type={camera.type}
        flashMode={camera.flashMode}
        onFocusChanged={() => {}}
        onZoomChanged={() => {}}
        defaultTouchToFocus
        mirrorImage={false}
      />
    )
  }
}
