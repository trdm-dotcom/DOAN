import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from '../components/style';

const Home = () => {
  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default Home;
