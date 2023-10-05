/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import {ThemeColors} from '../../constants/Types';

const {FontWeights, FontSizes} = Typography;

type ListEmptyComponentProps = {
  listType?: string;
  spacing: number;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  placeholderStyle?: StyleProp<TextStyle>;
};

const ListEmptyComponent = ({
  listType,
  spacing,
  style,
  placeholder,
  placeholderStyle,
}: ListEmptyComponentProps) => {
  const {theme} = useContext(AppContext);
  let content = `No ${listType} yet`;
  if (placeholder) {
    content = placeholder;
  }

  return (
    <View
      style={[styles().container, {height: responsiveHeight(spacing)}, style]}>
      <Text style={[styles(theme).placeholderText, placeholderStyle]}>
        {content}
      </Text>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    placeholderText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      color: theme.text02,
    },
  });

export default ListEmptyComponent;
