import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeColors} from '../../constants/Types';
import {AppContext} from '../../context';
import {ThemeStatic} from '../../theme/Colors';
import Typography from '../../theme/Typography';
import {NativeImage} from '../shared/NativeImage';

const {FontWeights, FontSizes} = Typography;

type ProfileCardProps = {
  avatar: string;
  name: string;
  posts: number;
  friends: number;
  onFriendsOpen: any;
  renderInteractions?: any;
  editable?: boolean;
  onEdit?: any;
};

const ProfileCard = ({
  avatar,
  name,
  posts,
  friends,
  onFriendsOpen,
  renderInteractions,
  editable,
  onEdit,
}: ProfileCardProps) => {
  const {theme} = useContext(AppContext);
  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).info}>
        <View style={styles(theme).connections}>
          <Text style={styles(theme).connectionsText}>{posts}</Text>
          <Text style={styles(theme).connectionsType}>POSTS</Text>
        </View>
        <View style={styles(theme).avatar}>
          <NativeImage uri={avatar} style={styles(theme).avatarImage} />
          {editable && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onEdit}
              style={styles(theme).editProfile}>
              <Ionicons name="add" size={16} color={ThemeStatic.white} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onFriendsOpen}
          style={styles(theme).connections}>
          <Text style={styles(theme).connectionsText}>{friends}</Text>
          <Text style={styles(theme).connectionsType}>FRIENDS</Text>
        </TouchableOpacity>
      </View>
      <View style={styles(theme).name}>
        <Text style={styles(theme).usernameText}>{name}</Text>
      </View>
      {renderInteractions && renderInteractions()}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingTop: 10,
      paddingBottom: 4,
      paddingHorizontal: 10,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    avatar: {
      height: 120,
      width: 120,
    },
    avatarImage: {
      flex: 1,
      backgroundColor: theme.placeholder,
      borderRadius: 120,
    },
    editProfile: {
      position: 'absolute',
      bottom: -10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 40,
      width: 60,
      height: 32,
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
      color: theme.text01,
    },
    connectionsType: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 5,
    },
    name: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    usernameText: {
      ...FontWeights.Bold,
      ...FontSizes.SubHeading,
      color: theme.text01,
    },
    handleText: {
      ...FontWeights.Bold,
      ...FontSizes.Body,
      color: theme.text02,
      marginTop: 5,
    },
    about: {
      padding: 16,
      marginTop: 16,
      backgroundColor: theme.accent,
      borderRadius: 10,
      marginBottom: 10,
    },
    aboutTitle: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.white,
    },
    aboutText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.white,
      marginTop: 5,
    },
  });

export default ProfileCard;
