import React, {useContext} from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {AppContext} from '../../context';
import {space, styles} from '../style';
import {useNavigation} from '@react-navigation/native';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import {NativeImage} from '../shared/NativeImage';
import {useSelector} from 'react-redux';

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
  const {user} = useSelector((state: any) => state.user);
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
          <MaterialIndicator
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
