import React, {useContext, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../context';
import Typography from '../../theme/Typography';
import LoadingIndicator from '../shared/LoadingIndicator';
import {IconSizes} from '../../constants/Constants';
import {ThemeStatic} from '../../theme/Colors';
import {ThemeColors} from '../../constants/Types';
import {addComment} from '../../reducers/action/post';
import IconButton from '../control/IconButton';
import {createAsyncDelay} from '../../utils/shared';
import {searchFriend} from '../../reducers/action/friend';
import {MentionInput} from 'react-native-controlled-mentions';
import Suggestions from '../shared/Suggestions';
import {checkEmpty} from '../../utils/Validate';

const {FontWeights, FontSizes} = Typography;

type CommentInputProps = {
  postId: string;
};

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
}: CommentInputProps) => {
  const {theme} = useContext(AppContext);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const postComment = async () => {
    if (checkEmpty(comment, 'Comment is empty.') != null) {
      return;
    }
    try {
      setLoading(true);
      await addComment({comment: comment, postId: postId});
      Keyboard.dismiss();
      setComment('');
      await createAsyncDelay(1200);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const identifyKeyword = (text: string) => {
    const pattern = new RegExp('\\B@[a-z0-9_-]+|\\B@', 'gi');
    const keywordArray = text.match(pattern);
    if (keywordArray && !!keywordArray.length) {
      const lastKeyword = keywordArray[keywordArray.length - 1];
      if (lastKeyword.slice(1).trim().length > 0) {
        searchFriend({search: lastKeyword.slice(1)}).then(res => {
          setSuggestions(res);
        });
      }
    }
  };

  return (
    <View style={styles().container}>
      <MentionInput
        containerStyle={styles(theme).commentTextInput}
        style={[
          {
            ...FontWeights.Regular,
            ...FontSizes.Body,
            color: theme.text01,
          },
        ]}
        placeholderTextColor={theme.text02}
        value={comment}
        placeholder="Add comment..."
        onChange={(text: string) => {
          identifyKeyword(text);
          setComment(text.trim());
        }}
        partTypes={[
          {
            trigger: '@',
            textStyle: {
              ...FontWeights.Regular,
              ...FontSizes.Body,
              color: '#244dc9',
            },
            renderSuggestions: Suggestions(suggestions),
          },
        ]}
      />
      <View>
        {loading ? (
          <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x00} />
        ) : (
          <IconButton
            Icon={() => (
              <Ionicons
                name="paper-plane"
                size={IconSizes.x6}
                color={ThemeStatic.accent}
              />
            )}
            onPress={postComment}
          />
        )}
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    commentAvatarImage: {
      height: 30,
      width: 30,
      backgroundColor: theme.placeholder,
      borderRadius: 50,
    },
    commentTextInput: {
      flex: 1,
      marginHorizontal: 10,
    },
  });

export default CommentInput;
