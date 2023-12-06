import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeColors} from '../../constants/Types';
import {AppContext} from '../../context';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';
import {NativeImage} from '../shared/NativeImage';
import {IconSizes} from '../../constants/Constants';
import {space, styles as globalStyles} from '../style';
import IconButton from '../control/IconButton';

const {FontWeights, FontSizes} = Typography;

type ProfileCardProps = {
  avatar: string;
  name: string;
  posts: number;
  friends: number;
  onFriendsOpen: any;
  onOptionPress: any;
  renderInteractions?: any;
  editable?: boolean;
  about?: string;
};

const ProfileCard = ({
  avatar,
  name,
  posts,
  friends,
  onFriendsOpen,
  onOptionPress,
  renderInteractions,
  editable,
  about,
}: ProfileCardProps) => {
  const {theme} = useContext(AppContext);

  return (
    <View style={[space(IconSizes.x1).mt]}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}>
        <View style={styles(theme).avatar}>
          <NativeImage uri={avatar} style={styles(theme).avatarImage} />
        </View>
        <View style={{flex: 1}}>
          <View style={space(IconSizes.x5).ml}>
            <Text style={styles(theme).usernameText}>{name}</Text>
            <Text style={styles(theme).aboutText}>{about}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'center'}}>
          {editable ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onOptionPress}
              style={[
                globalStyles(theme).button,
                globalStyles(theme).buttonPrimary,
                space(IconSizes.x0).pv,
              ]}>
              <Text
                style={[
                  {
                    ...FontWeights.Bold,
                    ...FontSizes.Body,
                    color: ThemeStatic.white,
                  },
                ]}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <IconButton
              onPress={onOptionPress}
              Icon={() => (
                <Ionicons
                  name={'ellipsis-vertical'}
                  size={IconSizes.x6}
                  color={theme.text01}
                />
              )}
            />
          )}
        </View>
      </View>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          },
          space(IconSizes.x5).mv,
        ]}>
        <View style={styles(theme).connections}>
          <Text style={styles(theme).connectionsText}>{posts}</Text>
          <Text style={styles(theme).connectionsType}>POSTS</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onFriendsOpen}
          style={styles(theme).connections}>
          <Text style={styles(theme).connectionsText}>{friends}</Text>
          <Text style={styles(theme).connectionsType}>FRIENDS</Text>
        </TouchableOpacity>
      </View>
      {renderInteractions && renderInteractions()}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    avatar: {
      height: 80,
      width: 80,
    },
    avatarImage: {
      flex: 1,
      backgroundColor: theme.placeholder,
      borderRadius: 80,
    },
    editProfile: {
      position: 'absolute',
      bottom: -10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 40,
      width: 60,
      height: 30,
      borderWidth: 2,
      borderColor: theme.base,
      backgroundColor: theme.accent,
    },
    connections: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    connectionsText: {
      ...FontWeights.Regular,
      ...FontSizes.SubHeading,
      color: theme.text02,
    },
    connectionsType: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 5,
    },
    usernameText: {
      ...FontWeights.Bold,
      ...FontSizes.Body,
      color: theme.text01,
    },
    aboutText: {
      ...FontWeights.Regular,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 5,
    },
  });

export default ProfileCard;
