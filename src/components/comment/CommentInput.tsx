import React, {useContext, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
import MentionsTextInput from 'react-native-mentions';
import {MaterialIndicator} from 'react-native-indicators';
import {searchFriend} from '../../reducers/action/friend';

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
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const reqTimerRef = useRef(0);

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

  const onSuggestionTap = (username, hidePanel) => {
    hidePanel();
    const value = comment.slice(0, -keyword.length);
    setComment(value + '@' + username);
    setData([]);
  };

  const callback = value => {
    if (reqTimerRef.current) {
      clearTimeout(reqTimerRef.current);
    }
    reqTimerRef.current = setTimeout(() => {
      searchFriend({search: value.slice(1)}).then(res => {
        setKeyword(value);
        setData(res);
      });
    }, 200) as unknown as number;
  };

  const renderSuggestionsRow = ({item}, hidePanel) => (
    <TouchableOpacity onPress={() => onSuggestionTap(item.UserName, hidePanel)}>
      <View style={styles(theme).container}>
        <NativeImage
          uri={item.avatar}
          style={styles(theme).commentAvatarImage}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 10,
            paddingRight: 15,
          }}>
          <Text
            style={{
              ...FontWeights.Regular,
              ...FontSizes.Body,
              color: theme.text01,
            }}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      {/* <MentionsTextInput
        textInputStyle={styles(theme).commentTextInput}
        loadingComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIndicator size={IconSizes.x6} color={ThemeStatic.accent} />
          </View>
        )}
        textInputMinHeight={30}
        textInputMaxHeight={80}
        trigger={'@'}
        triggerLocation={'new-word-only'}
        value={comment}
        onChangeText={setComment}
        triggerCallback={callback}
        renderSuggestionsRow={renderSuggestionsRow}
        suggestionsData={data}
        keyExtractor={item => item.id.toString()}
        suggestionRowHeight={45}
        horizontal={false}
        MaxVisibleRowCount={3}
      /> */}
      {loading ? (
        <View style={styles().loading}>
          <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x00} />
        </View>
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
          style={styles().postButton}
        />
      )}
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
