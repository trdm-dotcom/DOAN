import {Dimensions, Platform} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {
  AssetType,
  IconSizesType,
  NotificationTextType,
  OnlineDotColorType,
  PaginationType,
  PollIntervalsType,
  PostDimensionsType,
  TimeoutsType,
} from './Types';
import {responsiveWidth} from 'react-native-responsive-dimensions';

export const CONTENT_SPACING = 15;

export const SAFE_AREA_PADDING = {
  paddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + CONTENT_SPACING,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + CONTENT_SPACING,
  paddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + CONTENT_SPACING,
  paddingBottom: StaticSafeAreaInsets.safeAreaInsetsBottom + CONTENT_SPACING,
  paddingVertical: CONTENT_SPACING,
  paddingHorizontal: CONTENT_SPACING,
};

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;
export const SCALE_FULL_ZOOM = 3;
export const CAPTURE_BUTTON_SIZE = 78;
export const FETCHING_HEIGHT = 300;

export const IconSizes: IconSizesType = {
  x00: 4,
  x0: 6,
  x1: 10,
  x2: 12,
  x3: 14,
  x4: 16,
  x5: 20,
  x6: 24,
  x7: 28,
  x8: 32,
  x9: 40,
  x10: 50,
  x11: 60,
  x12: 100,
};

export const PollIntervals: PollIntervalsType = {
  messages: 2 * 1000,
  profile: 1000,
  profileView: 1000,
  postView: 2 * 1000,
  interaction: 1000,
  notification: 2 * 1000,
  lastSeen: 10 * 1000,
  blockList: 1000,
};

export const Asset: AssetType = {
  avatar: 'avatar',
  post: 'post',
};

export const Timeouts: TimeoutsType = {
  online: 12,
};

export const Pagination: PaginationType = {
  PAGE_SIZE: 20,
  CURSOR_SIZE: 9,
};

export const PostDimensions: PostDimensionsType = {
  Small: {height: responsiveWidth(29), width: responsiveWidth(29)},
  Medium: {height: responsiveWidth(43), width: responsiveWidth(43)},
  Large: {height: responsiveWidth(90), width: responsiveWidth(90)},
};

export const NotificationType: NotificationTextType = {
  REQUEST: 'REQUEST',
  COMMENT: 'COMMENT',
  LIKE: 'LIKE',
  ACCEPT: 'ACCEPT',
  TAG: 'TAG',
  MENTION_ON_COMMENT: 'MENTION_ON_COMMENT',
  MENTION_ON_POST: 'MENTION_ON_POST',
};

export const NotificationText: NotificationTextType = {
  REQUEST: 'has sent you a friend request',
  COMMENT: 'commented on your post',
  LIKE: 'liked your post',
  ACCEPT: 'accepted your friend request',
  TAG: 'tagged you in a post',
  MENTION_ON_COMMENT: 'mentioned you in a comment',
  MENTION_ON_POST: 'mentioned you in a post',
};

export const OnlineDotColor: OnlineDotColorType = {
  true: '#4caf50',
  false: '#BBBBBB',
};
