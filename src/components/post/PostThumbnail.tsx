import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AppContext} from '../../context';
import {NativeImage} from '../shared/NativeImage';
import {ThemeColors} from '../../constants/Types';
import {CONTENT_SPACING, SCREEN_WIDTH} from '../../constants/Constants';

interface PostThumbnailProps {
  id: string;
  uri: string;
}

const PostThumbnail: React.FC<PostThumbnailProps> = ({id, uri}) => {
  const {theme} = useContext(AppContext);
  const {navigate} = useNavigation();

  const navigateToPost = () => navigate('PostView', {postId: id});

  return (
    <TouchableOpacity
      onPress={navigateToPost}
      activeOpacity={0.95}
      style={[styles(theme).container]}>
      <NativeImage uri={uri} style={styles().thumbnailImage} />
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      height: (SCREEN_WIDTH - CONTENT_SPACING) / 3,
      width: (SCREEN_WIDTH - CONTENT_SPACING) / 3,
      backgroundColor: theme.placeholder,
      overflow: 'hidden',
    },
    thumbnailImage: {
      flex: 1,
    },
  });

export default PostThumbnail;
