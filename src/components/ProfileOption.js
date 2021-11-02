import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

const ProfileOption = ({ optionName, icon }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flexGrow: 2 }}>
        {icon}
        <Text style={{ fontSize: 15, marginLeft: 20 }}>{optionName}</Text>
      </View>
      <SimpleLineIcons name='arrow-right' size={18} color='rgb(220, 220, 220)' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.85,
    justifyContent: 'space-between'
  }
});

export default ProfileOption;

