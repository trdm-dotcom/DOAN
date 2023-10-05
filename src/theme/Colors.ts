import {ThemeStaticType, ThemeType, ThemeVariantType} from '../constants/Types';

export const ThemeVariant: ThemeVariantType = {
  light: 'light',
  dark: 'dark',
};

export const ThemeStatic: ThemeStaticType = {
  accent: '#846BE2',
  white: '#FFFFFF',
  black: '#000000',
  text01: '#000000',
  text02: '#BBBBBB',
  placeholder: '#F4F4F4',
  like: '#E24359',
  unlike: '#DDD',
  translucent: 'rgba(0, 0, 0, 0.1)',
  delete: '#F44336',
  badge: '#F24',
};

export const Theme: {
  [key: string]: ThemeType;
} = {
  light: {
    type: 'light',
    colors: {
      accent: '#846BE2',
      base: '#FFFFFF',
      text01: '#000000',
      text02: '#BBBBBB',
      placeholder: '#F4F4F4',
      white: '#FFFFFF',
    },
  },
  dark: {
    type: 'dark',
    colors: {
      accent: '#846BE2',
      base: '#121212',
      text01: '#FFFFFF',
      text02: '#BBBBBB',
      placeholder: '#222',
      white: '#FFFFFF',
    },
  },
};
