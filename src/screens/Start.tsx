import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { styles } from '../components/style';
import { RootStackParamList } from '../navigators/RootStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type props = NativeStackScreenProps<RootStackParamList, 'Start'>;

const Start = ({navigation, route}: props) => {
  return (
    <SafeAreaView style={[styles.defaultBackground, styles.safeArea]}>
      <View style={styles.content}>
        
      </View>
    </SafeAreaView>
  );
};

export default Start;
