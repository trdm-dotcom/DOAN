import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {styles} from '../components/style';
import {AppContext} from '../context';
import {Pagination} from '../constants/Constants';
import NotificationScreenPlaceholder from '../components/placeholder/NotificationScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import SvgBanner from '../components/SvgBanner';
import NotificationCard from '../components/notification/NotificationCard';
import EmptyNotifications from '../../assets/svg/empty-notifications.svg';
import {
  getNotifications,
  remarkNotification,
} from '../reducers/action/notification';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../components/header/Header';

const Notifi = () => {
  const {theme} = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      remarkAllNotification();
      setPageNumber(0);
    }, []),
  );

  useEffect(() => {
    fetchNotifications(pageNumber);
    return () => {};
  }, [pageNumber]);

  const remarkAllNotification = async () => await remarkNotification();

  const fetchNotifications = (page: number) => {
    setLoading(true);
    getNotifications({
      pageNumber: page,
      pageSize: Pagination.PAGE_SIZE,
    })
      .then(res => {
        setNotifications([...notifications, ...res]);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refreshControl = () => {
    const onRefresh = () => fetchNotifications(1);

    return (
      <RefreshControl
        tintColor={theme.text02}
        refreshing={loading}
        onRefresh={onRefresh}
      />
    );
  };

  const renderItem = (item: any) => {
    return (
      <NotificationCard
        notificationText={item.content}
        avatar={item.avatar}
        name={item.name}
        type={item.type}
        resourceId={item.resourceId}
        time={item.createdAt}
      />
    );
  };

  let content =
    loading || error ? (
      <NotificationScreenPlaceholder />
    ) : (
      <FlatGrid
        refreshControl={refreshControl()}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={notifications}
        ListEmptyComponent={() => (
          <SvgBanner
            Svg={EmptyNotifications}
            spacing={20}
            placeholder="No notifications yet"
          />
        )}
        style={[
          {
            flex: 1,
            paddingHorizontal: 4,
          },
        ]}
        spacing={20}
        renderItem={renderItem}
        onEndReached={() => {
          setPageNumber(pageNumber + 1);
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
