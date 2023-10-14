import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LoadingIndicator from '../shared/LoadingIndicator';
import Typography from '../../theme/Typography';
import {ThemeStatic} from '../../theme/Colors';
import {IconSizes} from '../../constants/Constants';
import {styles} from '../style';

const {FontWeights, FontSizes} = Typography;

type ButtonProps = {
  Icon?: React.FC;
  label: string;
  onPress: () => any | Promise<any>;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;
  disabled?: boolean;
};

const AppButton = ({
  Icon,
  label,
  onPress,
  loading,
  containerStyle,
  labelStyle,
  indicatorColor,
  disabled,
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
        <Text
          style={[
            {
              ...FontWeights.Regular,
              ...FontSizes.Body,
              marginLeft: 5,
              color: ThemeStatic.white,
            },
            labelStyle,
          ]}>
          {label}
        </Text>
      </>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles().button, containerStyle]}
      disabled={disabled}>
      {content}
    </TouchableOpacity>
  );
};

export default AppButton;
