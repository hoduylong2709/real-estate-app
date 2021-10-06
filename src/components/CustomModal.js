import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Modal from 'react-native-modal';

const CustomModal = ({ isError, hideModal, text }) => {
  return (
    <View>
      <Modal
        isVisible={isError}
        onBackdropPress={hideModal}
        animationIn='slideInDown'
        animationOut='slideOutUp'
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../assets/error.png')}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={{ textAlign: 'center', color: 'red' }}>{text}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    marginLeft: 30,
    marginRight: 30
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
  contentContainer: {
    justifyContent: "center",
    margin: 15
  }
});

export default CustomModal;

