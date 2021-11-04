import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const PhotoModal = ({ isModalVisible, closeModal, pickImage, captureImage }) => {
  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        animationIn='slideInDown'
        animationOut='slideOutUp'
      >
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.option}
            onPress={captureImage}
          >
            <AntDesign name='camera' size={24} color='grey' style={{ marginRight: 10 }} />
            <Text h5>Take photo from camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.option}
            onPress={pickImage}
          >
            <FontAwesome name='photo' size={24} color='grey' style={{ marginRight: 10 }} />
            <Text h5>Choose photos from gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10
  },
  option: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default PhotoModal;

