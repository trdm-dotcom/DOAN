import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import PostCard from '../components/post/PostCard';
import PostCardPlaceholder from '../components/placeholder/PostCard.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import {
  FETCHING_HEIGHT,
  IconSizes,
  Pagination,
  SCREEN_WIDTH,
} from '../constants/Constants';
import {getPosts} from '../reducers/action/post';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';

const Feed = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {posts, isLoading, error} = useSelector((state: any) => state.post);

  const [pageNumber, setPageNumber] = useState(0);
  const navigation = useNavigation();
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    fetchFeed(pageNumber);
  }, [pageNumber]);

  const fetchFeed = (page: number) => {
    getPosts({
      page: page,
      limit: Pagination.PAGE_SIZE,
    })(dispatch);
  };

  function onScroll(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
  }

  function onScrollEndDrag(event: any) {
    const {nativeEvent} = event;
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    setOffsetY(y);
    if (y <= -FETCHING_HEIGHT && !isLoading) {
      setPageNumber(pageNumber + 1);
    }
  }

  function onRelease() {
    if (offsetY <= -FETCHING_HEIGHT && !isLoading) {
      setPageNumber(pageNumber + 1);
    }
  }

  const renderItem = ({item}) => {
    return (
      <PostCard
        id={item.id}
        author={item.author}
        time={item.createdAt}
        uri={item.source}
        likes={item.reactions}
        comments={item.comments}
        caption={item.caption}
      />
    );
  };

  const refreshControl = () => {
    const onRefresh = () => {
      setPageNumber(0);
      fetchFeed(0);
    };

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={isLoading}
        onRefresh={onRefresh}
      />
    );
  };

  let content =
    isLoading || error ? (
      <PostCardPlaceholder />
    ) : (
      <FlatGrid
        refreshControl={refreshControl()}
        showsVerticalScrollIndicator={false}
        itemDimension={SCREEN_WIDTH}
        data={posts}
        ListEmptyComponent={() => (
          <ListEmptyComponent listType="posts" spacing={30} />
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
        style={[
          {
            flex: 1,
          },
        ]}
        spacing={20}
        renderItem={renderItem}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
        onResponderRelease={onRelease}
        keyExtractor={item => item.id.toString()}
      />
    );

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        contentLeft={
          <IconButton
            onPress={() => {
              navigation.navigate('Camera');
            }}
            Icon={() => (
              <Feather name="camera" size={IconSizes.x6} color={theme.text01} />
            )}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              padding: IconSizes.x1,
              borderRadius: 50,
            }}
          />
        }
        contentRight={
          <IconButton
            onPress={() => {
              navigation.navigate('Chat');
            }}
            Icon={() => (
              <Feather
                name="message-square"
                size={IconSizes.x6}
                color={theme.text01}
              />
            )}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.placeholder,
              padding: IconSizes.x1,
              borderRadius: 50,
            }}
          />
        }
      />
      {content}
    </View>
  );
};

export default Feed;
