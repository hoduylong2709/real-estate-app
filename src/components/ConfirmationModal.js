import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';

const ConfirmationModal = ({ isModalVisible, closeModal, removeImage }) => {
  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        animationIn='slideInDown'
        animationOut='slideOutUp'
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Delete the image?</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.option}
            onPress={removeImage}
          >
            <Text style={{ color: 'red', fontSize: 17 }}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.option}
            onPress={closeModal}
          >
            <Text style={{ fontSize: 17 }}>Cancel</Text>
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
    alignItems: 'center',
    padding: 10
  },
  option: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default ConfirmationModal;

