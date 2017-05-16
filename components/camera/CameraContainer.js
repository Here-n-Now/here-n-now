import React, { Component } from 'react';
import { View } from 'react-native';
import Camera from 'react-native-camera';
import { Icon } from 'native-base';

import FlashButton from './FlashButton';
import PictureButton from './PictureButton';
import VideoButton from './VideoButton';
import LiveButton from './LiveButton';
import LiveStreamer from '../LiveStreamer';
import StopVideoAndLiveButton from './StopVideoAndLiveButton';
import styles from '../style/app';

export default class CameraContainer extends Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon name='ios-camera-outline' style={{color: tintColor}} />
      )
  }

  constructor() {
    super()

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.disk,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false,
      isLive: false,
      image: null,
      video: null
    };
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then(image => this.props.navigation.navigate('SubmitContainer', {image: image.path}))
        .catch(err => console.error(err));
    }
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({
        audio: true,
        mode: Camera.constants.CaptureMode.video
      })
          .then(video => this.props.navigation.navigate('SubmitContainer', {video: video.path}))
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  startLive = () => {
    this.setState({
      isLive: true,
      isRecording: true
    });
  }

  stopLive = () => {
    this.setState({
      isLive: false,
      isRecording: false
    });
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;
    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('../../public/assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('../../public/assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('../../public/assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('../../public/assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('../../public/assets/ic_flash_off_white.png');
    }

    return icon;
  }

  render() {
    const {camera, isRecording, isLive} = this.state;
    return (
      <View style={styles.containerCam}>
        {
          isLive ?
          <LiveStreamer />
          :
          <Camera
            ref={cam => this.camera = cam}
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
        }
        <FlashButton
          typeIcon={this.typeIcon}
          flashIcon={this.flashIcon}
          switchType={this.switchType}
          switchFlash={this.switchFlash}
        />
        {
          isRecording ?
          <View style={[styles.overlayCam, styles.bottomOverlayCam]}>
            <StopVideoAndLiveButton
              isLive={isLive}
              stopLive={this.stopLive}
              stopRecording={this.stopRecording} />
          </View>
          :
          <View style={[styles.overlayCam, styles.bottomOverlayCam]}>
            <PictureButton takePicture={this.takePicture} />
            <View style={styles.buttonsSpaceCam} />
            <VideoButton startRecording={this.startRecording} />
            <View style={styles.buttonsSpaceCam} />
            <LiveButton startLive={this.startLive} />
          </View>
        }
      </View>
    );
  }
}
