import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import {
  FETCHING_HEIGHT,
  IconSizes,
  Pagination,
  SCREEN_WIDTH,
} from '../constants/Constants';
import NotificationScreenPlaceholder from '../components/placeholder/NotificationScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import NotificationCard from '../components/notification/NotificationCard';
import {
  getNotifications,
  remarkNotification,
} from '../reducers/action/notification';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../components/header/Header';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';

const Notifi = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {notifications, isLoading, error} = useSelector(
    (state: any) => state.notification,
  );
  const [pageNumber, setPageNumber] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useFocusEffect(
    useCallback(() => {
      remarkAllNotification();
    }, []),
  );

  useEffect(() => {
    fetchNotifications(pageNumber);
  }, [pageNumber]);

  const remarkAllNotification = () => remarkNotification()(dispatch);

  const fetchNotifications = (page: number) => {
    getNotifications({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
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

  const refreshControl = () => {
    const onRefresh = () => fetchNotifications(1);

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={isLoading}
        onRefresh={onRefresh}
      />
    );
  };

  const renderItem = ({item}) => {
    return (
      <NotificationCard
        avatar={item.author.avatar}
        name={item.author.name}
        type={item.type}
        resourceId={item.sourceId}
        time={item.date}
      />
    );
  };

  let content =
    isLoading || error ? (
      <NotificationScreenPlaceholder />
    ) : (
      <FlatGrid
        refreshControl={refreshControl()}
        showsVerticalScrollIndicator={false}
        itemDimension={SCREEN_WIDTH}
        data={notifications}
        ListEmptyComponent={() => (
          <ListEmptyComponent listType="notifications" spacing={30} />
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
        spacing={20}
        renderItem={renderItem}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
        onResponderRelease={onRelease}
        keyExtractor={item => item.id.toString()}
      />
    );

  return (
    <>
      <View style={[styles(theme).container, styles(theme).defaultBackground]}>
        <Header title="Notifications" />
        {content}
      </View>
    </>
  );
};

export default Notifi;
