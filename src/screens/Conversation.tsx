import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppContext} from '../context';
import {RootStackParamList} from '../navigators/RootStack';
import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {styles} from '../components/style';
import {useAppSelector} from '../reducers/redux/store';
import ConversationScreenPlaceholder from '../components/placeholder/ConversationScreen.Placeholder';
import {transformMessages} from '../utils/shared';
import {GiftedChat} from 'react-native-gifted-chat';
import CustomScrollToBottom from '../components/message/CustomScrollToBottom';
import CustomMessageText from '../components/message/CustomMessageText';
import CustomBubble from '../components/message/CustomBubble';
import CustomSend from '../components/message/CustomSend';
import CustomInputToolbar from '../components/message/CustomInputToolbar';
import CustomComposer from '../components/message/CustomComposer';

type props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;
const Conversation = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const user = useAppSelector(state => state.auth.userInfo);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);

  let content = <ConversationScreenPlaceholder />;

  if (!error && !loading) {
    const transform = transformMessages(messages);

    content = (
      <GiftedChat
        scrollToBottom
        alwaysShowSend
        inverted={false}
        maxInputLength={200}
        messages={transform}
        scrollToBottomComponent={CustomScrollToBottom}
        textInputProps={{disable: true}}
        renderComposer={composerProps => <CustomComposer {...composerProps} />}
        renderMessageText={CustomMessageText}
        renderBubble={CustomBubble}
        renderSend={CustomSend}
        renderInputToolbar={CustomInputToolbar}
        onSend={onSend}
        onPressAvatar={navigateToProfile}
        user={{_id: user.id}}
        keyboardShouldPersistTaps={null}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          style: {marginBottom: 16},
        }}
      />
    );
  }

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      {content}
    </View>
  );
};

export default Conversation;
