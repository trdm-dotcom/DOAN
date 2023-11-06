export type IconSizesType = {
  x00: number;
  x0: number;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  x6: number;
  x7: number;
  x8: number;
  x9: number;
  x10: number;
  x11: number;
  x12: number;
};

export type Dimensions = {
  height: number;
  width: number;
};

export type PostDimensionsType = {
  Small: Dimensions;
  Medium: Dimensions;
  Large: Dimensions;
};

export type PollIntervalsType = {
  messages: number;
  profile: number;
  profileView: number;
  postView: number;
  interaction: number;
  notification: number;
  lastSeen: number;
  blockList: number;
};

export type AssetType = {
  avatar: string;
  post: string;
};

export type TimeoutsType = {
  online: number;
};

export type PaginationType = {
  PAGE_SIZE: number;
  CURSOR_SIZE: number;
};

export type ThemeVariantType = {
  light: string;
  dark: string;
};

export type ThemeType = {
  type: string;
  colors: ThemeColors;
};

export type ThemeColors = {
  accent: string;
  base: string;
  text01: string;
  text02: string;
  placeholder: string;
  white: string;
};

export type ThemeStaticType = {
  accent: string;
  white: string;
  black: string;
  text01: string;
  text02: string;
  placeholder: string;
  like: string;
  unlike: string;
  translucent: string;
  delete: string;
  badge: string;
};

export type NotificationTextType = {
  REQUEST: string;
  COMMENT: string;
  LIKE: string;
  ACCEPT: string;
};

export type OnlineDotColorType = {
  true: string;
  false: string;
};
