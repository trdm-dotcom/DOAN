/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import LoadingIndicator from '../shared/LoadingIndicator';
import Typography from '../../theme/Typography';
import {ThemeStatic} from '../../theme/Colors';
import {IconSizes} from '../../constants/Constants';

const {FontWeights, FontSizes} = Typography;

type ButtonProps = {
  Icon?: React.FC;
  label: string;
  onPress: any;
  loading: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;
};

const AppButton = ({
  Icon,
  label,
  onPress,
  loading,
  containerStyle,
  labelStyle,
  indicatorColor,
}: ButtonProps) => {
  let content = (
    <LoadingIndicator
      size={IconSizes.x1}
      color={indicatorColor || ThemeStatic.white}
    />
  );
  if (!loading) {
    content = (
      <>
        {Icon && <Icon />}
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.button, containerStyle]}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  label: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    marginLeft: 5,
    color: ThemeStatic.white,
  },
});

export default AppButton;
