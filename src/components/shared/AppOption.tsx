import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {IconSizes} from '../../constants/Constants';

const {FontWeights, FontSizes} = Typography;

type OptionProps = {
  label?: string;
  iconName: string;
  onPress?: () => void;
  children?: any;
  color?: string;
};

const AppOption = ({
  label,
  iconName,
  onPress,
  children,
  color,
}: OptionProps) => {
  const {theme} = useContext(AppContext);

  if (children) {
    return (
      <View style={styles().container}>
        <Ionicons
          name={iconName}
          size={IconSizes.x5}
          color={color || theme.text01}
        />
        {children}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles().container}
      activeOpacity={0.9}
      onPress={onPress}>
      <Ionicons
        name={iconName}
        size={IconSizes.x6}
        color={color || theme.text01}
      />
      <Text style={[styles().label, {color: color || theme.text01}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    label: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
    },
  });

export default AppOption;
