import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import Camera from 'react-native-camera';
import Video from 'react-native-video';
import { Icon } from 'native-base';
import styles from './style/app'

export default class CameraApp extends Component {
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
      icon = require('../public/assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('../public/assets/ic_camera_front_white.png');
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
      icon = require('../public/assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('../public/assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('../public/assets/ic_flash_off_white.png');
    }

    return icon;
  }

  render() {
    return (
      <View style={styles.containerCam}>
        <Camera
          ref={cam => this.camera = cam }
          style={styles.previewCam}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          defaultTouchToFocus
          mirrorImage={false}
        />
      <View style={[styles.overlayCam, styles.topOverlayCam]}>
          <TouchableOpacity
            style={styles.typeButtonCam}
            onPress={this.switchType}
          >
            <Image
              source={this.typeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButtonCam}
            onPress={this.switchFlash}
          >
            <Image
              source={this.flashIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlayCam, styles.bottomOverlayCam]}>
          {
            !this.state.isRecording
            &&
            <TouchableOpacity
                style={styles.captureButton}
                onPress={this.takePicture}
            >
              <Image
                  source={require('../public/assets/ic_photo_camera_36pt.png')}
              />
            </TouchableOpacity>
            ||
            //can we get here? Change to AND statment?
            null
          }
          <View style={styles.buttonsSpaceCam} />
          {
            this.state.isRecording
            &&
            <TouchableOpacity
                style={styles.captureButton}
                onPress={this.state.isLive ? this.stopLive : this.stopRecording}
            >
              <Image
                  source={require('../public/assets/ic_stop_36pt.png')}
              />
            </TouchableOpacity>
          }
          {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.startRecording}
              >
                <Image
                    source={require('../public/assets/ic_videocam_36pt.png')}
                />
              </TouchableOpacity>
          }
          <View style={styles.buttonsSpaceCam} />
          {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.liveCaptureButton}
                  onPress={this.startLive}
              >
                <Icon name='ios-radio-outline' />
              </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}
