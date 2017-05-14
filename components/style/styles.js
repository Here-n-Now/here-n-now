const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
    flexDirection: 'row'
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500"
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: constants.actionColor,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  containerVid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenVid: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fabVid: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
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
})

module.exports = styles
module.exports.constants = constants;
