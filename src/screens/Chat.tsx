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
    const {id: chatId, users, lastMessage} = item;
    const [participant] = filterChatParticipants(user.id, users);

    const {id, avatar, name} = participant;
    const {
      userId: authorId,
      seen,
      message: messageBody,
      createdAt: time,
    } = lastMessage;

    return (
      <MessageCard
        chatId={chatId}
        participantId={id}
        avatar={avatar}
        name={name}
        authorId={authorId}
        messageBody={messageBody}
        seen={seen}
        time={time}
      />
    );
  };

  let content =
    loading || error ? (
      <MessageScreenPlaceholder />
    ) : (
      <FlatGrid
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={sortMessageAscendingTime(chats)}
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
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          setPageNumber(pageNumber + 1);
        }}
      />
    );

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
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
