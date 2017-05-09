import React from 'react';
import { Button, Image, View, ImagePickerIOS } from 'react-native';

export default class PictureTest extends React.Component {
  constructor(){
    super()
    this.state = {
      image: null,
    };
  }

  nativePickImage = () => {
    ImagePickerIOS.openSelectDialog({}, imageUri => {
      this.setState({ image: imageUri });
    }, error => console.error(error));
  }

  nativeSnapImage = () => {
//   ImagePickerIOS.canRecordVideos(result => console.log(result))
//   ImagePickerIOS.canUseCamera(result => console.log(result))
    ImagePickerIOS.openCameraDialog({}, imageUri => {
      this.setState({ image: imageUri });
    }, error => console.error(error));
  }

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this.nativePickImage}
        />
        <Button
          title="Snap an image with camera"
          onPress={this.nativeSnapImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
}
