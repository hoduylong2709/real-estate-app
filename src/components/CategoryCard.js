import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const CategoryCard = ({ imageUri, categoryName }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 2 }}>
        <Image
          source={imageUri}
          style={styles.image}
        />
      </View>
      <View style={styles.nameContainer}>
        <Text>{categoryName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 110,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 20
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  nameContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10
  }
});

export default CategoryCard;

