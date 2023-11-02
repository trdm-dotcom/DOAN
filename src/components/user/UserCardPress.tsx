import React, {useContext} from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {AppContext} from '../../context';
import {useAppSelector} from '../../reducers/redux/store';
import {space, styles} from '../style';
import {useNavigation} from '@react-navigation/native';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {BallIndicator} from 'react-native-indicators';
import {NativeImage} from '../shared/NativeImage';

type UserCardProps = {
  userId: number;
  avatar: string;
  name: string;
  handlerOnPress: () => Promise<void>;
  ChildrenButton: React.FC;
  indicatorColor?: string;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

const UserCardPress = ({
  userId,
  avatar,
  name,
  handlerOnPress,
  ChildrenButton,
  indicatorColor,
  style,
  buttonStyle,
}: UserCardProps) => {
  const {theme} = useContext(AppContext);
  const user: IUserInfoResponse = useAppSelector(state => state.auth.userInfo);
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigateToProfile = () => {
    if (userId === user.id) {
      return;
    }
    navigation.navigate('Profile', {userId: userId});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={navigateToProfile}
      style={[styles(theme).userCardContainer, style]}>
      <View style={[styles(theme).row]}>
        <NativeImage uri={avatar} style={styles(theme).tinyImage} />
        <Text style={[styles(theme).nameText, space(IconSizes.x1).ml]}>
          {name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setLoading(true);
          handlerOnPress().finally(() => setLoading(false));
        }}
        disabled={loading}
        activeOpacity={0.9}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
          },
          buttonStyle,
        ]}>
        {loading ? (
          <BallIndicator
            size={IconSizes.x6}
            color={indicatorColor || ThemeStatic.white}
          />
        ) : (
          <ChildrenButton />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default UserCardPress;
