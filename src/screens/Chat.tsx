import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../context';
import {View} from 'react-native';
import {styles} from '../components/style';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination} from '../constants/Constants';
import Header from '../components/header/Header';
import SearchBar from '../components/header/SearchBar';
import MessageScreenPlaceholder from '../components/placeholder/MessageScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import SvgBanner from '../components/SvgBanner';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import EmptyMessages from '../../assets/svg/empty-messages.svg';
import {
  filterChatParticipants,
  isUserOnline,
  sortMessageAscendingTime,
} from '../utils/shared';
import MessageCard from '../components/message/MessageCard';
import {useAppSelector} from '../reducers/redux/store';
import {getConversations} from '../reducers/action/chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';

type props = NativeStackScreenProps<RootStackParamList, 'Chat'>;
const Chat = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const user = useAppSelector(state => state.auth.userInfo);
  const [chatSearch, setChatSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages(pageNumber);
  }, [pageNumber]);

  const fetchMessages = async (page: number) => {
    setLoading(true);
    getConversations({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })
      .then(res => {
        setChats([...chats, ...res]);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    const {id: chatId, participants, messages} = item;
    const [participant] = filterChatParticipants(user.id, participants);
    const [lastMessage] = messages;

    const {id, avatar, handle, lastSeen} = participant;
    const {
      id: messageId,
      author: {id: authorId},
      seen,
      body: messageBody,
      createdAt: time,
    } = lastMessage;

    const isOnline = isUserOnline(lastSeen);

    return (
      <MessageCard
        chatId={chatId}
        participantId={id}
        avatar={avatar}
        handle={handle}
        authorId={authorId}
        messageId={messageId}
        messageBody={messageBody}
        seen={seen}
        time={time}
        isOnline={isOnline}
      />
    );
  };

  let content = <MessageScreenPlaceholder />;

  if (!loading && !error) {
    const sortedChats = sortMessageAscendingTime(chats);

    content = (
      <FlatGrid
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={sortedChats}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        ListEmptyComponent={() => (
          <SvgBanner
            Svg={EmptyMessages}
            spacing={16}
            placeholder="No messages"
          />
        )}
        style={styles().messagesList}
        spacing={20}
        renderItem={renderItem}
      />
    );
  }

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
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
        }
      />
      <Header title="Messages" />
      <SearchBar
        value={chatSearch}
        onChangeText={setChatSearch}
        placeholder="Search for chats..."
      />
      {content}
    </View>
  );
};

export default Chat;
