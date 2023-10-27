import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import PostCard from '../components/post/PostCard';
import PostCardPlaceholder from '../components/placeholder/PostCard.Placeholder';
import SvgBanner from '../components/SvgBanner';
import EmptyFeed from '../../assets/svg/empty-feed.svg';
import {FlatGrid} from 'react-native-super-grid';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {IconSizes, Pagination} from '../constants/Constants';
import {getPosts} from '../reducers/action/post';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import HeaderBar from '../components/header/HeaderBar';
import IconButton from '../components/control/IconButton';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/header/Header';

const Feed = () => {
  const {theme} = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userFeed, setUserFeed] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    userFeedRefetch(pageNumber);
  }, []);

  const userFeedRefetch = async (page: number) => {
    setLoading(true);
    getPosts({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })
      .then(response => {
        setUserFeed(response);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

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
    const onRefresh = () => userFeedRefetch(1);

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    );
  };

  let content = <PostCardPlaceholder />;

  if (!loading && !error) {
    content = (
      <FlatGrid
        refreshControl={refreshControl()}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={userFeed}
        ListEmptyComponent={() => (
          <SvgBanner
            Svg={EmptyFeed}
            spacing={20}
            placeholder={'No new posts'}
          />
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
            {loading && (
              <LoadingIndicator size={IconSizes.x1} color={theme.placeholder} />
            )}
          </View>
        )}
        style={[
          {
            flex: 1,
          },
          space(IconSizes.x5).mt,
        ]}
        spacing={20}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => setPageNumber(pageNumber + 1)}
      />
    );
  }

  return (
    <View style={[styles(theme).container, styles(theme).defaultBackground]}>
      <HeaderBar
        firstChilden={
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
        secondChilden={
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
      <Header title="Feed" />
      {content}
    </View>
  );
};

export default Feed;
