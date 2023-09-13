import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, styles} from './style';

export const HeaderBackButton = () => {
  const navigate = useNavigation();

  return (
    <View style={[styles.headerStyle]}>
      <PressableOpacity onPress={() => navigate.goBack()}>
        <Ionicons name="arrow-back-outline" color={colors.white} size={24} />
      </PressableOpacity>
    </View>
  );
};
