import React, {useContext, useEffect} from 'react';
import {RefreshControl, View} from 'react-native';
import {space, styles} from '../components/style';
import {AppContext} from '../context';
import {IconSizes, Pagination, SCREEN_WIDTH} from '../constants/Constants';
import NotificationScreenPlaceholder from '../components/placeholder/NotificationScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import NotificationCard from '../components/notification/NotificationCard';
import {getNotifications} from '../reducers/action/notification';
import Header from '../components/header/Header';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import ListEmptyComponent from '../components/shared/ListEmptyComponent';
import {useDispatch, useSelector} from 'react-redux';

const Notifi = () => {
  const dispatch = useDispatch();
  const {theme} = useContext(AppContext);
  const {notifications, isLoading, error, nextPage, totalPages} = useSelector(
    (state: any) => state.notification,
  );

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const fetchNotifications = (page: number) => {
    getNotifications({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })(dispatch);
  };

  const refreshControl = () => {
    const onRefresh = () => fetchNotifications(0);

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
        author={item.author}
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
        renderItem={renderItem}
        onEndReachedThreshold={0.8}
        onEndReached={() => {
          if (nextPage < totalPages && !isLoading) {
            fetchNotifications(nextPage);
          }
        }}
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
