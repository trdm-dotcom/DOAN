import React from 'react';
import {StyleSheet, View} from 'react-native';
import LoadingIndicator from '../shared/LoadingIndicator';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';

const ConversationScreenPlaceholder = () => (
  <View style={styles.container}>
    <LoadingIndicator size={IconSizes.x2} color={ThemeStatic.accent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConversationScreenPlaceholder;
