import React, {useContext, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigators/RootStack';
import {TouchableOpacity, View} from 'react-native';
import {styles} from '../components/style';
import HeaderBar from '../components/header/HeaderBar';
import {AppContext} from '../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconSizes, Pagination} from '../constants/Constants';
import {Header} from 'react-native/Libraries/NewAppScreen';
import NotificationScreenPlaceholder from '../components/placeholder/NotificationScreen.Placeholder';
import {FlatGrid} from 'react-native-super-grid';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import SvgBanner from '../components/SvgBanner';
import NotificationCard from '../components/notification/NotificationCard';
import EmptyNotifications from '../../assets/svg/empty-notifications.svg';
import {showError} from '../utils/Toast';
import {
  getNotifications,
  remarkNotification,
} from '../reducers/action/notification';

type props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const Notification = ({navigation}: props) => {
  const {theme} = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    fetchNotifications(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    remarkAllNotification();
  });

  const remarkAllNotification = async () => await remarkNotification();

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true);
      const response = await getNotifications({
        pageNumber: page,
        pageSize: Pagination.PAGE_SIZE,
      });
      setNotifications(response);
    } catch (err: any) {
      setError(true);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  let content = <NotificationScreenPlaceholder />;

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

  if (!loading && !error) {
    content = (
      <FlatGrid
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
        onEndReached={() => setPageNumber(pageNumber + 1)}
      />
    );
  }

  <View style={[styles(theme).container, styles(theme).defaultBackground]}>
    <View style={{height: 24}}>
      <HeaderBar
        firstChilden={
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name="chevron-back-outline"
              size={IconSizes.x6}
              color={theme.text01}
            />
          </TouchableOpacity>
        }
      />
      <Header title="Notifications" />
      {content}
    </View>
  </View>;
};

export default Notification;
