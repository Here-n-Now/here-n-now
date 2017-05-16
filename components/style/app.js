import {StyleSheet} from 'react-native';
import config from "../config/app.js";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: config.screenWidth,
    height: config.screenHeight,
    //borderWidth: 1, borderColor: "red"
  },
  logo: {
    position: "absolute",
    width: 100,
    height: 50,
    top: 0,
    left: 0,
    //borderWidth: 1, borderColor: "white"
    backgroundColor: "rgba(255, 255, 255, 0.5)"
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: config.screenWidth,
    height: config.screenHeight
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: config.screenWidth,
    height: config.screenHeight,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  joinContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: config.screenWidth,
    height: config.screenHeight,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderWidth: 1, borderColor: "white"
  },
  joinLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinName: {
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    textAlign: "center",
    color: "white"
  },
  joinButton: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#337ab7",
    padding: 10
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  containerCam: {
    flex: 1,
  },
  previewCam: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayCam: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlayCam: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlayCam: {
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
  liveCaptureButton: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButtonCam: {
    padding: 5,
  },
  flashButtonCam: {
    padding: 5,
  },
  buttonsSpaceCam: {
    width: 10,
  },
  fullScreenVid: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fabs: {
    backgroundColor: 'green',
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  formVid: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white',
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  progressVid: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompletedVid: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemainingVid: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
});
