import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppContext} from '../context';
import {RootStackParamList} from '../navigators/RootStack';
import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';
import {styles} from '../components/style';
import {useAppSelector} from '../reducers/redux/store';
import ConversationScreenPlaceholder from '../components/placeholder/ConversationScreen.Placeholder';
import {GiftedChat} from 'react-native-gifted-chat';
import CustomScrollToBottom from '../components/message/CustomScrollToBottom';
import CustomMessageText from '../components/message/CustomMessageText';
import CustomBubble from '../components/message/CustomBubble';
import CustomSend from '../components/message/CustomSend';
import CustomInputToolbar from '../components/message/CustomInputToolbar';
import CustomComposer from '../components/message/CustomComposer';
import {IParam} from '../models/IParam';
import {getMessagesByRoomId, sendMessage} from '../reducers/action/chat';

type props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;
const Conversation = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const user = useAppSelector(state => state.auth.userInfo);
  const {chatId, targetId} = route.params;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setLoading(true);
    getMessagesByRoomId({
      chatId: chatId,
    })
      .then(res => {
        setMessages(res);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSend = async updatedMessages => {
    const [updatedMessage] = updatedMessages;
    const body: IParam = {
      message: updatedMessage.text,
      recipientId: targetId,
    };
    sendMessage(body);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', {user: targetId});
  };

  let content =
    loading || error ? (
      <ConversationScreenPlaceholder />
    ) : (
      <GiftedChat
        scrollToBottom
        alwaysShowSend
        inverted={false}
        maxInputLength={200}
        messages={messages}
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

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      {content}
    </View>
  );
};

export default Conversation;
