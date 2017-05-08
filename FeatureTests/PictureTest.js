import React from 'react';
import { Button, Image, View, ImagePickerIOS } from 'react-native';

export default class PictureTest extends React.Component {
  state = {
    image: null,
  };

  // _pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });
  //
  //   console.log(result);
  //
  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // };
  //
  // _snapImage = async () => {
  //   let result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });
  //
  //   console.log(result);
  //
  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // };

  nativePickImage() {
  ImagePickerIOS.openSelectDialog({}, imageUri => {
      this.setState({ image: imageUri });
    }, error => console.error(error));
  }

  nativeSnapImage() {
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
