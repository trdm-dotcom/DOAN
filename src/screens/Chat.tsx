import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../context';
import {RefreshControl, View} from 'react-native';
import {space, styles} from '../components/style';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination, SCREEN_WIDTH} from '../constants/Constants';
import Header from '../components/header/Header';
import MessageScreenPlaceholder from '../components/placeholder/MessageScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import {
  filterChatParticipants,
  sortMessageDescendingTime,
} from '../utils/shared';
import MessageCard from '../components/message/MessageCard';
import {getConversations} from '../reducers/action/chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedSearchBar from '../components/control/AnimatedSearchBar';
import {showError} from '../utils/Toast';

type props = NativeStackScreenProps<RootStackParamList, 'Chat'>;
const Chat = ({navigation}: props) => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const [search, setSearch] = useState<any>(null);
  const {user} = useSelector((state: any) => state.user);
  const {chats, isLoading, error, nextPage, totalPages} = useSelector(
    (state: any) => state.chat,
  );

  useEffect(() => {
    if (error) {
      showError(error.message);
      dispatch({type: 'clearErrors'});
    }
  }, [error]);

  useEffect(() => {
    fetchMessages(0, search);
  }, []);

  const fetchMessages = async (page: number, searchChat: any) => {
    getConversations({
      search: searchChat,
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })(dispatch);
  };

  const refreshControl = () => {
    const onRefresh = () => {
      fetchMessages(0, null);
    };

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={isLoading}
        onRefresh={onRefresh}
      />
    );
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
    isLoading || error ? (
      <MessageScreenPlaceholder />
    ) : (
      <FlatGrid
        refreshControl={refreshControl()}
        showsVerticalScrollIndicator={false}
        itemDimension={SCREEN_WIDTH}
        data={sortMessageDescendingTime(chats)}
        ListEmptyComponent={() => (
          <ListEmptyComponent listType="messages" spacing={30} />
        )}
        ListFooterComponent={() => (
          <View
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
              space(IconSizes.x1).mt,
            ]}>
            {isLoading && (
              <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
            )}
          </View>
        )}
        style={styles(theme).flatGridList}
        renderItem={renderItem}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          if (nextPage < totalPages && !isLoading) {
            fetchMessages(nextPage, search);
          }
        }}
        keyExtractor={item => item.id.toString()}
      />
    );

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            Icon={() => (
              <Ionicons
                name="arrow-back-outline"
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
      <AnimatedSearchBar
        value={search}
        placeholder="Search"
        onBlur={() => {
          setSearch(null);
          fetchMessages(0, null);
        }}
        onChangeText={(text: string) => {
          setSearch(text);
          fetchMessages(0, text);
        }}
      />
      {content}
    </View>
  );
};

export default Chat;
