import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  AppRegistry,
} from 'react-native';
import Camera from 'react-native-camera';
import Video from 'react-native-video';
import { Icon } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});

export default class VideoTest extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios='ios-camera-outline' android="ios-camera-outline" style={{color: tintColor}} />
      )
  }
  constructor(props) {
    super(props);

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
      image: null,
      video: null
    };
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then(image => this.setState({image: image.path}))
        .catch(err => console.error(err));
    }
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({
        audio: true,
        mode: Camera.constants.CaptureMode.video
      })
          .then(video => this.props.navigation.navigate('RenderVideoTest', {video: video.path}))
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
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          defaultTouchToFocus
          mirrorImage={false}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={this.switchType}
          >
            <Image
              source={this.typeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}
          >
            <Image
              source={this.flashIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
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
          <View style={styles.buttonsSpace} />
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
              ||
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.stopRecording}
              >
                <Image
                    source={require('../public/assets/ic_stop_36pt.png')}
                />
              </TouchableOpacity>
          }
        </View>
        {this.state.image &&
          <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
        {this.state.video &&
          <Video source={{uri: this.state.video}}
             ref={(ref) => {
               this.player = ref
             }}
             rate={1.0}
             volume={1.0}
             muted={false}
             paused={false}
             resizeMode="cover"
             repeat={true}
             playInBackground={false}
             playWhenInactive={false}
             progressUpdateInterval={250.0}
             onLoadStart={this.loadStart}
             onLoad={this.setDuration}
             onProgress={this.setTime}
             onEnd={this.onEnd}
             onError={this.videoError}
             onBuffer={this.onBuffer}
             style={styles.backgroundVideo} />}
      </View>
    );
  }
}
