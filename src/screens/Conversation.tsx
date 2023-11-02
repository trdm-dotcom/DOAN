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
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes} from '../constants/Constants';
import ChatHeaderAvatar from '../components/message/ChatHeaderAvatar';
import {showError} from '../utils/Toast';

type props = NativeStackScreenProps<RootStackParamList, 'Conversation'>;
const Conversation = ({navigation, route}: props) => {
  const {theme} = useContext(AppContext);
  const user = useAppSelector(state => state.auth.userInfo);
  const {chatId, targetId, name, avatar} = route.params;

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
      messagesId: updatedMessage._id,
      message: updatedMessage.text,
      recipientId: targetId,
    };
    sendMessage(body)
      .then(() => {
        setMessages(previousMessages =>
          GiftedChat.prepend(previousMessages, updatedMessages),
        );
      })
      .catch(err => {
        showError(err.message);
      });
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', {userId: targetId});
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
        user={{_id: user.id, name: user.name, avatar: user.avatar}}
        keyboardShouldPersistTaps={null}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          style: {marginBottom: 16},
        }}
      />
    );

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <>
            <IconButton
              Icon={() => (
                <Ionicons
                  name="chevron-back-outline"
                  size={IconSizes.x8}
                  color={theme.text01}
                />
              )}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <ChatHeaderAvatar avatar={avatar} onPress={navigateToProfile} />
          </>
        }
        title={name}
      />
      {content}
    </View>
  );
};

export default Conversation;
