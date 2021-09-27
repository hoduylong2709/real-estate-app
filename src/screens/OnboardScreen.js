import React, { useContext, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Context as OnboardContext } from '../context/OnboardContext';
import * as constants from '../constants';

const OnboardScreen = ({ navigation }) => {
  const { state, launchFirstTime } = useContext(OnboardContext);

  useEffect(() => {
    launchFirstTime();
  }, []);

  if (state.isFirstLaunched) {
    return (
      <Onboarding
        bottomBarHeight={40}
        bottomBarColor={constants.ONBOARD_COLOR}
        onSkip={() => navigation.navigate('Welcome')}
        onDone={() => navigation.navigate('Welcome')}
        titleStyles={{ fontWeight: 'bold', color: 'white', fontSize: 31 }}
        subTitleStyles={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}
        pages={[
          {
            backgroundColor: constants.ONBOARD_COLOR,
            image: <Image source={require('../../assets/re-onboarding-1.png')} />,
            title: 'Dream house',
            subtitle: 'We provide a lot of options so you can easily find out your dream house',
          },
          {
            backgroundColor: constants.ONBOARD_COLOR,
            image: <Image source={require('../../assets/re-onboarding-2.png')} />,
            title: 'Reliable & Safe',
            subtitle: 'All information are reliable and safe',
          },
          {
            backgroundColor: constants.ONBOARD_COLOR,
            image: <Image source={require('../../assets/re-onboarding-3.png')} />,
            title: 'Continuous Updates',
            subtitle: 'Continuous updates to make sure you find the suitable home quicky',
          },
        ]}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({});

export default OnboardScreen;

