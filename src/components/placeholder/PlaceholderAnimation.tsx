import React, {useContext} from 'react';
import {Shine, ShineOverlay} from 'rn-placeholder';
import {AppContext} from '../../context';
import {ThemeVariant} from '../../theme/Colors';
import {IParam} from '../../models/IParam';

const AnimationBackground: IParam = {
  light: '#DFDFDF',
  dark: '#242424',
};

const PlaceholderAnimation = (props: any) => {
  const {themeType} = useContext(AppContext);
  const backgroundColor = AnimationBackground[themeType];

  if (themeType === ThemeVariant.light) {
    return <ShineOverlay {...props} />;
  }

  return <Shine {...props} style={{backgroundColor}} />;
};

export default PlaceholderAnimation;
