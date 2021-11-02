import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const AvatarImageModal = ({ isModalVisible, closeModal, changeAvatar, removeAvatar }) => {
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
            onPress={changeAvatar}
          >
            <MaterialIcons name='edit' size={20} color='grey' style={{ marginRight: 7 }} />
            <Text style={{ fontSize: 16 }}>Change Profile Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.option}
            onPress={removeAvatar}
          >
            <Ionicons name='md-trash-bin' size={20} color='grey' style={{ marginRight: 7 }} />
            <Text style={{ fontSize: 16 }}>Remove Profile Image</Text>
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

export default AvatarImageModal;

