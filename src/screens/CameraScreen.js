import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Camera } from 'expo-camera';
import CameraPreview from '../components/CameraPreview';
import * as constants from '../constants';

const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState('off');
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const captureImageFromCamera = navigation.getParam('captureImageFromCamera');

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      alert('Access camera denied!');
    }
  };

  const takePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front');
    } else {
      setCameraType('back');
    }
  };

  const handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off');
    } else if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('auto');
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };

  const savePhoto = () => {
    setStartCamera(false);
    setCapturedImage(null);
    setPreviewVisible(false);
    setFlashMode('off');
    setCameraType(Camera.Constants.Type.back);
    captureImageFromCamera(capturedImage);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={__startCamera} />
      {
        startCamera ?
          (
            <View style={{ flex: 1, width: '100%' }}>
              {previewVisible && capturedImage ? (
                <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={retakePicture} />
              ) : (<Camera
                style={{ height: '100%', width: '100%' }}
                ref={cameraRef}
                ratio='4:3'
                flashMode={flashMode}
                type={cameraType}
              >
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 90,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleFlashMode}
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                    borderRadius: 30,
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    ⚡️
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={switchCamera}
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '15%',
                    marginTop: 20,
                    borderRadius: 30,
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    {cameraType === 'front' ? '🤳' : '📷'}
                  </Text>
                </TouchableOpacity>
              </Camera>)}
            </View>
          ) :
          null
      }
    </View>
  );
};

CameraScreen.navigationOptions = () => {
  return {
    headerTintColor: constants.MAIN_COLOR,
    headerTitleStyle: {
      color: 'black'
    },
    headerStyle: {
      elevation: 0
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default CameraScreen;
