import React, {useContext, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import posed from 'react-native-pose';
import Typography from '../../theme/Typography';
import {AppContext} from '../../context';
import {ThemeColors} from '../../constants/Types';

const {FontWeights, FontSizes} = Typography;

type AnimatedSearchBarProps = {
  value: string | null;
  onChangeText: (text: any) => void;
  onFocus?: any;
  onBlur?: any;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
};

const TransitionInput = posed(TextInput)({
  focused: {width: '80%'},
  notFocused: {width: '100%'},
});

const TransitionTouchableOpacity = posed(TouchableOpacity)({
  focused: {width: 70},
  notFocused: {width: 0},
});

const AnimatedSearchBar = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  style,
}: AnimatedSearchBarProps) => {
  const {theme} = useContext(AppContext);
  const [focused, setFocused] = useState(false);

  const onOpen = () => {
    setFocused(true);
    onFocus();
  };

  const onCancel = () => {
    setFocused(false);
    Keyboard.dismiss();
    onChangeText(null);
    onBlur();
  };

  const pose = focused ? 'focused' : 'notFocused';

  return (
    <View style={styles().container}>
      <TransitionInput
        pose={pose}
        onFocus={onOpen}
        style={[styles(theme).animatedSearchBar, style]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.text02}
        onChangeText={onChangeText}
      />
      <TransitionTouchableOpacity
        pose={pose}
        activeOpacity={0.9}
        onPress={onCancel}
        style={[styles().cancel]}>
        <Text style={styles(theme).cancelText}>Cancel</Text>
      </TransitionTouchableOpacity>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    animatedSearchBar: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      paddingVertical: Platform.select({ios: 10, android: 10}),
      paddingHorizontal: 20,
      backgroundColor: theme.placeholder,
      color: theme.text01,
      borderRadius: 10,
      marginVertical: 10,
    },
    cancel: {
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {
      height: 20,
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
  });

export default AnimatedSearchBar;
