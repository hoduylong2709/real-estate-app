import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as constants from '../constants';

const ListingDetailScreen = ({ navigation }) => {
  const { photos, isFavorite, pressIcon } = navigation.getParam('listingProperties');
  const [favoriteListing, setFavoriteListing] = useState(isFavorite);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}
        <View style={styles.backgroundImageContainer}>
          <ImageBackground style={styles.backgroudImage} source={{ uri: photos[0].imageUrl }} >
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}
              >
                <View style={styles.headerBtn}>
                  <MaterialIcons
                    name='arrow-back-ios'
                    size={20}
                    color={constants.MAIN_COLOR}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  pressIcon();
                  setFavoriteListing(!favoriteListing);
                }}
              >
                <View style={styles.headerBtn}>
                  {
                    favoriteListing ?
                      <MaterialIcons
                        name='favorite'
                        size={20}
                        color='#ea9999'
                      /> :
                      <MaterialIcons
                        name='favorite-outline'
                        size={20}
                        color='black'
                      />
                  }
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
};

ListingDetailScreen.navigationOptions = () => {
  return {
    headerStyle: {
      elevation: 0
    },
    headerShown: false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350
  },
  backgroudImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  headerBtn: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ListingDetailScreen;

