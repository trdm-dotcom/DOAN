import React, {useContext, useState} from 'react';
import {Keyboard, Platform, StyleSheet, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import LoadingIndicator from '../shared/LoadingIndicator';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {ThemeColors} from '../../constants/Types';
import {NativeImage} from '../shared/NativeImage';
import {addComment} from '../../reducers/action/post';
import IconButton from '../control/IconButton';
import {createAsyncDelay} from '../../utils/shared';
import {useSelector} from 'react-redux';
const {FontWeights, FontSizes} = Typography;

type CommentInputProps = {
  postId: string;
  scrollViewRef: React.MutableRefObject<any>;
};

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  scrollViewRef,
}: CommentInputProps) => {
  const {theme} = useContext(AppContext);
  const {user} = useSelector((state: any) => state.user);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const postComment = async () => {
    try {
      setLoading(true);
      await addComment({comment: comment, postId: postId});
      Keyboard.dismiss();
      setComment('');
      await createAsyncDelay(1200);
      return scrollViewRef.current.scrollToEnd();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const Icon = () => (
    <Ionicons
      name="paper-plane"
      size={IconSizes.x6}
      color={ThemeStatic.accent}
    />
  );

  let content = (
    <View style={styles().loading}>
      <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x00} />
    </View>
  );

  if (!loading) {
    content = (
      <IconButton
        Icon={Icon}
        onPress={postComment}
        style={styles().postButton}
      />
    );
  }

  return (
    <View style={styles().container}>
      <NativeImage uri={user.avatar} style={styles(theme).commentAvatarImage} />
      <TextInput
        style={styles(theme).commentTextInput}
        value={comment}
        placeholder={'Add comment...'}
        placeholderTextColor={theme.text02}
        onChangeText={setComment}
      />
      {content}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentAvatarImage: {
      height: 30,
      width: 30,
      backgroundColor: theme.placeholder,
      marginRight: 10,
      borderRadius: 50,
    },
    commentTextInput: {
      flex: 1,
      ...FontWeights.Regular,
      ...FontSizes.Body,
      paddingVertical: Platform.select({ios: 8, android: 6}),
      paddingHorizontal: 20,
      backgroundColor: theme.placeholder,
      color: theme.text01,
      borderRadius: 10,
      marginVertical: 5,
    },
    loading: {
      marginLeft: 10,
    },
    postButton: {
      width: undefined,
      marginLeft: 10,
    },
  });

export default CommentInput;
