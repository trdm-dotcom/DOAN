import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';

const {FontWeights, FontSizes} = Typography;

type IconButtonProps = {
  Icon: React.FC;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  hasBadge?: boolean;
  badgeCount?: number;
};

const IconButton = ({
  Icon,
  onPress,
  style,
  hasBadge,
  badgeCount,
}: IconButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    style={[styles.container, style]}>
    <Icon />
    {hasBadge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  badge: {
    position: 'absolute',
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
    right: -10,
    borderRadius: 10,
    backgroundColor: ThemeStatic.accent,
  },
  badgeText: {
    ...FontWeights.Bold,
    ...FontSizes.Caption,
    color: ThemeStatic.white,
  },
});

export default IconButton;
