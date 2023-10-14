import React, {useContext} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {AppContext} from '../context';
import Typography from '../theme/Typography';
import {ThemeColors} from '../constants/Types';

const {FontWeights, FontSizes} = Typography;

type SvgBannerProps = {
  Svg: any;
  placeholder: string;
  spacing?: number;
  textStyle?: StyleProp<TextStyle>;
};

const SvgBanner = ({Svg, placeholder, spacing, textStyle}: SvgBannerProps) => {
  const {theme} = useContext(AppContext);

  return (
    <View
      style={[
        styles().container,
        spacing ? {marginTop: responsiveHeight(spacing)} : null,
      ]}>
      <Svg />
      <Text style={[styles(theme).placeholderText, textStyle]}>
        {placeholder}
      </Text>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    placeholderText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      color: theme.text02,
      marginTop: 40,
    },
  });

export default SvgBanner;
