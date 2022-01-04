import React from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RenderRight = ({ progress, dragX, pressTrashIcon }) => {
  const scale = dragX.interpolate({
    inputRange: [-50, 0.5],
    outputRange: [1, 0.1]
  });

  const Style = {
    transform: [
      {
        scale
      }
    ]
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.65}
      onPress={pressTrashIcon}
    >
      <Animated.View
        style={[Style]}
      >
        <FontAwesome name='trash' size={17} color='white' />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    backgroundColor: '#E34234',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default RenderRight;

