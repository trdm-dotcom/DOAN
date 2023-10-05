/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useState} from 'react';
import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../style';
import {NativeImage} from '../shared/NativeImage';
import {AppContext} from '../../context';
import AppButton from '../control/AppButton';
import {IconSizes} from '../../constants/Constants';
import Typography from '../../theme/Typography';
import {showError} from '../../utils/Toast';

const {FontWeights, FontSizes} = Typography;

type ItemFriendProps = {
  name: string;
  avatar: string;
  titleButton: string;
  onPress: () => Promise<void>;
};

export const ItemFriend = ({
  name,
  avatar,
  titleButton,
  onPress,
}: ItemFriendProps) => {
  const {theme} = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  const handleOnPress = async () => {
    setLoading(true);
    try {
      await onPress();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles(theme).friendListItem]}>
      <NativeImage uri={avatar} style={styles(theme).tinyAvatar} />
      <View style={styles(theme).container}>
        <Text
          style={[
            styles(theme).centerText,
            {
              ...FontWeights.Regular,
              ...FontSizes.Body,
            },
          ]}>
          {name}
        </Text>
      </View>
      <AppButton
        label={titleButton}
        onPress={handleOnPress}
        loading={loading}
        Icon={() => (
          <Ionicons
            name="add-outline"
            size={IconSizes.x6}
            color={theme.accent}
          />
        )}
      />
    </View>
  );
};
