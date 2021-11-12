import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const CategoryCard = ({ imageUri, categoryName }) => {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={{ fontWeight: 'bold' }}>{categoryName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  image: {
    height: 80,
    width: 100
  },
  textContainer: {
    padding: 10, width: 100
  }
});

export default CategoryCard;

