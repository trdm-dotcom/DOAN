import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppContext} from '../../context';
import {NativeImage} from '../shared/NativeImage';
import {Dimensions, ThemeColors} from '../../constants/Types';

interface PostThumbnailProps {
  id: string;
  uri: string;
  dimensions: Dimensions;
}

const PostThumbnail: React.FC<PostThumbnailProps> = ({id, uri, dimensions}) => {
  const {theme} = useContext(AppContext);
  const {navigate} = useNavigation();

  const navigateToPost = () => navigate('PostView', {postId: id});

  return (
    <TouchableOpacity
      onPress={navigateToPost}
      activeOpacity={0.95}
      style={[styles(theme).container, {...dimensions}]}>
      <NativeImage uri={uri} style={styles().thumbnailImage} />
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.placeholder,
      overflow: 'hidden',
      borderRadius: 5,
    },
    thumbnailImage: {
      flex: 1,
    },
  });

export default PostThumbnail;
