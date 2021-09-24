import React, { useContext, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Context as OnboardContext } from '../context/OnboardContext';

const OnboardScreen = ({ navigation }) => {
  const { state, launchFirstTime } = useContext(OnboardContext);

  useEffect(() => {
    launchFirstTime();
  }, []);

  if (state.isFirstLaunched) {
    return (
      <Onboarding
        bottomBarHeight={40}
        bottomBarColor='#a6e4d0'
        onSkip={() => navigation.navigate('Login')}
        onDone={() => navigation.navigate('Login')}
        titleStyles={{ fontWeight: 'bold', color: 'white', fontSize: 31 }}
        subTitleStyles={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}
        pages={[
          {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/re-onboarding-1.png')} />,
            title: 'Dream house',
            subtitle: 'We provide a lot of options so you can easily find out your dream house',
          },
          {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/re-onboarding-2.png')} />,
            title: 'Reliable & Safe',
            subtitle: 'All negotiations are reliable and safe',
          },
          {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/onboarding-img3.png')} />,
            title: 'Onboarding 3',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
        ]}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({});

export default OnboardScreen;

