import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {styles} from '../components/style';

export const Loading = () => {
  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <View
        style={[
          styles.container,
          styles.alignItemsCenter,
          styles.justifyContentCenter,
        ]}></View>
    </SafeAreaView>
  );
};
